
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, User, Company } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  register: (userData: { name: string; email: string; whatsapp: string; companyCode: string }) => Promise<{ success: boolean; message?: string }>;
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
    // Método para compatibilidade com a versão antiga
    // Agora usa o fluxo de envio de código + verificação
    const sendResult = await sendLoginCode(email, companyCode);
    if (!sendResult.success) {
      return sendResult;
    }
    
    return { 
      success: true, 
      message: 'Código de acesso enviado para seu e-mail.'
    };
  };

  const signOut = async () => {
    localStorage.removeItem('session');
    setAuthState({
      user: null,
      company: null,
      isLoading: false
    });
    navigate('/login');
  };

  const register = async (userData: { name: string; email: string; whatsapp: string; companyCode: string }) => {
    try {
      const { name, email, whatsapp, companyCode } = userData;
      
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
          message: 'Código de empresa inválido ou empresa inativa.'
        };
      }

      // Verificar se a empresa aceita auto-cadastro
      if (!companyData.allow_signup) {
        return {
          success: false,
          message: 'Esta empresa não permite cadastros automáticos. Entre em contato com o administrador.'
        };
      }

      // Verificar se o email já está cadastrado na empresa
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .eq('company_id', companyData.id)
        .single();

      if (existingUser) {
        return {
          success: false,
          message: 'Este e-mail já está cadastrado nesta empresa.'
        };
      }

      // Cadastrar o usuário
      const { error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          whatsapp,
          company_id: companyData.id,
          role: 'user', // Papel básico
          is_active: true
        });

      if (createError) {
        console.error("Erro ao criar usuário:", createError);
        return { 
          success: false, 
          message: 'Não foi possível criar seu cadastro. Tente novamente ou contate o suporte.'
        };
      }

      // Se a empresa tiver webhook configurado, enviar os dados para ele
      if (companyData.webhook_url) {
        try {
          await fetch(companyData.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'new_user',
              data: {
                name,
                email,
                whatsapp,
                companyCode,
                timestamp: new Date().toISOString()
              }
            }),
          });
        } catch (webhookError) {
          console.error("Erro ao enviar dados para webhook:", webhookError);
          // Não vamos falhar o cadastro se o webhook falhar
        }
      }

      return { 
        success: true, 
        message: 'Cadastro realizado com sucesso! Faça login para continuar.'
      };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return { 
        success: false, 
        message: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        sendLoginCode,
        verifyLoginCode,
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
