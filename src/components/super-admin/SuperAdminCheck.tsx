
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

const SuperAdminCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const storedSession = localStorage.getItem('super_admin_session');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          if (sessionData && sessionData.isValid && new Date(sessionData.expiresAt) > new Date()) {
            // Verify if the super admin still exists in the database
            const { data, error } = await supabase
              .from('super_admins')
              .select('*')
              .eq('id', sessionData.id)
              .eq('email', sessionData.email)
              .eq('is_active', true)
              .single();
            
            if (!error && data) {
              setIsAuthorized(true);
            }
          }
        } catch (error) {
          // Invalid session format
          console.error("Error checking super admin session:", error);
        }
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
    return <Navigate to="/super-admin-login" replace />;
  }
  
  return <>{children}</>;
};

export default SuperAdminCheck;
