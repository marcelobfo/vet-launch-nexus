
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  
  // If not authenticated, redirect to login
  if (!user || !company) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

export default AuthCheck;
