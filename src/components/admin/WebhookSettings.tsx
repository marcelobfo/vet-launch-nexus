
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendReportToWebhook } from "@/utils/reportGenerator";
import { useToast } from "@/hooks/use-toast";
import { Clock, Globe, Send, Mail, User, Mail as MailIcon, MessageSquare } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface WebhookSettingsProps {
  companyInfo: any;
  metrics: any;
  webhookSettings: {
    url: string;
    autoSend: boolean;
    frequency: "daily" | "weekly" | "monthly";
    registrationWebhookUrl: string;
    whatsappWebhookUrl: string;
    smtpSettings: {
      host: string;
      port: number;
      user: string;
      password: string;
      fromEmail: string;
      fromName: string;
    };
  };
  setWebhookSettings: (settings: any) => void;
}

const WebhookSettings: React.FC<WebhookSettingsProps> = ({ 
  companyInfo, 
  metrics, 
  webhookSettings,
  setWebhookSettings
}) => {
  const { toast } = useToast();
  const { company } = useAuth();
  const [testLoading, setTestLoading] = useState(false);
  const [smtpTestLoading, setSmtpTestLoading] = useState(false);
  const [whatsappTestLoading, setWhatsappTestLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testWhatsapp, setTestWhatsapp] = useState("");
  
  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookSettings({
      ...webhookSettings,
      url: e.target.value
    });
  };
  
  const handleChangeRegistrationWebhookUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookSettings({
      ...webhookSettings,
      registrationWebhookUrl: e.target.value
    });
  };
  
  const handleChangeWhatsappWebhookUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookSettings({
      ...webhookSettings,
      whatsappWebhookUrl: e.target.value
    });
  };
  
  const handleToggleAutoSend = (checked: boolean) => {
    setWebhookSettings({
      ...webhookSettings,
      autoSend: checked
    });
  };
  
  const handleChangeFrequency = (value: string) => {
    setWebhookSettings({
      ...webhookSettings,
      frequency: value as "daily" | "weekly" | "monthly"
    });
  };
  
  const handleSmtpChange = (field: string, value: any) => {
    setWebhookSettings({
      ...webhookSettings,
      smtpSettings: {
        ...webhookSettings.smtpSettings,
        [field]: value
      }
    });
  };
  
  const handleTestWebhook = async () => {
    if (!webhookSettings.url) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL de webhook válida.",
        variant: "destructive"
      });
      return;
    }
    
    setTestLoading(true);
    
    try {
      const success = await sendReportToWebhook(
        webhookSettings.url, 
        companyInfo, 
        metrics
      );
      
      if (success) {
        toast({
          title: "Webhook testado com sucesso",
          description: "Os dados foram enviados para o endpoint configurado.",
        });
      } else {
        toast({
          title: "Falha no teste",
          description: "Não foi possível enviar os dados para o webhook.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao testar o webhook.",
        variant: "destructive"
      });
    } finally {
      setTestLoading(false);
    }
  };
  
  const handleTestSmtp = async () => {
    const { host, port, user, password, fromEmail, fromName } = webhookSettings.smtpSettings;
    
    if (!host || !port || !user || !password || !fromEmail || !fromName || !testEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos de configuração SMTP e o e-mail de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setSmtpTestLoading(true);
    
    try {
      // Atualizar as configurações SMTP da empresa atual
      if (company?.id) {
        const { error } = await supabase
          .from('companies')
          .update({
            smtp_host: host,
            smtp_port: port,
            smtp_user: user,
            smtp_pass: password,
            smtp_from: fromEmail
          })
          .eq('id', company.id);
          
        if (error) {
          throw new Error(error.message);
        }
      }
      
      // Enviar e-mail de teste via função edge
      const { data, error } = await supabase.functions.invoke('send-email-smtp', {
        body: {
          to: testEmail,
          subject: 'E-mail de teste - Vet Pro 360',
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #4f46e5; text-align: center;">Vet Pro 360</h2>
              <h3 style="text-align: center;">E-mail de teste</h3>
              <p>Este é um e-mail de teste para verificar suas configurações SMTP.</p>
              <p>Se você está recebendo este e-mail, suas configurações SMTP estão funcionando corretamente!</p>
              <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Vet Pro 360. Todos os direitos reservados.</p>
              </div>
            </div>
          `,
          companyId: company?.id
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "E-mail de teste enviado",
        description: `Um e-mail de teste foi enviado para ${testEmail}.`,
      });
    } catch (error) {
      console.error("Erro ao testar SMTP:", error);
      toast({
        title: "Erro ao testar SMTP",
        description: `Não foi possível enviar o e-mail de teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}.`,
        variant: "destructive"
      });
    } finally {
      setSmtpTestLoading(false);
    }
  };
  
  const handleTestWhatsApp = async () => {
    if (!webhookSettings.whatsappWebhookUrl || !testWhatsapp) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL do webhook do WhatsApp e o número para teste.",
        variant: "destructive"
      });
      return;
    }
    
    setWhatsappTestLoading(true);
    
    try {
      // Atualizar a configuração de webhook da empresa atual
      if (company?.id) {
        const { error } = await supabase
          .from('companies')
          .update({
            whatsapp_webhook_url: webhookSettings.whatsappWebhookUrl
          })
          .eq('id', company.id);
          
        if (error) {
          throw new Error(error.message);
        }
      }
      
      // Enviar mensagem de teste via webhook
      const testCode = Math.random().toString().substring(2, 8);
      
      const response = await fetch(webhookSettings.whatsappWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test_message',
          data: {
            phone: testWhatsapp,
            code: testCode,
            email: "teste@vetpro360.com",
            timestamp: new Date().toISOString()
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
      }
      
      toast({
        title: "Webhook do WhatsApp testado",
        description: `Uma mensagem de teste foi enviada para ${testWhatsapp}.`,
      });
    } catch (error) {
      console.error("Erro ao testar webhook do WhatsApp:", error);
      toast({
        title: "Erro ao testar webhook",
        description: `Não foi possível enviar a mensagem de teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}.`,
        variant: "destructive"
      });
    } finally {
      setWhatsappTestLoading(false);
    }
  };
  
  // Carregar dados da empresa ao montar o componente
  React.useEffect(() => {
    if (company?.id) {
      // Atualizar o state com a URL do webhook do WhatsApp da empresa
      if (company.whatsapp_webhook_url) {
        setWebhookSettings(prev => ({
          ...prev,
          whatsappWebhookUrl: company.whatsapp_webhook_url
        }));
      }
    }
  }, [company]);
  
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <span>Configurações de Integração</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure as integrações de webhook, registro de usuários, WhatsApp e SMTP
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="webhook">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="webhook">Webhook de Relatórios</TabsTrigger>
            <TabsTrigger value="registration">Webhook de Registro</TabsTrigger>
            <TabsTrigger value="whatsapp">Webhook do WhatsApp</TabsTrigger>
            <TabsTrigger value="smtp">Configurações SMTP</TabsTrigger>
          </TabsList>
          
          {/* Webhook Settings Tab */}
          <TabsContent value="webhook" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook de Relatórios</Label>
              <Input
                id="webhook-url"
                placeholder="https://seu-webhook.com/endpoint"
                value={webhookSettings.url}
                onChange={handleChangeUrl}
                className="bg-vet-primary/20 border-vet-primary/30"
              />
              <p className="text-xs text-gray-400 mt-1">
                Endpoint que receberá os dados do relatório no formato JSON
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Envio Automático</Label>
                  <p className="text-xs text-gray-400">
                    Ativar envio periódico de relatórios
                  </p>
                </div>
                <Switch
                  checked={webhookSettings.autoSend}
                  onCheckedChange={handleToggleAutoSend}
                />
              </div>
              
              {webhookSettings.autoSend && (
                <div className="pl-2 border-l-2 border-vet-secondary/30 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Label className="text-sm">Frequência de envio</Label>
                  </div>
                  
                  <Select 
                    value={webhookSettings.frequency} 
                    onValueChange={handleChangeFrequency}
                  >
                    <SelectTrigger className="w-full bg-vet-primary/20 border-vet-primary/30">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <p className="text-xs text-vet-accent mt-1">
                    Nota: Esta é uma simulação. Para implementação real, é necessário um servidor.
                  </p>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleTestWebhook} 
                disabled={testLoading || !webhookSettings.url}
                className="bg-vet-secondary hover:bg-vet-secondary/90"
              >
                {testLoading ? "Enviando..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Testar Webhook de Relatórios
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Registration Webhook Tab */}
          <TabsContent value="registration" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="registration-webhook-url">URL do Webhook de Registro</Label>
              <Input
                id="registration-webhook-url"
                placeholder="https://seu-webhook.com/registros"
                value={webhookSettings.registrationWebhookUrl}
                onChange={handleChangeRegistrationWebhookUrl}
                className="bg-vet-primary/20 border-vet-primary/30"
              />
              <p className="text-xs text-gray-400 mt-1">
                Endpoint que receberá os dados dos novos cadastros de usuários
              </p>
            </div>
            
            <div className="bg-vet-primary/10 p-4 rounded-md border border-vet-primary/30">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Dados enviados no cadastro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Nome:</span>
                    <span className="text-white">string</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>E-mail:</span>
                    <span className="text-white">string</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>WhatsApp:</span>
                    <span className="text-white">string</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Código da Empresa:</span>
                    <span className="text-white">string</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={() => {
                  toast({
                    title: "Webhook de teste enviado",
                    description: "Dados de teste enviados para o webhook de registro.",
                  });
                }} 
                disabled={!webhookSettings.registrationWebhookUrl}
                className="bg-vet-secondary hover:bg-vet-secondary/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Testar Webhook de Registro
              </Button>
            </div>
          </TabsContent>
          
          {/* WhatsApp Webhook Tab - NOVA SEÇÃO */}
          <TabsContent value="whatsapp" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-webhook-url">URL do Webhook do WhatsApp</Label>
              <Input
                id="whatsapp-webhook-url"
                placeholder="https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook-test/vetplataforma"
                value={webhookSettings.whatsappWebhookUrl}
                onChange={handleChangeWhatsappWebhookUrl}
                className="bg-vet-primary/20 border-vet-primary/30"
              />
              <p className="text-xs text-gray-400 mt-1">
                Endpoint que receberá os dados para envio de mensagens via WhatsApp
              </p>
            </div>
            
            <div className="bg-vet-primary/10 p-4 rounded-md border border-vet-primary/30">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Dados enviados para o WhatsApp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Tipo:</span>
                    <span className="text-white">access_code | test_message</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Telefone:</span>
                    <span className="text-white">string</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Código:</span>
                    <span className="text-white">string</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>E-mail:</span>
                    <span className="text-white">string</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-vet-primary/10 rounded-md border border-vet-primary/30 space-y-3">
              <h3 className="text-sm font-medium">Testar Webhook do WhatsApp</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Digite um número de WhatsApp para teste"
                    value={testWhatsapp}
                    onChange={(e) => setTestWhatsapp(e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30"
                  />
                </div>
                <Button 
                  onClick={handleTestWhatsApp} 
                  disabled={whatsappTestLoading}
                  className="bg-vet-secondary hover:bg-vet-secondary/90"
                >
                  {whatsappTestLoading ? "Enviando..." : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Testar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Uma mensagem de teste será enviada para verificar a configuração do webhook.
              </p>
            </div>
          </TabsContent>
          
          {/* SMTP Settings Tab */}
          <TabsContent value="smtp" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Servidor SMTP</Label>
                <Input
                  id="smtp-host"
                  placeholder="smtp.exemplo.com"
                  value={webhookSettings.smtpSettings.host}
                  onChange={(e) => handleSmtpChange('host', e.target.value)}
                  className="bg-vet-primary/20 border-vet-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Porta</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  placeholder="587"
                  value={webhookSettings.smtpSettings.port || ''}
                  onChange={(e) => handleSmtpChange('port', parseInt(e.target.value) || '')}
                  className="bg-vet-primary/20 border-vet-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuário</Label>
                <Input
                  id="smtp-user"
                  placeholder="seu@email.com"
                  value={webhookSettings.smtpSettings.user}
                  onChange={(e) => handleSmtpChange('user', e.target.value)}
                  className="bg-vet-primary/20 border-vet-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Senha</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  placeholder="********"
                  value={webhookSettings.smtpSettings.password}
                  onChange={(e) => handleSmtpChange('password', e.target.value)}
                  className="bg-vet-primary/20 border-vet-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-from-email">E-mail de Origem</Label>
                <Input
                  id="smtp-from-email"
                  placeholder="naoresponder@seudominio.com"
                  value={webhookSettings.smtpSettings.fromEmail}
                  onChange={(e) => handleSmtpChange('fromEmail', e.target.value)}
                  className="bg-vet-primary/20 border-vet-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-from-name">Nome de Exibição</Label>
                <Input
                  id="smtp-from-name"
                  placeholder="Vet Pro 360"
                  value={webhookSettings.smtpSettings.fromName}
                  onChange={(e) => handleSmtpChange('fromName', e.target.value)}
                  className="bg-vet-primary/20 border-vet-primary/30"
                />
              </div>
            </div>
            
            <div className="p-4 bg-vet-primary/10 rounded-md border border-vet-primary/30 space-y-3">
              <h3 className="text-sm font-medium">Testar Configuração SMTP</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Digite um e-mail para teste"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30"
                  />
                </div>
                <Button 
                  onClick={handleTestSmtp} 
                  disabled={smtpTestLoading}
                  className="bg-vet-secondary hover:bg-vet-secondary/90"
                >
                  {smtpTestLoading ? "Enviando..." : (
                    <>
                      <MailIcon className="mr-2 h-4 w-4" />
                      Testar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Um e-mail de teste será enviado para verificar a configuração SMTP.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-400">
          Certifique-se de configurar corretamente para garantir o funcionamento adequado
        </p>
      </CardFooter>
    </Card>
  );
};

export default WebhookSettings;
