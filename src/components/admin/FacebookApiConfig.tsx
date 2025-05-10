
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Facebook, Key, AlertTriangle, BookOpen, ArrowRight, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FacebookConfig {
  id?: string;
  company_id: string;
  app_id: string;
  app_secret: string;
  access_token: string;
  pixel_id: string;
  ad_account_id: string;
  enable_tracking: boolean;
  advanced_matching: boolean;
  campaign_id?: string;
  is_connected: boolean;
  created_at?: string;
  updated_at?: string;
}

const FacebookApiConfig = () => {
  const { toast } = useToast();
  const { company } = useAuth();
  
  const [fbConfig, setFbConfig] = useState<FacebookConfig>({
    company_id: company?.id || '',
    app_id: '',
    app_secret: '',
    access_token: '',
    pixel_id: '',
    ad_account_id: '',
    enable_tracking: true,
    advanced_matching: false,
    is_connected: false
  });

  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    if (company) {
      fetchFacebookConfig();
    }
  }, [company]);

  const fetchFacebookConfig = async () => {
    if (!company) return;
    
    try {
      const { data, error } = await supabase
        .from('facebook_configs')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setFbConfig({
          ...data,
          app_secret: data.app_secret ? '••••••••••••••••' : '', // Mask the secret
        });
      }
    } catch (error) {
      console.error('Error fetching Facebook config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFbConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnect = async () => {
    if (!fbConfig.app_id || !fbConfig.access_token) {
      toast({
        title: "Campos obrigatórios",
        description: "App ID e Access Token são obrigatórios para conectar com a API do Facebook.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, verify the token against the Facebook API
      // Here we'll just simulate a successful connection
      
      const updatedConfig = {
        ...fbConfig,
        is_connected: true,
        company_id: company?.id || '',
        updated_at: new Date().toISOString()
      };
      
      // If there's an existing config, update it, otherwise insert a new one
      if (fbConfig.id) {
        // Don't send masked password back to server
        const configToSave = { 
          ...updatedConfig,
          // Only update app_secret if it's not masked (i.e., user changed it)
          app_secret: fbConfig.app_secret === '••••••••••••••••' 
            ? undefined 
            : fbConfig.app_secret
        };
        
        const { error } = await supabase
          .from('facebook_configs')
          .update(configToSave)
          .eq('id', fbConfig.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('facebook_configs')
          .insert([updatedConfig]);
          
        if (error) throw error;
      }
      
      setFbConfig(updatedConfig);
      
      toast({
        title: "Conectado com Sucesso",
        description: "API do Facebook configurada com sucesso.",
      });
    } catch (error) {
      console.error('Error connecting to Facebook API:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar à API do Facebook. Verifique suas credenciais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const tutorialSteps = [
    {
      title: "Criar uma Conta de Desenvolvedor",
      content: "Acesse developers.facebook.com e crie uma conta de desenvolvedor do Facebook."
    },
    {
      title: "Criar um Aplicativo",
      content: "No painel do desenvolvedor, clique em 'Criar Aplicativo' e selecione o tipo de aplicativo que você deseja criar."
    },
    {
      title: "Configurar o Aplicativo",
      content: "Preencha as informações básicas do aplicativo, incluindo nome, e-mail de contato e finalidade."
    },
    {
      title: "Obter Credenciais",
      content: "Na página de configurações do aplicativo, você encontrará o App ID e o App Secret. Guarde essas informações com segurança."
    },
    {
      title: "Gerar um Token de Acesso",
      content: "Vá para a seção 'Ferramentas' > 'Graph API Explorer' para gerar um token de acesso. Selecione seu aplicativo e as permissões necessárias."
    },
    {
      title: "Configurar o Pixel",
      content: "No Gerenciador de Eventos, crie um Pixel do Facebook e obtenha o ID do Pixel para rastreamento de conversões."
    },
    {
      title: "Encontrar o ID da Conta de Anúncios",
      content: "No Gerenciador de Anúncios do Facebook, localize o ID da sua conta de anúncios. Ele geralmente começa com 'act_'."
    }
  ];

  if (loadingConfig) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            <span>Configuração da API do Facebook</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Conecte sua campanha ao Facebook para automatizar métricas e otimizar resultados
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="config">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div className={`p-3 rounded-md flex items-center gap-3 ${
                  fbConfig.is_connected ? 'bg-green-900/20 border border-green-700/30 text-green-400' :
                  'bg-amber-900/20 border border-amber-700/30 text-amber-400'
                }`}>
                  {fbConfig.is_connected ? (
                    <Check className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <div className="text-sm">
                    {fbConfig.is_connected ? (
                      <p><strong>Conectado:</strong> API do Facebook configurada com sucesso.</p>
                    ) : (
                      <p><strong>Desconectado:</strong> Configure suas credenciais para integrar com a API do Facebook.</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appId">
                      App ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="appId"
                      value={fbConfig.app_id}
                      onChange={(e) => handleChange('app_id', e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appSecret">App Secret</Label>
                    <div className="relative">
                      <Input
                        id="appSecret"
                        type="password"
                        value={fbConfig.app_secret}
                        onChange={(e) => handleChange('app_secret', e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••"
                      />
                      <Key className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accessToken">
                    Access Token <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accessToken"
                    value={fbConfig.access_token}
                    onChange={(e) => handleChange('access_token', e.target.value)}
                    placeholder="EAAaXXzz..."
                  />
                  <p className="text-xs text-gray-400">
                    O token de acesso é necessário para acessar a API do Facebook Graph. 
                    Gere um token no Graph API Explorer.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pixelId">Pixel ID</Label>
                    <Input
                      id="pixelId"
                      value={fbConfig.pixel_id}
                      onChange={(e) => handleChange('pixel_id', e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adAccountId">Ad Account ID</Label>
                    <Input
                      id="adAccountId"
                      value={fbConfig.ad_account_id}
                      onChange={(e) => handleChange('ad_account_id', e.target.value)}
                      placeholder="act_123456789"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enableTracking">Habilitar Rastreamento</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableTracking"
                        checked={fbConfig.enable_tracking}
                        onCheckedChange={(checked) => handleChange('enable_tracking', checked)}
                      />
                      <Label htmlFor="enableTracking" className="text-sm text-gray-400">
                        {fbConfig.enable_tracking ? 'Ativado' : 'Desativado'}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="advancedMatching">Advanced Matching</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="advancedMatching"
                        checked={fbConfig.advanced_matching}
                        onCheckedChange={(checked) => handleChange('advanced_matching', checked)}
                      />
                      <Label htmlFor="advancedMatching" className="text-sm text-gray-400">
                        {fbConfig.advanced_matching ? 'Ativado' : 'Desativado'}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleConnect}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    {loading ? 'Conectando...' : 'Conectar com Facebook'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tutorial" className="mt-4 space-y-6">
              <div className="bg-card border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-vet-primary" />
                  <h3 className="text-lg font-medium">Tutorial de Configuração</h3>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {tutorialSteps.map((step, index) => (
                    <AccordionItem key={index} value={`step-${index + 1}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-vet-primary/20 text-vet-primary text-xs font-medium">
                            {index + 1}
                          </div>
                          <span>{step.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-8 border-l border-gray-800 ml-3 text-gray-400">
                          {step.content}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => window.open('https://developers.facebook.com/docs/marketing-api/get-started', '_blank')}
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>Acessar Documentação Completa</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t border-gray-800 pt-4">
          <div className="text-xs text-gray-400">
            <p>
              A integração com a API do Facebook permite sincronizar métricas de campanha, 
              automatizar relatórios e otimizar resultados de marketing.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FacebookApiConfig;
