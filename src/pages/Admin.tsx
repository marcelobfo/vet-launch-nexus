import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart, 
  Settings, 
  PaintBucket, 
  Type, 
  BarChartHorizontal,
  ArrowLeftCircle
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

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

  // Generate campaign performance data
  const calculateCampaignPerformance = () => {
    const { 
      leadCost, 
      hotLeadConversion, 
      coldLeadConversion, 
      landingPageConversion,
      campaignConversion,
      campaignBudget
    } = metrics;
    
    const totalLeads = Math.floor(campaignBudget / leadCost);
    const hotLeads = Math.floor(totalLeads * 0.4); // Assuming 40% of leads are hot leads
    const coldLeads = totalLeads - hotLeads;
    
    const hotConversions = Math.floor(hotLeads * (hotLeadConversion / 100));
    const coldConversions = Math.floor(coldLeads * (coldLeadConversion / 100));
    const totalConversions = hotConversions + coldConversions;
    
    // Assuming average product value of R$ 997
    const productValue = 997;
    const grossRevenue = totalConversions * productValue;
    const roi = ((grossRevenue - campaignBudget) / campaignBudget) * 100;
    
    return {
      totalLeads,
      hotLeads,
      coldLeads,
      hotConversions,
      coldConversions,
      totalConversions,
      grossRevenue,
      roi,
      conversionRate: (totalConversions / totalLeads) * 100
    };
  };

  const performance = calculateCampaignPerformance();

  // Mock chart data
  const conversionData = [
    { name: 'Landing Page', value: metrics.landingPageConversion },
    { name: 'Campanha Leads', value: metrics.campaignConversion },
    { name: 'Leads Quentes', value: metrics.hotLeadConversion },
    { name: 'Leads Frios', value: metrics.coldLeadConversion },
  ];

  const roiData = Array.from({ length: 10 }, (_, i) => {
    const budgetMultiplier = 0.5 + (i * 0.5);
    const budget = metrics.campaignBudget * budgetMultiplier;
    const leads = Math.floor(budget / metrics.leadCost);
    const conversions = Math.floor(leads * (performance.conversionRate / 100));
    const revenue = conversions * 997;
    const profit = revenue - budget;
    const roi = (profit / budget) * 100;
    
    return {
      name: `R$ ${Math.round(budget / 1000)}k`,
      ROI: Math.round(roi),
      Lucro: Math.round(profit / 1000),
    };
  });

  const handleSave = () => {
    setSaving(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
      
      // In a real app, we would send the data to an API
      // localStorage can be used for demo purposes
      localStorage.setItem('siteConfig', JSON.stringify({
        companyInfo,
        metrics
      }));
    }, 1000);
  };

  const handleMetricsChange = (field, value) => {
    setMetrics(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }));
  };

  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportReport = () => {
    // Generate a simple report and download it
    const performance = calculateCampaignPerformance();
    const report = `
      RELATÓRIO DE CAMPANHA - ${companyInfo.name}
      
      Métricas da Campanha:
      - Custo por Lead: R$ ${metrics.leadCost}
      - Conversão de Leads Quentes: ${metrics.hotLeadConversion}%
      - Conversão de Leads Frios: ${metrics.coldLeadConversion}%
      - Conversão da Landing Page: ${metrics.landingPageConversion}%
      - Conversão da Campanha: ${metrics.campaignConversion}%
      - CPC: R$ ${metrics.cpc}
      - CTR: ${metrics.ctr}%
      - Orçamento da Campanha: R$ ${metrics.campaignBudget}
      
      Resultados Estimados:
      - Total de Leads: ${performance.totalLeads}
      - Leads Quentes: ${performance.hotLeads}
      - Leads Frios: ${performance.coldLeads}
      - Conversões de Leads Quentes: ${performance.hotConversions}
      - Conversões de Leads Frios: ${performance.coldConversions}
      - Total de Conversões: ${performance.totalConversions}
      - Receita Bruta Estimada: R$ ${performance.grossRevenue}
      - ROI: ${performance.roi.toFixed(2)}%
      - Taxa de Conversão Geral: ${performance.conversionRate.toFixed(2)}%
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-campanha-${companyInfo.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Relatório gerado",
      description: "O relatório de campanha foi baixado com sucesso.",
    });
  };

  return (
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
          <TabsList className="grid grid-cols-4 max-w-2xl gap-2">
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
          </TabsList>
          
          <TabsContent value="geral" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription className="text-gray-400">Configure as informações básicas da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                  <Input 
                    value={companyInfo.name} 
                    onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30"
                  />
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cor Primária</label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border border-white/20" 
                        style={{ backgroundColor: companyInfo.primaryColor }}
                      />
                      <Input 
                        type="text"
                        value={companyInfo.primaryColor} 
                        onChange={(e) => handleCompanyInfoChange('primaryColor', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Cor Secundária</label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border border-white/20" 
                        style={{ backgroundColor: companyInfo.secondaryColor }}
                      />
                      <Input 
                        type="text"
                        value={companyInfo.secondaryColor} 
                        onChange={(e) => handleCompanyInfoChange('secondaryColor', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Cor de Destaque</label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border border-white/20" 
                        style={{ backgroundColor: companyInfo.accentColor }}
                      />
                      <Input 
                        type="text"
                        value={companyInfo.accentColor} 
                        onChange={(e) => handleCompanyInfoChange('accentColor', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                  </div>
                </div>
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
                <div>
                  <label className="block text-sm font-medium mb-1">Título do Hero</label>
                  <Input 
                    value={companyInfo.heroTitle} 
                    onChange={(e) => handleCompanyInfoChange('heroTitle', e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtítulo do Hero</label>
                  <Textarea 
                    value={companyInfo.heroSubtitle} 
                    onChange={(e) => handleCompanyInfoChange('heroSubtitle', e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30 min-h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Texto Sobre</label>
                  <Input 
                    value={companyInfo.aboutText} 
                    onChange={(e) => handleCompanyInfoChange('aboutText', e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30"
                  />
                </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Custo por Lead (R$)</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={metrics.leadCost} 
                        onChange={(e) => handleMetricsChange('leadCost', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Orçamento da Campanha (R$)</label>
                      <Input 
                        type="number"

                        step="100" 
                        min="0"
                        value={metrics.campaignBudget} 
                        onChange={(e) => handleMetricsChange('campaignBudget', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Conversão Leads Quentes (%)</label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={metrics.hotLeadConversion} 
                        onChange={(e) => handleMetricsChange('hotLeadConversion', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Conversão Leads Frios (%)</label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={metrics.coldLeadConversion} 
                        onChange={(e) => handleMetricsChange('coldLeadConversion', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Conversão Landing Page (%)</label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={metrics.landingPageConversion} 
                        onChange={(e) => handleMetricsChange('landingPageConversion', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Conversão Campanha (%)</label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={metrics.campaignConversion} 
                        onChange={(e) => handleMetricsChange('campaignConversion', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CPC (R$)</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={metrics.cpc} 
                        onChange={(e) => handleMetricsChange('cpc', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CTR (%)</label>
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="100"
                        value={metrics.ctr} 
                        onChange={(e) => handleMetricsChange('ctr', e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleExportReport}
                    className="bg-vet-primary/20 hover:bg-vet-primary/30"
                  >
                    Exportar Relatório
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
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Total de Leads</p>
                        <p className="text-2xl font-semibold">{performance.totalLeads}</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Conversões</p>
                        <p className="text-2xl font-semibold">{performance.totalConversions}</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">Receita Bruta</p>
                        <p className="text-2xl font-semibold">R$ {performance.grossRevenue.toLocaleString()}</p>
                      </div>
                      <div className="glass-card p-4">
                        <p className="text-gray-400 text-sm mb-1">ROI</p>
                        <p className="text-2xl font-semibold">{performance.roi.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conversionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="name" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid #374151',
                              color: '#fff'
                            }} 
                            labelStyle={{ color: '#fff' }}
                          />
                          <Bar dataKey="value" name="Taxa de Conversão (%)" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Projeção de ROI</CardTitle>
                    <CardDescription className="text-gray-400">Por orçamento de campanha</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={roiData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="name" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid #374151',
                              color: '#fff'
                            }} 
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="ROI" stroke="#22c55e" name="ROI (%)" />
                          <Line type="monotone" dataKey="Lucro" stroke="#4169e1" name="Lucro (R$ mil)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
  );
};

export default Admin;
