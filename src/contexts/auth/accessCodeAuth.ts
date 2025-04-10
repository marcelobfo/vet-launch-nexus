
import { supabase } from '@/integrations/supabase/client';

// Function to verify an access code
export const verifyLoginCode = async (email: string, code: string, companyCode: string) => {
  try {
    // Find the company by code
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();
    
    if (companyError || !companyData) {
      console.error("Company not found:", companyCode, companyError);
      return { 
        success: false, 
        message: 'Empresa não encontrada ou inativa.' 
      };
    }
    
    // Find the access code
    const { data: accessCode, error: accessCodeError } = await supabase
      .from('access_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('company_id', companyData.id)
      .eq('is_used', false)
      .single();
    
    if (accessCodeError || !accessCode) {
      console.error("Access code not found:", accessCodeError);
      return { 
        success: false, 
        message: 'Código de acesso inválido ou já utilizado.' 
      };
    }
    
    // Check if the code is expired
    const now = new Date();
    const expiresAt = new Date(accessCode.expires_at);
    
    if (now > expiresAt) {
      return { 
        success: false, 
        message: 'Código de acesso expirado.' 
      };
    }
    
    // Mark the code as used
    await supabase
      .from('access_codes')
      .update({ is_used: true })
      .eq('id', accessCode.id);
    
    // Check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .single();
    
    // If the user doesn't exist and the company allows auto-registration, create the user
    let user = userData;
    if (!userData && companyData.allow_signup) {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: email,
          name: email.split('@')[0], // Default name based on email
          company_id: companyData.id,
          role: 'user',
          is_active: true,
          last_login: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createUserError) {
        console.error("Error creating user:", createUserError);
        return { 
          success: false, 
          message: 'Não foi possível criar seu usuário.' 
        };
      }
      
      user = newUser;
    } else if (!userData) {
      return { 
        success: false, 
        message: 'Usuário não encontrado para esta empresa.' 
      };
    }
    
    // Update the last login date
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);
    
    // Return success with user and company data
    return { 
      success: true, 
      message: 'Login realizado com sucesso.',
      user,
      company: companyData
    };
  } catch (error) {
    console.error("Error verifying access code:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação.' 
    };
  }
};

// Function to send an access code via email
export const sendLoginCode = async (email: string, companyCode: string) => {
  // Reuse the sendMagicLink function which now sends access codes
  const { sendMagicLink } = await import('./magicLinkAuth');
  return await sendMagicLink(email, companyCode);
};
