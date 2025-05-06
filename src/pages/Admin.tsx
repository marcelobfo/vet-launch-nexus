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
import TemplateModels from '@/components/admin/TemplateModels';
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
    // Properties for TextsForm
    heroTitle: 'Gerenciador de Lançamentos',
    heroSubtitle: 'Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso.',
    aboutText: 'Método 6 em 7',
    heroFeatures: [
      { title: "Pré-Lançamento", desc: "Construção de autoridade e captação de leads qualificados", color: "bg-primary" },
      { title: "Evento de Lançamento", desc: "Aulas ao vivo com alta conversão e engajamento", color: "bg-accent" },
      { title: "Automação Inteligente", desc: "Fluxos de WhatsApp e E-mail para maximizar resultados", color: "bg-blue-600" }
    ],
    // Properties for ColorSchemeForm
    primaryColor: '#4361ee',
    secondaryColor: '#3f37c9',
    accentColor: '#4cc9f0',
    colors: {
      primary: '#4361ee',
      secondary: '#3f37c9',
      accent: '#4cc9f0'
    },
    texts: {
      slogan: 'Transformando seu conhecimento em negócio digital',
      aboutShort: 'Soluções digitais para lançamentos de sucesso',
      about: 'Nossa plataforma oferece ferramentas completas para gestão de lançamentos digitais, incluindo planejamento, automação e monitoramento de resultados.'
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
    autoSend: false,
    frequency: "weekly" as const,
    registrationWebhookUrl: '',
    whatsappWebhookUrl: 'https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook-test/vetplataforma',
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
    passwordProtection: true,
    adminPassword: 'admin123'
  });

  useEffect(() => {
    document.title = "Painel Administrativo | Gerenciador de Lançamentos";
    
    // Load stored site configuration
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        // Update company info
        setCompanyInfo(prev => ({
          ...prev,
          ...config.companyInfo,
          name: company?.name || config.companyInfo?.name || prev.name,
          primaryColor: config.colors?.primary || prev.primaryColor,
          secondaryColor: config.colors?.secondary || prev.secondaryColor,
          accentColor: config.colors?.accent || prev.accentColor,
          colors: config.colors || prev.colors
        }));
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
    
    // If we have company data from auth context, update the state
    if (company) {
      // Update company info
      setCompanyInfo(prev => ({
        ...prev,
        name: company.name || prev.name
      }));
      
      // Update webhook settings if available
      if (company.webhook_url || company.whatsapp_webhook_url) {
        setWebhookSettings(prev => ({
          ...prev,
          url: company.webhook_url || prev.url,
          whatsappWebhookUrl: company.whatsapp_webhook_url || prev.whatsappWebhookUrl
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

  const saveSettings = () => {
    // Prepare the configuration to save
    const config = {
      companyInfo: {
        name: companyInfo.name,
        website: companyInfo.website,
        heroTitle: companyInfo.heroTitle,
        heroSubtitle: companyInfo.heroSubtitle,
        aboutText: companyInfo.aboutText,
        heroFeatures: companyInfo.heroFeatures
      },
      colors: {
        primary: companyInfo.primaryColor || companyInfo.colors.primary,
        secondary: companyInfo.secondaryColor || companyInfo.colors.secondary,
        accent: companyInfo.accentColor || companyInfo.colors.accent
      },
      metrics: {
        campaignBudget: metrics.campaignBudget,
        leadCost: metrics.leadCost,
        conversionRate: metrics.conversionRate,
        averageTicket: metrics.averageTicket,
        clientLifetime: metrics.clientLifetime,
        websiteConversion: metrics.websiteConversion,
        socialMediaCost: metrics.socialMediaCost,
        emailMarketingCost: metrics.emailMarketingCost,
        contentMarketingCost: metrics.contentMarketingCost,
        paidMediaCost: metrics.paidMediaCost,
        hotLeadConversion: metrics.hotLeadConversion,
        coldLeadConversion: metrics.coldLeadConversion,
        landingPageConversion: metrics.landingPageConversion,
        campaignConversion: metrics.campaignConversion,
        cpc: metrics.cpc,
        ctr: metrics.ctr,
        productValue: metrics.productValue
      }
    };
    
    // Save to localStorage
    localStorage.setItem('siteConfig', JSON.stringify(config));
    
    toast({
      title: "Configurações salvas",
      description: "As alterações foram salvas com sucesso."
    });
    
    // Reload the page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-card text-white">
      <NavBar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <div className="flex gap-3">
            <Button onClick={saveSettings} variant="default">
              Salvar Alterações
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Voltar para o site
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <div className="bg-card rounded-lg p-1 overflow-x-auto">
            <TabsList className="flex space-x-1 w-max min-w-full">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="templates">Modelos de Página</TabsTrigger>
              <TabsTrigger value="company">Personalização</TabsTrigger>
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
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <TemplateModels />
          </TabsContent>
          
          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6">
            <CompanyInfoForm 
              companyInfo={companyInfo} 
              handleCompanyInfoChange={handleCompanyInfoChange} 
            />
            
            <TextsForm 
              companyInfo={{
                heroTitle: companyInfo.heroTitle || companyInfo.texts?.slogan || '',
                heroSubtitle: companyInfo.heroSubtitle || companyInfo.texts?.aboutShort || '',
                aboutText: companyInfo.aboutText || companyInfo.texts?.about || '',
                heroFeatures: companyInfo.heroFeatures
              }} 
              handleCompanyInfoChange={handleCompanyInfoChange} 
            />
            
            <ColorSchemeForm 
              companyInfo={{
                primaryColor: companyInfo.primaryColor || companyInfo.colors?.primary || '',
                secondaryColor: companyInfo.secondaryColor || companyInfo.colors?.secondary || '',
                accentColor: companyInfo.accentColor || companyInfo.colors?.accent || ''
              }} 
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
              companyInfo={companyInfo}
              metrics={metrics}
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
