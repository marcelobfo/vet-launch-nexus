
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';

const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, company, isLoading } = useAuth();
  
  // Mostra o loading enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando autenticação...</div>
        </Card>
      </div>
    );
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!user || !company) {
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver autenticado, renderiza os filhos
  return <>{children}</>;
};

export default AuthCheck;
