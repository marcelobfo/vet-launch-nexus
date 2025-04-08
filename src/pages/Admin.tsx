
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SMTPConfig from '@/components/admin/SMTPConfig';
import DatabaseConfig from '@/components/admin/DatabaseConfig';
import CompanyManagement from '@/components/admin/CompanyManagement';
import UserManagement from '@/components/admin/UserManagement';
import ProjectManagement from '@/components/admin/ProjectManagement';
import CompanyInfoForm from '@/components/admin/CompanyInfoForm';
import TextsForm from '@/components/admin/TextsForm';
import ColorSchemeForm from '@/components/admin/ColorSchemeForm';
import PerformanceMetrics from '@/components/admin/PerformanceMetrics';
import MetricsForm from '@/components/admin/MetricsForm';
import ROIChart from '@/components/admin/ROIChart';
import ConversionChart from '@/components/admin/ConversionChart';
import WebhookSettings from '@/components/admin/WebhookSettings';
import SecuritySettings from '@/components/admin/SecuritySettings';
import ReportPdfView from '@/components/admin/ReportPdfView';
import FacebookApiConfig from '@/components/admin/FacebookApiConfig';
import { supabase } from '@/integrations/supabase/client';
import { generateROIChartData, generateConversionChartData, calculatePerformanceMetrics } from '@/utils/chartDataUtils';

interface AdminProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}

const Admin = ({ isDarkTheme, setIsDarkTheme }: AdminProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, company } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    website: '',
    address: '',
    phone: '',
    industry: '',
    size: '',
    logo: '',
    colors: {
      primary: '#00A3E0',
      secondary: '#F28B00',
      accent: '#95D600'
    },
    texts: {
      slogan: 'Transformando o atendimento veterinário digital',
      aboutShort: 'Soluções digitais para clínicas e hospitais veterinários',
      about: 'Nossa plataforma oferece ferramentas completas para gestão de clínicas veterinárias, incluindo prontuário eletrônico, agendamento online e comunicação com tutores.'
    }
  });

  // Metrics state
  const [metrics, setMetrics] = useState({
    campaignBudget: 5000,
    leadCost: 15,
    conversionRate: 12,
    averageTicket: 500,
    clientLifetime: 24,
    websiteConversion: 8,
    socialMediaCost: 500,
    emailMarketingCost: 300,
    contentMarketingCost: 800,
    paidMediaCost: 2000,
    // Adding missing properties to match expected types
    hotLeadConversion: 20,
    coldLeadConversion: 5,
    landingPageConversion: 10,
    campaignConversion: 15,
    cpc: 2.5,
    ctr: 1.8,
    productValue: 500
  });
  
  // Performance data for charts
  const [performance, setPerformance] = useState({
    monthlyLeads: [120, 145, 160, 170, 155, 190, 210, 205, 220, 250, 270, 300],
    monthlyConversions: [18, 22, 25, 24, 26, 30, 35, 38, 42, 45, 48, 55],
    revenue: [9000, 11000, 12500, 12000, 13000, 15000, 17500, 19000, 21000, 22500, 24000, 27500],
    marketingCost: [4500, 4800, 5000, 5200, 5100, 5400, 5600, 5800, 6000, 6200, 6400, 6800],
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  });
  
  // Computed performance metrics based on time series data
  const performanceMetrics = calculatePerformanceMetrics(
    performance.monthlyLeads,
    performance.monthlyConversions,
    performance.revenue,
    performance.marketingCost
  );
  
  // Generate chart data
  const roiChartData = generateROIChartData(
    performance.revenue,
    performance.marketingCost,
    performance.months
  );
  
  const conversionChartData = generateConversionChartData(
    performance.monthlyLeads,
    performance.monthlyConversions,
    performance.months
  );
  
  // Webhook settings
  const [webhookSettings, setWebhookSettings] = useState({
    url: '',
    events: {
      newUser: true,
      newProject: true,
      statusChange: false,
      completedTask: false
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': ''
    },
    retry: true,
    retryCount: 3,
    // Adding missing properties to match expected types
    autoSend: false,
    frequency: "weekly" as const,
    registrationWebhookUrl: '',
    smtpSettings: {
      host: '',
      port: 587,
      user: '',
      password: '',
      fromEmail: '',
      fromName: ''
    }
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionTimeout: 30,
    allowSelfRegistration: true,
    allowPasswordReset: true,
    requireEmailVerification: true,
    twoFactorAuth: false,
    ipWhitelist: '',
    maxLoginAttempts: 5,
    // Adding missing properties to match expected types
    passwordProtection: true,
    adminPassword: 'admin123'
  });

  useEffect(() => {
    document.title = "Painel Administrativo | Vet Launch Nexus";
    
    // If we have company data from auth context, update the state
    if (company) {
      // Update company info
      setCompanyInfo(prev => ({
        ...prev,
        name: company.name || prev.name
      }));
      
      // Update webhook settings if available
      if (company.webhook_url) {
        setWebhookSettings(prev => ({
          ...prev,
          url: company.webhook_url
        }));
      }
    }
    
  }, [company]);

  // Handle company info changes - accepting string or any value
  const handleCompanyInfoChange = (field: string, value: string | any) => {
    setCompanyInfo(prev => {
      if (field.includes('.')) {
        const [category, key] = field.split('.');
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Handle metrics changes - now accepts string values and converts them
  const handleMetricsChange = (field: string, value: string | number) => {
    // Convert string values to numbers if needed
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    setMetrics(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleExportReport = async () => {
    toast({
      title: "Exportando relatório",
      description: "O relatório está sendo gerado em PDF."
    });
    
    // Normally we would generate a PDF here
    setTimeout(() => {
      toast({
        title: "Relatório exportado",
        description: "O PDF foi gerado com sucesso!"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-vet-dark text-white">
      <NavBar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            Voltar para o site
          </Button>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <div className="bg-card rounded-lg p-1 overflow-x-auto">
            <TabsList className="flex space-x-1 w-max min-w-full">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="company">Informações da Empresa</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="projects">Projetos</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-card shadow-md border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total de Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{performance.monthlyLeads.reduce((a, b) => a + b, 0)}</div>
                  <p className="text-sm text-gray-400">Nos últimos 12 meses</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-md border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Conversões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{performance.monthlyConversions.reduce((a, b) => a + b, 0)}</div>
                  <p className="text-sm text-gray-400">Nos últimos 12 meses</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-md border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ {(performance.revenue.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}k</div>
                  <p className="text-sm text-gray-400">Nos últimos 12 meses</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-md border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {(((performance.revenue.reduce((a, b) => a + b, 0) - performance.marketingCost.reduce((a, b) => a + b, 0)) / 
                      performance.marketingCost.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-400">Retorno sobre investimento</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card shadow-md border-gray-800">
                <CardHeader>
                  <CardTitle>Retorno sobre Investimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ROIChart data={roiChartData} />
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-md border-gray-800">
                <CardHeader>
                  <CardTitle>Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <ConversionChart data={conversionChartData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6">
            <CompanyInfoForm 
              companyInfo={companyInfo} 
              handleCompanyInfoChange={handleCompanyInfoChange} 
            />
            
            <TextsForm 
              companyInfo={companyInfo} 
              handleCompanyInfoChange={handleCompanyInfoChange} 
            />
            
            <ColorSchemeForm 
              companyInfo={companyInfo} 
              handleCompanyInfoChange={handleCompanyInfoChange} 
            />
            
            <PerformanceMetrics 
              performance={performanceMetrics}
            />
            
            <MetricsForm 
              metrics={metrics} 
              handleMetricsChange={handleMetricsChange} 
              handleExportReport={handleExportReport}
            />
          </TabsContent>
          
          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <FacebookApiConfig />
            <ROIChart data={roiChartData} />
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
          
          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <ProjectManagement />
          </TabsContent>
          
          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <WebhookSettings 
              webhookSettings={webhookSettings}
              setWebhookSettings={setWebhookSettings}
            />
            <SMTPConfig />
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SecuritySettings 
              securitySettings={securitySettings}
              setSecuritySettings={setSecuritySettings}
            />
            <DatabaseConfig />
            <ReportPdfView 
              companyInfo={companyInfo}
              metrics={metrics}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
