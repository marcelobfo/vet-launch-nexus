
import { supabase } from '@/integrations/supabase/client';

// Função para verificar um código de acesso
export const verifyLoginCode = async (email: string, code: string, companyCode: string) => {
  try {
    // Buscar a empresa pelo código
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();
    
    if (companyError || !companyData) {
      return { 
        success: false, 
        message: 'Empresa não encontrada ou inativa.' 
      };
    }
    
    // Buscar o código de acesso
    const { data: accessCode, error: accessCodeError } = await supabase
      .from('access_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('company_id', companyData.id)
      .eq('is_used', false)
      .single();
    
    if (accessCodeError || !accessCode) {
      return { 
        success: false, 
        message: 'Código de acesso inválido ou já utilizado.' 
      };
    }
    
    // Verificar se o código não expirou
    const now = new Date();
    const expiresAt = new Date(accessCode.expires_at);
    
    if (now > expiresAt) {
      return { 
        success: false, 
        message: 'Código de acesso expirado.' 
      };
    }
    
    // Marcar o código como usado
    await supabase
      .from('access_codes')
      .update({ is_used: true })
      .eq('id', accessCode.id);
    
    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .single();
    
    // Se o usuário não existir e a empresa permitir auto-cadastro, criar o usuário
    let user = userData;
    if (!userData && companyData.allow_signup) {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email: email,
          name: email.split('@')[0], // Nome padrão baseado no email
          company_id: companyData.id,
          role: 'user',
          is_active: true,
          last_login: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createUserError) {
        console.error("Erro ao criar usuário:", createUserError);
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
    
    // Atualizar a data do último login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);
    
    // Retornar sucesso com os dados do usuário e da empresa
    return { 
      success: true, 
      message: 'Login realizado com sucesso.',
      user,
      company: companyData
    };
  } catch (error) {
    console.error("Erro ao verificar código de acesso:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação.' 
    };
  }
};

// Função para enviar um código de acesso por email
export const sendLoginCode = async (email: string, companyCode: string) => {
  // Reutilizamos a função sendMagicLink que já foi adaptada para enviar códigos
  const { sendMagicLink } = await import('./magicLinkAuth');
  return await sendMagicLink(email, companyCode);
};
