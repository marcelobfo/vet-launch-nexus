
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Key, AlertTriangle, BookOpen, ArrowRight, Check } from 'lucide-react';

import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FacebookApiConfig = () => {
  const { toast } = useToast();
  
  const [fbConfig, setFbConfig] = useState({
    appId: '',
    appSecret: '',
    accessToken: '',
    pixelId: '',
    enableTracking: true,
    advancedMatching: false,
    campaignId: '',
    adAccountId: ''
  });

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');

  const handleChange = (field: string, value: string | boolean) => {
    setFbConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnect = () => {
    if (fbConfig.appId && fbConfig.accessToken) {
      setConnectionStatus('connected');
      toast({
        title: "Conectado com Sucesso",
        description: "API do Facebook configurada com sucesso (simulação).",
      });
    } else {
      setConnectionStatus('error');
      toast({
        title: "Erro de Conexão",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
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
    }
  ];

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
                  connectionStatus === 'connected' ? 'bg-green-900/20 border border-green-700/30 text-green-400' :
                  connectionStatus === 'error' ? 'bg-red-900/20 border border-red-700/30 text-red-400' :
                  'bg-amber-900/20 border border-amber-700/30 text-amber-400'
                }`}>
                  {connectionStatus === 'connected' ? (
                    <Check className="h-5 w-5 flex-shrink-0" />
                  ) : connectionStatus === 'error' ? (
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <div className="text-sm">
                    {connectionStatus === 'connected' ? (
                      <p><strong>Conectado:</strong> API do Facebook configurada com sucesso.</p>
                    ) : connectionStatus === 'error' ? (
                      <p><strong>Erro:</strong> Verifique as credenciais e tente novamente.</p>
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
                      value={fbConfig.appId}
                      onChange={(e) => handleChange('appId', e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appSecret">App Secret</Label>
                    <div className="relative">
                      <Input
                        id="appSecret"
                        type="password"
                        value={fbConfig.appSecret}
                        onChange={(e) => handleChange('appSecret', e.target.value)}
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
                    value={fbConfig.accessToken}
                    onChange={(e) => handleChange('accessToken', e.target.value)}
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
                      value={fbConfig.pixelId}
                      onChange={(e) => handleChange('pixelId', e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adAccountId">Ad Account ID</Label>
                    <Input
                      id="adAccountId"
                      value={fbConfig.adAccountId}
                      onChange={(e) => handleChange('adAccountId', e.target.value)}
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
                        checked={fbConfig.enableTracking}
                        onCheckedChange={(checked) => handleChange('enableTracking', checked)}
                      />
                      <Label htmlFor="enableTracking" className="text-sm text-gray-400">
                        {fbConfig.enableTracking ? 'Ativado' : 'Desativado'}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="advancedMatching">Advanced Matching</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="advancedMatching"
                        checked={fbConfig.advancedMatching}
                        onCheckedChange={(checked) => handleChange('advancedMatching', checked)}
                      />
                      <Label htmlFor="advancedMatching" className="text-sm text-gray-400">
                        {fbConfig.advancedMatching ? 'Ativado' : 'Desativado'}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleConnect}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Conectar com Facebook
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
                  <Button variant="outline" className="gap-2">
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
