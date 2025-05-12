
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Shield, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SuperAdminHeader from '@/components/super-admin/SuperAdminHeader';
import CreateSuperAdminForm from '@/components/super-admin/CreateSuperAdminForm';
import CompaniesTab from '@/components/super-admin/CompaniesTab';
import { supabase } from '@/integrations/supabase/client';

const SuperAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("companies");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  
  // Check if user is authenticated as super admin
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
              setSession(sessionData);
            } else {
              // Super admin no longer exists or is inactive
              localStorage.removeItem('super_admin_session');
              navigate('/super-admin-login');
            }
          } else {
            // Session expired
            localStorage.removeItem('super_admin_session');
            navigate('/super-admin-login');
          }
        } catch (error) {
          // Invalid session format
          localStorage.removeItem('super_admin_session');
          navigate('/super-admin-login');
        }
      } else {
        // No session found
        navigate('/super-admin-login');
      }
      setLoading(false);
    };
    
    checkSuperAdmin();
  }, [navigate]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('super_admin_session');
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel Super Admin."
    });
    navigate('/super-admin-login');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando autenticação...</div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SuperAdminHeader onLogout={handleLogout} />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold">Painel Super Admin</h1>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="companies">
                <Building className="h-4 w-4 mr-2" />
                Empresas
              </TabsTrigger>
              <TabsTrigger value="admins">
                <Users className="h-4 w-4 mr-2" />
                Super Admins
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies">
              <CompaniesTab />
            </TabsContent>
            
            <TabsContent value="admins">
              <Card className="mb-6">
                <CreateSuperAdminForm />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
