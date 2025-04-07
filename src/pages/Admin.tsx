import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Settings, 
  PaintBucket, 
  Type, 
  BarChartHorizontal,
  ArrowLeftCircle,
  Shield,
  Globe,
  FileDown,
  Database,
  Users,
  Layout,
  BrainCircuit,
  UserPlus
} from 'lucide-react';

// Import sidebar components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset
} from "@/components/ui/sidebar";

// Import components
import PasswordProtection from "@/components/PasswordProtection";
import CompanyInfoForm from "@/components/admin/CompanyInfoForm";
import ColorSchemeForm from "@/components/admin/ColorSchemeForm";
import TextsForm from "@/components/admin/TextsForm";
import MetricsForm from "@/components/admin/MetricsForm";
import PerformanceMetrics from "@/components/admin/PerformanceMetrics";
import ConversionChart from "@/components/admin/ConversionChart";
import ROIChart from "@/components/admin/ROIChart";
import WebhookSettings from "@/components/admin/WebhookSettings";
import SecuritySettings from "@/components/admin/SecuritySettings";
import ReportPdfView from "@/components/admin/ReportPdfView";
import DatabaseConfig from "@/components/admin/DatabaseConfig";
import ProjectManagement from "@/components/admin/ProjectManagement";
import FacebookApiConfig from "@/components/admin/FacebookApiConfig";
import CompanyManagement from "@/components/admin/CompanyManagement";
import UserManagement from "@/components/admin/UserManagement";

// Import utilities
import { calculateCampaignPerformance, generateROIProjectionData } from "@/utils/campaignCalculator";
import { generateCampaignReport, downloadReport } from "@/utils/reportGenerator";

const Admin = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("geral");
  
  // Campaign metrics state
  const [metrics, setMetrics] = useState({
    leadCost: 2.80,
    hotLeadConversion: 50, // percentage (30-70%)
    coldLeadConversion: 25, // percentage (20-35%)
    landingPageConversion: 15, // percentage (11-20%)
    campaignConversion: 3.5, // percentage (2-5%)
    cpc: 1.2, // cost per click
    ctr: 2.8, // click-through rate percentage
    campaignBudget: 5000, // budget in BRL
    productValue: 197.90, // Default product value/ticket
  });

  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    name: "Veto pro 360",
    primaryColor: "#4169e1", // vet-primary
    secondaryColor: "#22c55e", // vet-secondary
    accentColor: "#e63946", // vet-accent
    heroTitle: "Lançamento Expert Veterinário",
    heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para profissionais veterinários.",
    aboutText: "Método 6 em 7, Adaptado para Veterinários",
  });
  
  // Webhook settings
  const [webhookSettings, setWebhookSettings] = useState({
    url: "",
    autoSend: false,
    frequency: "weekly" as "daily" | "weekly" | "monthly",
    registrationWebhookUrl: "",
    smtpSettings: {
      host: "",
      port: 587,
      user: "",
      password: "",
      fromEmail: "",
      fromName: "",
    }
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordProtection: false,
    adminPassword: "",
  });
  
  // Load saved settings on component mount
  useEffect(() => {
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        if (config.companyInfo) setCompanyInfo(config.companyInfo);
        if (config.metrics) setMetrics(config.metrics);
        if (config.webhookSettings) setWebhookSettings(config.webhookSettings);
        if (config.securitySettings) setSecuritySettings(config.securitySettings);
      } catch (error) {
        console.error("Error loading saved configuration:", error);
      }
    }
  }, []);

  // Calculate campaign performance
  const performance = calculateCampaignPerformance(metrics);

  // Prepare chart data
  const conversionData = [
    { name: 'Landing Page', value: metrics.landingPageConversion },
    { name: 'Campanha Leads', value: metrics.campaignConversion },
    { name: 'Leads Quentes', value: metrics.hotLeadConversion },
    { name: 'Leads Frios', value: metrics.coldLeadConversion },
  ];

  const roiData = generateROIProjectionData(metrics);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
      
      // Save to localStorage
      localStorage.setItem('siteConfig', JSON.stringify({
        companyInfo,
        metrics,
        webhookSettings,
        securitySettings,
        adminPassword: securitySettings.adminPassword // Para autenticação
      }));
    }, 1000);
  };

  const handleMetricsChange = (field: string, value: string | number) => {
    setMetrics(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) : value
    }));
  };

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportReport = () => {
    const report = generateCampaignReport(companyInfo, metrics);
    downloadReport(report, companyInfo.name);
    
    toast({
      title: "Relatório gerado",
      description: "O relatório de campanha foi baixado com sucesso.",
    });
  };

  // Get content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "geral":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription className="text-gray-400">Configure as informações básicas da empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CompanyInfoForm 
                companyInfo={companyInfo} 
                handleCompanyInfoChange={handleCompanyInfoChange} 
              />
            </CardContent>
          </Card>
        );
      case "cores":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Esquema de Cores</CardTitle>
              <CardDescription className="text-gray-400">Personalize as cores do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorSchemeForm 
                companyInfo={companyInfo} 
                handleCompanyInfoChange={handleCompanyInfoChange} 
              />
            </CardContent>
          </Card>
        );
      case "textos":
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Textos do Site</CardTitle>
              <CardDescription className="text-gray-400">Edite os textos principais do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextsForm 
                companyInfo={companyInfo} 
                handleCompanyInfoChange={handleCompanyInfoChange} 
              />
            </CardContent>
          </Card>
        );
      case "metricas":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Métricas da Campanha</CardTitle>
                  <CardDescription className="text-gray-400">Configure os parâmetros para cálculo de desempenho</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MetricsForm 
                    metrics={metrics} 
                    handleMetricsChange={handleMetricsChange}
                    handleExportReport={handleExportReport}
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleExportReport}
                    className="bg-vet-primary/20 hover:bg-vet-primary/30"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar TXT
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Previsão de Desempenho</CardTitle>
                    <CardDescription className="text-gray-400">Baseado nos parâmetros configurados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PerformanceMetrics performance={performance} />
                    <ConversionChart data={conversionData} />
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChartHorizontal className="h-5 w-5" />
                      <span>Projeção de ROI</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">Por orçamento de campanha</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ROIChart data={roiData} />
                  </CardContent>
                </Card>
              </div>
            </div>
            <ReportPdfView companyInfo={companyInfo} metrics={metrics} />
          </div>
        );
      case "seguranca":
        return (
          <SecuritySettings 
            securitySettings={securitySettings}
            setSecuritySettings={setSecuritySettings}
          />
        );
      case "integracao":
        return (
          <WebhookSettings 
            companyInfo={companyInfo}
            metrics={metrics}
            webhookSettings={webhookSettings}
            setWebhookSettings={setWebhookSettings}
          />
        );
      case "database":
        return <DatabaseConfig />;
      case "projetos":
        return <ProjectManagement />;
      case "facebook":
        return <FacebookApiConfig />;
      case "empresas":
        return <CompanyManagement />;
      case "usuarios":
        return <UserManagement />;
      default:
        return (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Selecione uma opção</CardTitle>
              <CardDescription className="text-gray-400">Escolha uma opção no menu lateral</CardDescription>
            </CardHeader>
          </Card>
        );
    }
  };

  return (
    <PasswordProtection enabled={securitySettings.passwordProtection}>
      <SidebarProvider>
        <div className="min-h-screen bg-vet-dark text-white flex w-full">
          <Sidebar variant="inset" side="left">
            <SidebarHeader className="border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-md bg-vet-primary flex items-center justify-center">
                  <Layout className="h-5 w-5 text-white" />
                </div>
                <div className="font-semibold text-lg">Admin Panel</div>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Configurações Gerais</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("geral")} 
                      isActive={activeSection === "geral"}
                      tooltip="Informações Gerais"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Informações Gerais</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("cores")} 
                      isActive={activeSection === "cores"}
                      tooltip="Cores"
                    >
                      <PaintBucket className="h-4 w-4" />
                      <span>Cores</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("textos")} 
                      isActive={activeSection === "textos"}
                      tooltip="Textos"
                    >
                      <Type className="h-4 w-4" />
                      <span>Textos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Análise e Dados</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("metricas")} 
                      isActive={activeSection === "metricas"}
                      tooltip="Métricas"
                    >
                      <BarChart className="h-4 w-4" />
                      <span>Métricas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("facebook")} 
                      isActive={activeSection === "facebook"}
                      tooltip="Facebook API"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Facebook API</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("usuarios")} 
                      isActive={activeSection === "usuarios"}
                      tooltip="Usuários"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Usuários</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("projetos")} 
                      isActive={activeSection === "projetos"}
                      tooltip="Projetos"
                    >
                      <BrainCircuit className="h-4 w-4" />
                      <span>Projetos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("empresas")} 
                      isActive={activeSection === "empresas"}
                      tooltip="Empresas"
                    >
                      <Layout className="h-4 w-4" />
                      <span>Empresas</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Sistema</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("database")} 
                      isActive={activeSection === "database"}
                      tooltip="Banco de Dados"
                    >
                      <Database className="h-4 w-4" />
                      <span>Banco de Dados</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("seguranca")} 
                      isActive={activeSection === "seguranca"}
                      tooltip="Segurança"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Segurança</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection("integracao")} 
                      isActive={activeSection === "integracao"}
                      tooltip="Integrações"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Integrações</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="border-t border-gray-800 pt-2">
              <div className="flex justify-between items-center px-4">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href="/">
                    <ArrowLeftCircle className="h-4 w-4" />
                    <span>Voltar ao site</span>
                  </a>
                </Button>
                
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  size="sm"
                  className="bg-vet-secondary hover:bg-vet-secondary/90"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset className="p-6">
            <SidebarTrigger className="mb-4" />
            {renderContent()}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PasswordProtection>
  );
};

export default Admin;
