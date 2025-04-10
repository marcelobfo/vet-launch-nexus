
import { supabase } from '@/integrations/supabase/client';

export const sendMagicLink = async (email: string, companyCode: string) => {
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

    // Check if SMTP is configured
    if (!companyData.smtp_host || !companyData.smtp_user || !companyData.smtp_pass || !companyData.smtp_from) {
      console.error("SMTP not configured for company:", companyCode);
      // Fall back to Supabase's built-in magic link if SMTP isn't configured
      return await sendSupabaseMagicLink(email, companyData);
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

    // Generate a temporary login code that will be valid for 1 hour
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Store the token in the database
    const { error: tokenError } = await supabase
      .from('access_codes')
      .insert({
        email,
        code: token,
        company_id: companyData.id,
        expires_at: expires_at.toISOString(),
        is_used: false
      });

    if (tokenError) {
      console.error("Error storing token:", tokenError);
      return { 
        success: false, 
        message: 'Não foi possível gerar o código de acesso. Tente novamente.'
      };
    }

    // Generate email HTML content
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Código de Acesso</h2>
        <p style="color: #666;">Olá,</p>
        <p style="color: #666;">Aqui está seu código de acesso para o sistema:</p>
        <div style="background-color: #f5f5f5; padding: 12px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; border-radius: 4px; letter-spacing: 2px;">${token}</div>
        <p style="color: #666;">Use este código na tela de login para acessar o sistema.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Este código é válido por 1 hora. Se você não solicitou este código, por favor ignore este e-mail.</p>
        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} ${companyData.name}</p>
      </div>
    `;

    // Send email using custom SMTP function
    const emailResult = await sendEmailWithCustomSMTP(
      email,
      "Código de acesso ao sistema",
      emailBody,
      companyData.id
    );

    if (!emailResult.success) {
      console.error("Error sending email:", emailResult.error);
      // Try fallback to Supabase's built-in magic link
      return await sendSupabaseMagicLink(email, companyData);
    }

    // If we got here, the code was sent successfully
    return { 
      success: true, 
      message: 'Código de acesso enviado com sucesso para seu e-mail.'
    };
  } catch (error) {
    console.error("Error sending access code:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
    };
  }
};

// Fallback to Supabase's built-in magic link
const sendSupabaseMagicLink = async (email: string, companyData: any) => {
  try {
    // Get the current domain/origin properly
    const currentOrigin = window.location.origin;
    
    // Send magic link using Supabase
    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${currentOrigin}/auth/callback`,
        data: {
          company_id: companyData.id,
          company_code: companyData.code
        }
      }
    });

    if (magicLinkError) {
      console.error("Error sending Supabase magic link:", magicLinkError);
      return { 
        success: false, 
        message: 'Não foi possível enviar o código de acesso. Tente novamente.'
      };
    }

    return { 
      success: true, 
      message: 'Link de acesso enviado com sucesso para seu e-mail.'
    };
  } catch (error) {
    console.error("Error sending Supabase magic link:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao enviar o link de acesso. Tente novamente.'
    };
  }
};

// Function to send email using our custom SMTP edge function
const sendEmailWithCustomSMTP = async (to: string, subject: string, body: string, companyId: string) => {
  try {
    const response = await supabase.functions.invoke('send-email-smtp', {
      body: { to, subject, body, companyId }
    });
    
    if (response.error) {
      throw new Error(response.error.message || 'Error sending email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email via SMTP:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error sending email'
    };
  }
};
