
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileDown
} from "lucide-react";

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

// Import utilities
import { calculateCampaignPerformance, generateROIProjectionData } from "@/utils/campaignCalculator";
import { generateCampaignReport, downloadReport } from "@/utils/reportGenerator";

const Admin = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");
  
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

  return (
    <PasswordProtection enabled={securitySettings.passwordProtection}>
      <div className="min-h-screen bg-vet-dark text-white px-6 py-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins">Painel de Administração</h1>
              <p className="text-gray-400">Configure seu site de lançamento</p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <a href="/">
                <ArrowLeftCircle className="h-4 w-4" />
                <span>Voltar ao site</span>
              </a>
            </Button>
          </div>
          
          <Tabs defaultValue="geral" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 max-w-3xl gap-2">
              <TabsTrigger value="geral" className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Geral</span>
              </TabsTrigger>
              <TabsTrigger value="cores" className="gap-2">
                <PaintBucket className="h-4 w-4" />
                <span>Cores</span>
              </TabsTrigger>
              <TabsTrigger value="textos" className="gap-2">
                <Type className="h-4 w-4" />
                <span>Textos</span>
              </TabsTrigger>
              <TabsTrigger value="metricas" className="gap-2">
                <BarChart className="h-4 w-4" />
                <span>Métricas</span>
              </TabsTrigger>
              <TabsTrigger value="seguranca" className="gap-2">
                <Shield className="h-4 w-4" />
                <span>Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="integracao" className="gap-2">
                <Globe className="h-4 w-4" />
                <span>Integração</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="cores" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="textos" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="metricas" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="seguranca" className="space-y-6">
              <SecuritySettings 
                securitySettings={securitySettings}
                setSecuritySettings={setSecuritySettings}
              />
            </TabsContent>
            
            <TabsContent value="integracao" className="space-y-6">
              <WebhookSettings 
                companyInfo={companyInfo}
                metrics={metrics}
                webhookSettings={webhookSettings}
                setWebhookSettings={setWebhookSettings}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-vet-secondary hover:bg-vet-secondary/90"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default Admin;
