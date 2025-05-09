
import { supabase } from '@/integrations/supabase/client';
import { getSessionFromLocalStorage, setSessionToLocalStorage } from './authUtils';

export const sendLoginCode = async (email: string, companyCode: string, whatsapp?: string) => {
  try {
    // Verificar se a empresa existe
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();

    if (companyError || !companyData) {
      return {
        success: false,
        message: 'Empresa não encontrada ou inativa. Verifique o código informado.',
      };
    }

    // Verificar se o usuário existe para esta empresa
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .eq('is_active', true)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      // Erro diferente de "not found"
      console.error('Erro ao verificar usuário:', userError);
      return {
        success: false,
        message: 'Erro ao verificar usuário. Tente novamente mais tarde.',
      };
    }

    // Se o usuário não existe e o auto-cadastro está desabilitado
    if (!userData && !companyData.allow_signup) {
      return {
        success: false,
        message: 'Usuário não encontrado. O auto-cadastro está desabilitado para esta empresa.',
      };
    }

    // Gerar código de acesso (6 dígitos numéricos)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Inserir o código no banco e definir expiração (15 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutos

    const { error: codeError } = await supabase
      .from('access_codes')
      .insert({
        email,
        company_id: companyData.id,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (codeError) {
      console.error('Erro ao salvar código de acesso:', codeError);
      return {
        success: false,
        message: 'Erro ao gerar código de acesso. Tente novamente mais tarde.',
      };
    }

    // Enviar email com o código (usando a edge function)
    const { error: emailError } = await supabase.functions.invoke('send-email-smtp', {
      body: {
        to: email,
        subject: 'Seu código de acesso',
        body: `<h1>Seu código de acesso</h1><p>Use o código <strong>${code}</strong> para acessar a plataforma. Este código expira em 15 minutos.</p>`,
        companyId: companyData.id,
        whatsapp: whatsapp || userData?.whatsapp,
        code: code,
        type: 'access_code'
      }
    });

    if (emailError) {
      console.error('Erro ao enviar email:', emailError);
      return {
        success: false,
        message: 'Erro ao enviar o código. Tente novamente mais tarde.',
      };
    }

    return {
      success: true,
      message: `Código de acesso enviado para ${email}. Verifique sua caixa de entrada.`,
    };
  } catch (error: any) {
    console.error('Erro no envio de código:', error);
    return {
      success: false,
      message: error.message || 'Ocorreu um erro ao enviar o código de acesso.',
    };
  }
};

export const verifyLoginCode = async (email: string, code: string, companyCode: string) => {
  try {
    // Verificar se a empresa existe
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();

    if (companyError || !companyData) {
      return {
        success: false,
        message: 'Empresa não encontrada ou inativa.',
      };
    }

    // Verificar o código de acesso
    const now = new Date().toISOString();
    const { data: codeData, error: codeError } = await supabase
      .from('access_codes')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (codeError || !codeData) {
      return {
        success: false,
        message: 'Código inválido ou expirado.',
      };
    }

    // Verificar se o usuário existe
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .single();

    // Se o usuário não existe e o auto-cadastro está habilitado, criar o usuário
    if (userError && userError.code === 'PGRST116' && companyData.allow_signup) {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          email,
          name: email.split('@')[0], // Nome temporário baseado no email
          company_id: companyData.id,
          role: 'user', // Papel padrão
        })
        .select();

      if (createUserError || !newUser || newUser.length === 0) {
        console.error('Erro ao criar usuário:', createUserError);
        return {
          success: false,
          message: 'Erro ao criar usuário. Tente novamente mais tarde.',
        };
      }

      userData = newUser[0];
    } else if (userError) {
      console.error('Erro ao verificar usuário:', userError);
      return {
        success: false,
        message: 'Erro ao verificar usuário. Tente novamente mais tarde.',
      };
    }

    // Verificar se o usuário está ativo
    if (!userData.is_active) {
      return {
        success: false,
        message: 'Sua conta está desativada. Entre em contato com o administrador.',
      };
    }

    // Marcar o código como usado
    await supabase
      .from('access_codes')
      .update({ is_used: true })
      .eq('id', codeData.id);

    // Atualizar último login do usuário
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userData.id);
      
    // Gerar sessão do usuário usando supabase auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: code + companyCode, // Combinação improvável apenas para uso interno
    });
    
    if (signInError) {
      // Se falhar, criar um usuário anônimo e autenticar
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: code + companyCode,
        options: {
          data: {
            company_id: companyData.id,
            user_id: userData.id,
          }
        }
      });
      
      if (signUpError) {
        console.error('Erro na autenticação:', signUpError);
        
        // Em caso de erro, criar sessão manual
        const customSession = {
          user: userData,
          company: companyData,
        };
        
        setSessionToLocalStorage(customSession);
        
        return {
          success: true,
          message: 'Login realizado com sucesso (modo alternativo).',
          user: userData,
          company: companyData,
        };
      }
    }

    // Autenticação bem-sucedida, criar sessão
    const customSession = {
      user: userData,
      company: companyData,
    };
    
    setSessionToLocalStorage(customSession);

    return {
      success: true,
      message: 'Login realizado com sucesso.',
      user: userData,
      company: companyData,
    };
  } catch (error: any) {
    console.error('Erro na verificação do código:', error);
    return {
      success: false,
      message: error.message || 'Ocorreu um erro ao verificar o código de acesso.',
    };
  }
};
