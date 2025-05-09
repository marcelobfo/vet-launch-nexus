
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Icons
import { 
  User, 
  LogOut, 
  Settings, 
  Database, 
  Building, 
  Mail, 
  PieChart, 
  FileText, 
  Layers, 
  Users,
  UserPlus
} from 'lucide-react';

// Import admin components
import UserManagement from '@/components/admin/UserManagement';
import CompanyManagement from '@/components/admin/CompanyManagement';
import ProjectManagement from '@/components/admin/ProjectManagement';
import PerformanceMetrics from '@/components/admin/PerformanceMetrics';
import SMTPConfig from '@/components/admin/SMTPConfig';
import DatabaseConfig from '@/components/admin/DatabaseConfig';
import SecuritySettings from '@/components/admin/SecuritySettings';
import WebhookSettings from '@/components/admin/WebhookSettings';
import LandingPageManager from '@/components/admin/LandingPageManager';
import LeadManager from '@/components/admin/LeadManager';

// Mock props for components that require them
const mockWebhookSettings = {
  companyInfo: {},
  metrics: {},
  webhookSettings: {
    enabled: false,
    url: '',
    secret: '',
    events: []
  },
  setWebhookSettings: () => {}
};

const mockSecuritySettings = {
  securitySettings: {
    twoFactorEnabled: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },
  setSecuritySettings: () => {}
};

const Admin = () => {
  const { user, company, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível encerrar sua sessão",
        variant: "destructive"
      });
    }
  };
  
  if (!user || !company) {
    return <div>Carregando...</div>;
  }

  const isAdmin = user.role === 'admin';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciador de Lançamentos</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              {company.name}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid md:grid-cols-5 grid-cols-2 h-auto md:h-12 mb-8">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-vet-primary">
                <PieChart className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              
              <TabsTrigger value="leads" className="data-[state=active]:bg-vet-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Leads
              </TabsTrigger>
              
              <TabsTrigger value="pages" className="data-[state=active]:bg-vet-primary">
                <FileText className="h-4 w-4 mr-2" />
                Landing Pages
              </TabsTrigger>
              
              <TabsTrigger value="projects" className="data-[state=active]:bg-vet-primary">
                <Layers className="h-4 w-4 mr-2" />
                Projetos
              </TabsTrigger>
              
              {isAdmin && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-vet-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="dashboard">
              <PerformanceMetrics />
            </TabsContent>
            
            <TabsContent value="leads">
              <LeadManager />
            </TabsContent>
            
            <TabsContent value="pages">
              <LandingPageManager />
            </TabsContent>
            
            <TabsContent value="projects">
              <ProjectManagement />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin">
                <Tabs defaultValue="users">
                  <TabsList className="w-full mb-8">
                    <TabsTrigger value="users" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Usuários
                    </TabsTrigger>
                    
                    <TabsTrigger value="company" className="flex-1">
                      <Building className="h-4 w-4 mr-2" />
                      Empresa
                    </TabsTrigger>
                    
                    <TabsTrigger value="email" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </TabsTrigger>
                    
                    <TabsTrigger value="api" className="flex-1">
                      <Database className="h-4 w-4 mr-2" />
                      API e Webhooks
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="users">
                    <UserManagement />
                  </TabsContent>
                  
                  <TabsContent value="company">
                    <CompanyManagement />
                  </TabsContent>
                  
                  <TabsContent value="email">
                    <SMTPConfig />
                  </TabsContent>
                  
                  <TabsContent value="api">
                    <div className="grid gap-6 grid-cols-1">
                      <WebhookSettings {...mockWebhookSettings} />
                      <DatabaseConfig />
                      <SecuritySettings {...mockSecuritySettings} />
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border py-4 px-4">
        <div className="container mx-auto text-sm text-gray-500 flex justify-between items-center">
          <p>© {new Date().getFullYear()} Gerenciador de Lançamentos</p>
          <p className="text-gray-400">Versão 1.0.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
