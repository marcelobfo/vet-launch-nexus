
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

    // Send magic link
    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          company_id: companyData.id,
          company_code: companyCode
        }
      }
    });

    if (magicLinkError) {
      console.error("Error sending magic link:", magicLinkError);
      return { 
        success: false, 
        message: 'Não foi possível enviar o link de acesso. Tente novamente.'
      };
    }

    // If we got here, the magic link was sent successfully
    return { 
      success: true, 
      message: 'Link de acesso enviado com sucesso para seu e-mail.'
    };
  } catch (error) {
    console.error("Error sending magic link:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
    };
  }
};
