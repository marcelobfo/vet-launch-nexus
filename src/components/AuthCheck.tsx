
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, company, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando autenticação...</div>
        </Card>
      </div>
    );
  }
  
  // Check if Supabase is properly configured
  const isMissingSupabaseConfig = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (isMissingSupabaseConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 max-w-md bg-card border-amber-800">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500" />
            <h2 className="text-xl font-semibold">Configuração Necessária</h2>
            <p className="text-gray-400 mb-2">
              Para utilizar este aplicativo, é necessário conectar-se ao Supabase.
              Por favor, clique no botão verde do Supabase no canto superior direito
              e configure as credenciais.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Tentar novamente
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user || !company) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

export default AuthCheck;
