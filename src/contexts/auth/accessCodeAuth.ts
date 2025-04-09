
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/supabase';

export const sendLoginCode = async (email: string, companyCode: string) => {
  try {
    // Verify if the company exists with the provided code
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();
    
    if (companyError || !companyData) {
      return { 
        success: false, 
        message: 'Código de empresa inválido ou empresa inativa.'
      };
    }

    // Verify if the user exists in this company
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .eq('is_active', true)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Error code when no results are found
      console.error("Error checking user:", userError);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao verificar o usuário. Tente novamente.'
      };
    }

    // If user doesn't exist and the company doesn't allow auto-registration, return error
    if (!userData && !companyData.allow_signup) {
      return {
        success: false,
        message: 'Usuário não encontrado para esta empresa. Entre em contato com o administrador.'
      };
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code valid for 15 minutes

    // Save the code in the access codes table
    const { error: codeError } = await supabase
      .from('access_codes')
      .insert({
        email,
        company_id: companyData.id,
        code,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });

    if (codeError) {
      console.error("Error generating access code:", codeError);
      return { 
        success: false, 
        message: 'Não foi possível gerar o código de acesso. Tente novamente.'
      };
    }

    // Send email with the code
    // Check if the company has SMTP configuration
    if (companyData.smtp_host && companyData.smtp_port && companyData.smtp_user && companyData.smtp_pass) {
      // In a real environment, we would call an Edge Function to send the email
      // As an example, we'll simulate this with a console.log
      console.log(`Sending code ${code} to ${email} using SMTP from company ${companyData.name}`);
      
      // Here we would call a Supabase edge function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Seu código de acesso',
          body: `Seu código de acesso é: ${code}`,
          companyId: companyData.id
        }
      });
      
      if (emailError) {
        console.error("Error sending email:", emailError);
        return { 
          success: false, 
          message: 'Não foi possível enviar o código por e-mail. Tente novamente ou contate o suporte.'
        };
      }
    } else {
      // If there's no SMTP configuration, show the code in the console (development only)
      console.log(`ACCESS CODE: ${code} (for ${email} in company ${companyData.name})`);
      // In production, we would return an error asking to configure SMTP
    }

    return { 
      success: true, 
      message: 'Código de acesso enviado com sucesso.'
    };
  } catch (error) {
    console.error("Error sending access code:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
    };
  }
};

export const verifyLoginCode = async (email: string, code: string, companyCode: string) => {
  try {
    // Find the company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();
    
    if (companyError || !companyData) {
      return { 
        success: false, 
        message: 'Código de empresa inválido ou empresa inativa.'
      };
    }

    // Verify the access code
    const now = new Date().toISOString();
    const { data: accessCodeData, error: accessCodeError } = await supabase
      .from('access_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('company_id', companyData.id)
      .eq('is_used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (accessCodeError || !accessCodeData) {
      return { 
        success: false, 
        message: 'Código inválido, expirado ou já utilizado. Solicite um novo código.'
      };
    }

    // Mark the code as used
    await supabase
      .from('access_codes')
      .update({ is_used: true })
      .eq('id', accessCodeData.id);

    // Find or create the user
    let userData: User;
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error("Error finding user:", userError);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao verificar seus dados. Tente novamente.'
      };
    }

    if (existingUser) {
      // Update last login
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ last_login: now })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating last login:", updateError);
        return { 
          success: false, 
          message: 'Erro ao atualizar dados de login. Tente novamente.'
        };
      }

      userData = updatedUser as User;
    } else {
      // If user doesn't exist, check if auto-registration is allowed
      if (!companyData.allow_signup) {
        return {
          success: false,
          message: 'Usuário não cadastrado. Entre em contato com o administrador da empresa.'
        };
      }

      // Create a new basic user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name: email.split('@')[0], // Temporary name based on email
          company_id: companyData.id,
          role: 'user', // Basic role
          is_active: true,
          last_login: now
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return { 
          success: false, 
          message: 'Não foi possível criar seu usuário. Tente novamente ou contate o suporte.'
        };
      }

      userData = newUser as User;
    }

    // Return the session data
    return { 
      success: true,
      message: 'Login realizado com sucesso!',
      user: userData,
      company: companyData
    };
  } catch (error) {
    console.error("Error verifying code:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao verificar o código. Tente novamente.'
    };
  }
};
