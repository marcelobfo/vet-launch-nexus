
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import PasswordProtection from "@/components/PasswordProtection";
import { useAuth } from "@/contexts/AuthContext";

// Admin components
import CompanyInfoForm from "@/components/admin/CompanyInfoForm";
import TextsForm from "@/components/admin/TextsForm";
import ColorSchemeForm from "@/components/admin/ColorSchemeForm";
import PerformanceMetrics from "@/components/admin/PerformanceMetrics";
import MetricsForm from "@/components/admin/MetricsForm";
import ProjectManagement from "@/components/admin/ProjectManagement";
import UserManagement from "@/components/admin/UserManagement";
import CompanyManagement from "@/components/admin/CompanyManagement";
import WebhookSettings from "@/components/admin/WebhookSettings";
import SecuritySettings from "@/components/admin/SecuritySettings";
import FacebookApiConfig from "@/components/admin/FacebookApiConfig";
import ReportPdfView from "@/components/admin/ReportPdfView";
import SMTPConfig from "@/components/admin/SMTPConfig";

// Icons
import { 
  Home,
  LayoutDashboard, 
  Settings, 
  Edit, 
  PieChart, 
  Gauge, 
  BarChart,
  Activity,
  FileText,
  Users,
  Building,
  Webhook,
  Lock,
  Facebook,
  Mail,
  Database
} from "lucide-react";

interface AdminProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}

const Admin = ({ isDarkTheme, setIsDarkTheme }: AdminProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, company } = useAuth();
  
  const isAdmin = user?.role === 'admin';

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-vet-dark">
        <NavBar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
        
        <div className="container py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-gray-400">Gerencie sua empresa, usuários e projetos</p>
            </div>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                <Home className="h-4 w-4 mr-2" />
                <span>Voltar para o Site</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-64">
                <div className="bg-card rounded-lg border border-gray-800 p-2 sticky top-24">
                  <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1">
                    <TabsTrigger 
                      value="dashboard" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </TabsTrigger>
                    
                    <Separator className="my-2 bg-gray-800" />
                    
                    <TabsTrigger 
                      value="projects" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Projetos
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="users" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Usuários
                    </TabsTrigger>
                    
                    {isAdmin && (
                      <TabsTrigger 
                        value="companies" 
                        className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Empresas
                      </TabsTrigger>
                    )}
                    
                    <Separator className="my-2 bg-gray-800" />
                    
                    <TabsTrigger 
                      value="texts" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Textos
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="colors" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Cores
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="metrics" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Gauge className="h-4 w-4 mr-2" />
                      Métricas
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="performance" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      Performance
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="reports" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Relatórios
                    </TabsTrigger>
                    
                    <Separator className="my-2 bg-gray-800" />
                    
                    <TabsTrigger 
                      value="smtp" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email (SMTP)
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="webhooks" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Webhook className="h-4 w-4 mr-2" />
                      Webhooks
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="security" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Segurança
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="facebook" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="database" 
                      className="justify-start data-[state=active]:bg-vet-primary/20 data-[state=active]:text-vet-primary"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Banco de Dados
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <div className="flex-1">
                <ScrollArea className="rounded-lg border border-gray-800 bg-card">
                  <div className="p-6">
                    <TabsContent value="dashboard" className="space-y-4 mt-0">
                      <CompanyInfoForm />
                    </TabsContent>
                    
                    <TabsContent value="texts" className="space-y-4 mt-0">
                      <TextsForm />
                    </TabsContent>
                    
                    <TabsContent value="colors" className="space-y-4 mt-0">
                      <ColorSchemeForm />
                    </TabsContent>
                    
                    <TabsContent value="performance" className="space-y-4 mt-0">
                      <PerformanceMetrics />
                    </TabsContent>
                    
                    <TabsContent value="metrics" className="space-y-4 mt-0">
                      <MetricsForm />
                    </TabsContent>
                    
                    <TabsContent value="projects" className="space-y-4 mt-0">
                      <ProjectManagement />
                    </TabsContent>
                    
                    <TabsContent value="users" className="space-y-4 mt-0">
                      <UserManagement />
                    </TabsContent>
                    
                    {isAdmin && (
                      <TabsContent value="companies" className="space-y-4 mt-0">
                        <CompanyManagement />
                      </TabsContent>
                    )}
                    
                    <TabsContent value="webhooks" className="space-y-4 mt-0">
                      <WebhookSettings />
                    </TabsContent>
                    
                    <TabsContent value="smtp" className="space-y-4 mt-0">
                      <SMTPConfig />
                    </TabsContent>
                    
                    <TabsContent value="security" className="space-y-4 mt-0">
                      <SecuritySettings />
                    </TabsContent>
                    
                    <TabsContent value="facebook" className="space-y-4 mt-0">
                      <FacebookApiConfig />
                    </TabsContent>
                    
                    <TabsContent value="reports" className="space-y-4 mt-0">
                      <ReportPdfView />
                    </TabsContent>
                    
                    <TabsContent value="database" className="space-y-4 mt-0">
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded-md p-6 text-center">
                        <Database className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-medium text-blue-400 mb-2">Conexão com Supabase</h3>
                        <p className="text-gray-400 mb-4">
                          Esta aplicação agora está configurada para usar o Supabase como banco de dados.
                          Para gerenciar seus dados, acesse o painel do Supabase.
                        </p>
                        <Button
                          variant="outline" 
                          className="border-blue-500 text-blue-400 hover:bg-blue-950/50"
                          onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                        >
                          Acessar Painel do Supabase
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Admin;
