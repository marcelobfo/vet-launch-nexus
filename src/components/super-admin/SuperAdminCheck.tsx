
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';

const SuperAdminCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const storedSession = localStorage.getItem('super_admin_session');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          if (sessionData && sessionData.isValid && new Date(sessionData.expiresAt) > new Date()) {
            // Verificar se a tabela super_admins existe
            const checkTableResult = await supabase.rpc('create_super_admins_if_not_exists');
            
            // Verify if the super admin still exists in the database
            const { data, error } = await supabase
              .from('super_admins')
              .select('*')
              .eq('id', sessionData.id)
              .eq('email', sessionData.email)
              .eq('is_active', true)
              .maybeSingle();
            
            if (!error && data) {
              setIsAuthorized(true);
            } else {
              setError("Sessão de super admin inválida ou expirada.");
            }
          } else {
            setError("Sessão expirada. Por favor, faça login novamente.");
          }
        } catch (error) {
          // Invalid session format
          console.error("Error checking super admin session:", error);
          setError("Formato de sessão inválido. Por favor, faça login novamente.");
        }
      } else {
        setError("Você precisa estar autenticado como Super Admin para acessar esta página.");
      }
      setLoading(false);
    };
    
    checkSuperAdmin();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando autenticação...</div>
        </Card>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 bg-card border-gray-800 max-w-md">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Acesso não autorizado</h3>
              <p className="text-sm text-gray-400">{error || "Você não tem permissão para acessar esta página."}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <a 
              href="/super-admin-login" 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Ir para a página de login
            </a>
          </div>
        </Card>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default SuperAdminCheck;
