
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFacebookConfig } from '@/hooks/useFacebookConfig';
import FacebookConfigForm from './FacebookConfigForm';
import FacebookTutorial from './FacebookTutorial';
import { Facebook } from 'lucide-react';
import { TutorialStep } from '@/types/facebook';

const FacebookApiConfig = () => {
  const { fbConfig, loading, loadingConfig, handleChange, handleConnect } = useFacebookConfig();
  
  const tutorialSteps: TutorialStep[] = [
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
              <FacebookConfigForm 
                fbConfig={fbConfig}
                loading={loading}
                handleChange={handleChange}
                handleConnect={handleConnect}
              />
            </TabsContent>
            
            <TabsContent value="tutorial" className="mt-4 space-y-6">
              <FacebookTutorial steps={tutorialSteps} />
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
