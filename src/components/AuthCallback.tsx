
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(location.search);
        const email = params.get('email');
        const code = params.get('code');
        const companyCode = params.get('companyCode');

        // Check if this is a custom access code flow
        if (email && code && companyCode) {
          // Handle custom access code authentication
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('code', companyCode)
            .single();

          if (companyError || !companyData) {
            throw new Error('Empresa não encontrada.');
          }

          // Verify the access code
          const { data: accessCode, error: accessCodeError } = await supabase
            .from('access_codes')
            .select('*')
            .eq('email', email)
            .eq('code', code)
            .eq('company_id', companyData.id)
            .eq('is_used', false)
            .single();

          if (accessCodeError || !accessCode) {
            throw new Error('Código de acesso inválido ou expirado.');
          }

          // Check if the code has expired
          const now = new Date();
          const expiresAt = new Date(accessCode.expires_at);
          if (now > expiresAt) {
            throw new Error('O código de acesso expirou.');
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

          // Create new user if doesn't exist and company allows signup
          let user = userData;
          if (!userData && companyData.allow_signup) {
            const { data: newUser, error: createUserError } = await supabase
              .from('users')
              .insert({
                email: email,
                name: email.split('@')[0], // Default name from email
                company_id: companyData.id,
                role: 'user',
                is_active: true,
                last_login: new Date().toISOString()
              })
              .select()
              .single();

            if (createUserError) {
              console.error("Error creating new user:", createUserError);
              throw new Error('Não foi possível criar seu usuário.');
            }

            user = newUser;
          } else if (!userData) {
            throw new Error('Usuário não autorizado para esta empresa.');
          }

          // Update last login time
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);

          // Store session in localStorage
          localStorage.setItem('session', JSON.stringify({
            user,
            company: companyData
          }));

          setIsLoading(false);
          return;
        }

        // Handle Supabase magic link flow
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          throw new Error('Falha na autenticação. Por favor, tente novamente.');
        }

        // Obtém os dados do usuário autenticado
        const { user } = data.session;
        const company_code = user?.user_metadata?.company_code;
        const company_id = user?.user_metadata?.company_id;
        
        if (!company_code && !company_id) {
          throw new Error('Informações da empresa não encontradas.');
        }

        // Verificar se a empresa existe
        let companyData;
        if (company_id) {
          const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', company_id)
            .single();

          if (companyError || !company) {
            throw new Error('Empresa não encontrada.');
          }
          companyData = company;
        } else if (company_code) {
          const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('code', company_code)
            .single();

          if (companyError || !company) {
            throw new Error('Empresa não encontrada.');
          }
          companyData = company;
        }

        // Verificar se o usuário já existe na plataforma
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .eq('company_id', companyData.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error("Erro ao verificar usuário:", userError);
          throw new Error('Erro ao verificar usuário.');
        }

        // Se o usuário não existe e o auto-cadastro está habilitado, criar o usuário
        if (!existingUser && companyData.allow_signup) {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              email: user.email,
              name: user.email.split('@')[0], // Nome temporário baseado no email
              company_id: companyData.id,
              role: 'user', // Papel básico
              is_active: true,
              last_login: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            console.error("Erro ao criar usuário:", createError);
            throw new Error('Não foi possível criar seu usuário.');
          }

          // Salvar sessão no localStorage
          localStorage.setItem('session', JSON.stringify({
            user: newUser,
            company: companyData
          }));
        } else if (existingUser) {
          // Atualizar último login
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', existingUser.id);

          // Salvar sessão no localStorage
          localStorage.setItem('session', JSON.stringify({
            user: existingUser,
            company: companyData
          }));
        } else {
          throw new Error('Acesso não autorizado para esta empresa.');
        }

        // Configuração concluída, redirecionar para dashboard
        setIsLoading(false);
      } catch (err) {
        console.error('Erro no callback de autenticação:', err);
        setError(err.message || 'Ocorreu um erro durante a autenticação.');
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-vet-primary" />
            <h2 className="text-xl font-medium">Verificando autenticação...</h2>
            <p className="text-gray-400">Estamos processando sua solicitação de login.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center max-w-md">
          <div className="flex flex-col items-center gap-4">
            <span className="text-red-500 text-5xl">!</span>
            <h2 className="text-xl font-medium">Erro de Autenticação</h2>
            <p className="text-gray-400">{error}</p>
            <a 
              href="/login" 
              className="mt-4 px-4 py-2 bg-vet-primary text-white rounded-md hover:bg-vet-primary/90"
            >
              Voltar para Login
            </a>
          </div>
        </Card>
      </div>
    );
  }

  // Redirecionar para a página principal
  return <Navigate to="/" replace />;
};

export default AuthCallback;
