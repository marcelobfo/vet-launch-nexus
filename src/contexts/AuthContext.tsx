
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Company } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  sendLoginCode: (email: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  verifyLoginCode: (email: string, code: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  sendMagicLink: (email: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; email: string; whatsapp: string; companyName: string }) => Promise<{ success: boolean; message?: string; companyCode?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    company: null,
    isLoading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o usuário já está autenticado no localStorage
    const checkAuth = async () => {
      const session = localStorage.getItem('session');
      
      if (session) {
        try {
          const { user, company } = JSON.parse(session);
          
          // Verificar se o token está válido fazendo uma consulta rápida no Supabase
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .eq('is_active', true)
            .single();
            
          if (error || !data) {
            // Token inválido ou usuário desativado, fazer logout
            await signOut();
          } else {
            // Atualizar dados do usuário da sessão
            setAuthState({
              user: data as User,
              company,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          await signOut();
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();

    // Configurar ouvinte de alterações de autenticação do Supabase
    const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        await signOut();
      }
    });

    return () => {
      // Limpar ouvinte quando o componente é desmontado
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  const sendMagicLink = async (email: string, companyCode: string) => {
    try {
      // Verificar se a empresa existe com o código fornecido
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

      // Verificar se o usuário existe nessa empresa
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('company_id', companyData.id)
        .eq('is_active', true)
        .single();

      if (userError && userError.code !== 'PGRST116') { // Código de erro quando não encontra resultados
        console.error("Erro ao verificar usuário:", userError);
        return { 
          success: false, 
          message: 'Ocorreu um erro ao verificar o usuário. Tente novamente.'
        };
      }

      // Se o usuário não existe e a empresa não permite auto-cadastro, retornar erro
      if (!userData && !companyData.allow_signup) {
        return {
          success: false,
          message: 'Usuário não encontrado para esta empresa. Entre em contato com o administrador.'
        };
      }

      // Enviar magic link
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
        console.error("Erro ao enviar magic link:", magicLinkError);
        return { 
          success: false, 
          message: 'Não foi possível enviar o link de acesso. Tente novamente.'
        };
      }

      // Se chegou até aqui, o magic link foi enviado com sucesso
      return { 
        success: true, 
        message: 'Link de acesso enviado com sucesso para seu e-mail.'
      };
    } catch (error) {
      console.error("Erro ao enviar magic link:", error);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
      };
    }
  };

  const sendLoginCode = async (email: string, companyCode: string) => {
    try {
      // Verificar se a empresa existe com o código fornecido
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

      // Verificar se o usuário existe nessa empresa
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('company_id', companyData.id)
        .eq('is_active', true)
        .single();

      if (userError && userError.code !== 'PGRST116') { // Código de erro quando não encontra resultados
        console.error("Erro ao verificar usuário:", userError);
        return { 
          success: false, 
          message: 'Ocorreu um erro ao verificar o usuário. Tente novamente.'
        };
      }

      // Se o usuário não existe e a empresa não permite auto-cadastro, retornar erro
      if (!userData && !companyData.allow_signup) {
        return {
          success: false,
          message: 'Usuário não encontrado para esta empresa. Entre em contato com o administrador.'
        };
      }

      // Gerar um código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Código válido por 15 minutos

      // Salvar o código na tabela de códigos de acesso
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
        console.error("Erro ao gerar código de acesso:", codeError);
        return { 
          success: false, 
          message: 'Não foi possível gerar o código de acesso. Tente novamente.'
        };
      }

      // Enviar e-mail com o código
      // Verificar se a empresa tem configuração SMTP
      if (companyData.smtp_host && companyData.smtp_port && companyData.smtp_user && companyData.smtp_pass) {
        // Em um ambiente real, chamaríamos uma Edge Function para enviar o e-mail
        // Como exemplo, vamos simular isso com um console.log
        console.log(`Enviando código ${code} para ${email} usando SMTP da empresa ${companyData.name}`);
        
        // Aqui chamaríamos uma edge function do Supabase
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            to: email,
            subject: 'Seu código de acesso',
            body: `Seu código de acesso é: ${code}`,
            companyId: companyData.id
          }
        });
        
        if (emailError) {
          console.error("Erro ao enviar e-mail:", emailError);
          return { 
            success: false, 
            message: 'Não foi possível enviar o código por e-mail. Tente novamente ou contate o suporte.'
          };
        }
      } else {
        // Se não tiver SMTP configurado, mostrar o código no console (apenas para desenvolvimento)
        console.log(`CÓDIGO DE ACESSO: ${code} (para ${email} na empresa ${companyData.name})`);
        // Em produção, retornaríamos um erro pedindo para configurar o SMTP
      }

      return { 
        success: true, 
        message: 'Código de acesso enviado com sucesso.'
      };
    } catch (error) {
      console.error("Erro ao enviar código de acesso:", error);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
      };
    }
  };

  const verifyLoginCode = async (email: string, code: string, companyCode: string) => {
    try {
      // Buscar a empresa
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

      // Verificar o código de acesso
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

      // Marcar o código como usado
      await supabase
        .from('access_codes')
        .update({ is_used: true })
        .eq('id', accessCodeData.id);

      // Buscar ou criar o usuário
      let userData: User;
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('company_id', companyData.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error("Erro ao buscar usuário:", userError);
        return { 
          success: false, 
          message: 'Ocorreu um erro ao verificar seus dados. Tente novamente.'
        };
      }

      if (existingUser) {
        // Atualizar último login
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ last_login: now })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error("Erro ao atualizar último login:", updateError);
          return { 
            success: false, 
            message: 'Erro ao atualizar dados de login. Tente novamente.'
          };
        }

        userData = updatedUser as User;
      } else {
        // Se não existe usuário, verificar se auto-cadastro está permitido
        if (!companyData.allow_signup) {
          return {
            success: false,
            message: 'Usuário não cadastrado. Entre em contato com o administrador da empresa.'
          };
        }

        // Criar um novo usuário básico
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email,
            name: email.split('@')[0], // Nome temporário baseado no email
            company_id: companyData.id,
            role: 'user', // Papel básico
            is_active: true,
            last_login: now
          })
          .select()
          .single();

        if (createError) {
          console.error("Erro ao criar usuário:", createError);
          return { 
            success: false, 
            message: 'Não foi possível criar seu usuário. Tente novamente ou contate o suporte.'
          };
        }

        userData = newUser as User;
      }

      // Salvar dados da sessão
      localStorage.setItem('session', JSON.stringify({
        user: userData,
        company: companyData
      }));

      // Atualizar estado de autenticação
      setAuthState({
        user: userData,
        company: companyData as Company,
        isLoading: false
      });

      return { 
        success: true,
        message: 'Login realizado com sucesso!'
      };
    } catch (error) {
      console.error("Erro na verificação do código:", error);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao verificar o código. Tente novamente.'
      };
    }
  };

  const signIn = async (email: string, companyCode: string) => {
    // Agora usa o fluxo de envio de magic link por padrão
    return await sendMagicLink(email, companyCode);
  };

  const signOut = async () => {
    localStorage.removeItem('session');
    // Fazer logout também no Supabase Auth
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      company: null,
      isLoading: false
    });
    navigate('/login');
  };

  const register = async (userData: { name: string; email: string; whatsapp: string; companyName: string }) => {
    try {
      const { name, email, whatsapp, companyName } = userData;
      
      // Verificar se o email já está cadastrado em alguma empresa
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id, company:companies!inner(name, code)')
        .eq('email', email)
        .limit(1);

      if (existingUser && existingUser.length > 0) {
        return {
          success: false,
          message: `Este e-mail já está cadastrado na empresa ${existingUser[0].company.name}.`
        };
      }

      // Gerar código único para a empresa
      const companyCode = generateCompanyCode();
      
      // Cadastrar a empresa
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          code: companyCode,
          allow_signup: true,
          is_active: true
        })
        .select()
        .single();

      if (companyError) {
        console.error("Erro ao criar empresa:", companyError);
        return { 
          success: false, 
          message: 'Não foi possível criar a empresa. Tente novamente ou contate o suporte.'
        };
      }

      // Cadastrar o usuário como admin da empresa
      const { error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          whatsapp,
          company_id: newCompany.id,
          role: 'admin', // Papel de administrador
          is_active: true
        });

      if (createError) {
        console.error("Erro ao criar usuário:", createError);
        // Se falhar ao criar o usuário, remover a empresa criada
        await supabase
          .from('companies')
          .delete()
          .eq('id', newCompany.id);
          
        return { 
          success: false, 
          message: 'Não foi possível criar seu cadastro. Tente novamente ou contate o suporte.'
        };
      }

      // Enviar magic link para o primeiro acesso
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            company_id: newCompany.id,
            company_code: companyCode
          }
        }
      });

      if (magicLinkError) {
        console.error("Erro ao enviar magic link:", magicLinkError);
      }

      return { 
        success: true, 
        message: 'Cadastro realizado com sucesso! Verifique seu e-mail para acessar o sistema.',
        companyCode
      };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.'
      };
    }
  };

  // Função para gerar um código único de empresa (6 caracteres alfanuméricos)
  const generateCompanyCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        sendLoginCode,
        verifyLoginCode,
        sendMagicLink,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
