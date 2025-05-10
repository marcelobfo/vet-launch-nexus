import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

interface RegistrationResult {
  success: boolean;
  message: string;
  user?: any;
}

export const registerWithAccessCode = async (
  email: string,
  password: string,
  accessCode: string,
  name?: string,
  whatsapp?: string
): Promise<RegistrationResult> => {
  try {
    // Verify access code
    const { data: accessCodeData, error: accessCodeError } = await supabase
      .from('access_codes')
      .select('company_id, is_used, expires_at')
      .eq('code', accessCode)
      .eq('email', email)
      .single();

    if (accessCodeError || !accessCodeData) {
      return { success: false, message: 'Código de acesso inválido.' };
    }

    if (accessCodeData.is_used) {
      return { success: false, message: 'Este código de acesso já foi utilizado.' };
    }

    if (new Date(accessCodeData.expires_at) < new Date()) {
      return { success: false, message: 'Este código de acesso expirou.' };
    }

    // Proceed with user signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          whatsapp: whatsapp,
          company_id: accessCodeData.company_id,
          role: 'user',
          is_active: true
        }
      }
    });

    if (authError) {
      console.error('Authentication error:', authError);
      return { success: false, message: authError.message };
    }

    // Update user's company_id in the users table
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ company_id: accessCodeData.company_id })
      .eq('id', authData.user.id);

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      return { success: false, message: 'Erro ao atualizar informações do usuário.' };
    }

    // Mark access code as used
    const { error: accessCodeUpdateError } = await supabase
      .from('access_codes')
      .update({ is_used: true })
      .eq('code', accessCode);

    if (accessCodeUpdateError) {
      console.error('Access code update error:', accessCodeUpdateError);
      return { success: false, message: 'Erro ao atualizar o código de acesso.' };
    }

    return { success: true, message: 'Registro realizado com sucesso!', user: authData.user };

  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Ocorreu um erro ao realizar o registro.' };
  }
};

export const registerWithSignUp = async (
  email: string,
  password: string,
  companyCode: string,
  name?: string,
  whatsapp?: string
): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    // First, attempt to sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          whatsapp: whatsapp,
          role: 'user',
          is_active: true
        }
      }
    });
    
    if (authError) {
      console.error('Authentication error:', authError);
      return { success: false, message: authError.message };
    }
    
    // Check company code
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('name, code')
      .eq('code', companyCode)
      .single();

    if (companyError || !companyData) {
      return { success: false, message: 'Código da empresa inválido.' };
    }

    // Update user's company_id in the users table
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ company_id: companyData.id })
      .eq('id', authData.user.id);

    if (userUpdateError) {
      console.error('User update error:', userUpdateError);
      return { success: false, message: 'Erro ao atualizar informações do usuário.' };
    }

    return { success: true, message: 'Registro realizado com sucesso!', user: authData.user };

  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Ocorreu um erro ao realizar o registro.' };
  }
};

export const confirmEmail = async (token: string) => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      type: 'email',
      token: token,
    })

    if (error) {
      console.error('confirmEmail error', error)
      return {
        data: null,
        error,
      }
    }

    return {
      data: { message: 'Email confirmado com sucesso!' },
      error: null,
    }
  } catch (e: any) {
    console.error('confirmEmail error', e)
    return {
      data: null,
      error: new AuthError(e.message, e.status),
    }
  }
}
