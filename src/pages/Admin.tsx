
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/admin/dashboard/AdminHeader';
import AdminFooter from '@/components/admin/dashboard/AdminFooter';
import AdminTabs from '@/components/admin/dashboard/AdminTabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, company } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !company) {
      return;
    }
    
    const fetchUserPermissions = async () => {
      try {
        // In a real application, fetch permissions from a user_permissions table
        // For now, we'll use the user role
        if (user.role === 'admin') {
          setUserPermissions([
            'view_dashboard',
            'manage_leads',
            'manage_landing_pages',
            'manage_projects', 
            'view_settings',
            'manage_settings',
            'view_facebook_campaigns',
            'manage_facebook_campaigns'
          ]);
        } else {
          // Regular users have limited permissions
          setUserPermissions([
            'view_dashboard',
            'view_leads',
            'view_landing_pages',
            'view_projects'
          ]);
          
          // If the user tries to access a restricted tab, reset to dashboard
          if (['admin'].includes(activeTab)) {
            setActiveTab('dashboard');
            toast({
              title: "Acesso restrito",
              description: "Você não tem permissão para acessar esta área.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast({
          title: "Erro",
          description: "Não foi possível verificar suas permissões.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPermissions();
  }, [user, company]);
  
  if (!user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Carregando...</div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando permissões...</div>
        </Card>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';
  
  // Check if the company is active
  const checkCompanyStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('is_active')
        .eq('id', company.id)
        .single();
      
      if (error) throw error;
      
      if (!data.is_active) {
        toast({
          title: "Empresa inativa",
          description: "Sua empresa está inativa. Entre em contato com o suporte.",
          variant: "destructive"
        });
        
        // Sign out the user
        localStorage.removeItem('session');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking company status:', error);
    }
  };
  
  // Check company status on initial load
  useEffect(() => {
    if (company) {
      checkCompanyStatus();
    }
  }, [company]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminHeader />
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <AdminTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isAdmin={isAdmin} 
            permissions={userPermissions}
          />
        </div>
      </div>
      
      <AdminFooter />
    </div>
  );
};

export default Admin;
