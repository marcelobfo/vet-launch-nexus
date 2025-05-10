
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Mail, Server, Send, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const SMTPConfig = () => {
  const { toast } = useToast();
  const { user, company } = useAuth();
  
  const [config, setConfig] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: '',
    smtp_secure: true,
    webhook_url: '',
    whatsapp_webhook_url: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  // Carregar configurações da empresa
  useEffect(() => {
    if (company) {
      setConfig({
        smtp_host: company.smtp_host || '',
        smtp_port: company.smtp_port?.toString() || '587',
        smtp_user: company.smtp_user || '',
        smtp_pass: company.smtp_pass || '',
        smtp_from: company.smtp_from || '',
        smtp_secure: true,
        webhook_url: company.webhook_url || '',
        whatsapp_webhook_url: company.whatsapp_webhook_url || ''
      });
      
      // Set test email to the current user's email by default
      if (user?.email) {
        setTestEmail(user.email);
      }
    }
  }, [company, user]);

  const handleChange = (field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestSMTP = async () => {
    if (!config.smtp_host || !config.smtp_port || !config.smtp_user || !config.smtp_pass || !config.smtp_from || !testEmail) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos de configuração SMTP e o e-mail de teste.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Log the parameters we're sending
      console.log("Testing SMTP with parameters:", {
        host: config.smtp_host,
        port: parseInt(config.smtp_port),
        user: config.smtp_user,
        pass: "***hidden***",
        from: config.smtp_from,
        to: testEmail
      });
      
      // Chamar uma edge function do Supabase para testar o envio de e-mail
      const { data, error } = await supabase.functions.invoke('test-smtp', {
        body: {
          config: {
            host: config.smtp_host,
            port: parseInt(config.smtp_port),
            user: config.smtp_user,
            pass: config.smtp_pass,
            from: config.smtp_from,
            secure: config.smtp_secure
          },
          to: testEmail,
          subject: 'Teste de Configuração SMTP',
          text: 'Este é um e-mail de teste para verificar a configuração SMTP.'
        }
      });

      console.log("SMTP test response:", data, error);

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Erro desconhecido ao testar SMTP");
      }

      toast({
        title: "Teste enviado com sucesso",
        description: "Verifique sua caixa de entrada para confirmar o recebimento do e-mail de teste.",
      });
    } catch (error) {
      console.error("Erro ao testar SMTP:", error);
      toast({
        title: "Erro ao testar SMTP",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao testar a configuração SMTP. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!config.webhook_url) {
      toast({
        title: "URL do Webhook ausente",
        description: "Informe a URL do webhook para realizar o teste.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Testar o webhook com uma requisição de teste
      const response = await fetch(config.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          data: {
            message: 'Teste de webhook',
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Webhook testado com sucesso",
        description: "A requisição de teste foi enviada com sucesso para o webhook.",
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro ao testar webhook",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao testar o webhook. Verifique a URL e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!company) return;

    setIsSaving(true);
    
    try {
      // Atualizar configurações da empresa no Supabase
      const { error } = await supabase
        .from('companies')
        .update({
          smtp_host: config.smtp_host,
          smtp_port: config.smtp_port ? parseInt(config.smtp_port) : null,
          smtp_user: config.smtp_user,
          smtp_pass: config.smtp_pass,
          smtp_from: config.smtp_from,
          webhook_url: config.webhook_url,
          whatsapp_webhook_url: config.whatsapp_webhook_url
        })
        .eq('id', company.id);

      if (error) throw new Error(error.message);

      // Atualizar o objeto da empresa no localStorage
      const session = localStorage.getItem('session');
      if (session) {
        const parsedSession = JSON.parse(session);
        const updatedCompany = {
          ...parsedSession.company,
          smtp_host: config.smtp_host,
          smtp_port: config.smtp_port ? parseInt(config.smtp_port) : null,
          smtp_user: config.smtp_user,
          smtp_pass: config.smtp_pass,
          smtp_from: config.smtp_from,
          webhook_url: config.webhook_url,
          whatsapp_webhook_url: config.whatsapp_webhook_url
        };
        localStorage.setItem('session', JSON.stringify({
          ...parsedSession,
          company: updatedCompany
        }));
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar configurações",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as configurações. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWhatsApp = async () => {
    if (!config.whatsapp_webhook_url) {
      toast({
        title: "URL do Webhook ausente",
        description: "Informe a URL do webhook do WhatsApp para realizar o teste.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Testar o webhook do WhatsApp com uma requisição de teste
      const response = await fetch(config.whatsapp_webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          data: {
            message: 'Teste de webhook do WhatsApp',
            timestamp: new Date().toISOString(),
            phoneNumber: company?.users && company.users.length > 0 && company.users[0].whatsapp ? 
              company.users[0].whatsapp : '5511999999999' // Número de exemplo se não houver
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Webhook do WhatsApp testado com sucesso",
        description: "A requisição de teste foi enviada com sucesso para o webhook do WhatsApp.",
      });
    } catch (error) {
      console.error("Erro ao testar webhook do WhatsApp:", error);
      toast({
        title: "Erro ao testar webhook do WhatsApp",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao testar o webhook do WhatsApp. Verifique a URL e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-md border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>Configuração de E-mail e Webhook</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure as opções de envio de e-mail e webhook para notificações
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuração SMTP</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">Servidor SMTP</Label>
                <Input
                  id="smtp_host"
                  value={config.smtp_host}
                  onChange={(e) => setConfig(prev => ({ ...prev, smtp_host: e.target.value }))}
                  placeholder="smtp.example.com"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_port">Porta</Label>
                <Input
                  id="smtp_port"
                  value={config.smtp_port}
                  onChange={(e) => setConfig(prev => ({ ...prev, smtp_port: e.target.value }))}
                  placeholder="587"
                  className="bg-background/50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_user">Usuário</Label>
                <Input
                  id="smtp_user"
                  value={config.smtp_user}
                  onChange={(e) => setConfig(prev => ({ ...prev, smtp_user: e.target.value }))}
                  placeholder="seu@email.com"
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp_pass">Senha</Label>
                <div className="relative">
                  <Input
                    id="smtp_pass"
                    type={showPassword ? "text" : "password"}
                    value={config.smtp_pass}
                    onChange={(e) => setConfig(prev => ({ ...prev, smtp_pass: e.target.value }))}
                    placeholder="••••••••"
                    className="bg-background/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp_from">E-mail de Envio</Label>
              <Input
                id="smtp_from"
                value={config.smtp_from}
                onChange={(e) => setConfig(prev => ({ ...prev, smtp_from: e.target.value }))}
                placeholder="noreply@seudominio.com"
                className="bg-background/50"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="smtp_secure"
                checked={config.smtp_secure}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, smtp_secure: checked }))}
              />
              <Label htmlFor="smtp_secure">Usar conexão segura (SSL/TLS)</Label>
            </div>
            
            <div className="bg-vet-primary/10 p-4 rounded-md border border-vet-primary/30 space-y-3 mt-4">
              <h3 className="text-sm font-medium">Testar Configuração SMTP</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Email para teste"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="bg-vet-primary/20 border-vet-primary/30"
                  />
                </div>
                <Button
                  onClick={handleTestSMTP}
                  variant="outline"
                  disabled={isTesting}
                  className="flex gap-2"
                >
                  {isTesting ? (
                    <>Testando...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Testar</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Um email de teste será enviado para verificar a configuração SMTP.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-lg font-medium">Configuração de Webhook</h3>
            <p className="text-sm text-gray-400">
              O webhook receberá os dados de novos cadastros e outras notificações de eventos.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="webhook_url">URL do Webhook</Label>
              <Input
                id="webhook_url"
                value={config.webhook_url}
                onChange={(e) => setConfig(prev => ({ ...prev, webhook_url: e.target.value }))}
                placeholder="https://seu-sistema.com/webhook"
                className="bg-background/50"
              />
            </div>
            
            <div className="pt-2">
              <Button
                onClick={handleTestWebhook}
                variant="outline"
                disabled={!config.webhook_url || isTesting}
                className="flex gap-2"
              >
                {isTesting ? (
                  <>Testando...</>
                ) : (
                  <>
                    <Server className="h-4 w-4" />
                    <span>Testar Webhook</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-lg font-medium">Configuração de Webhook do WhatsApp</h3>
            <p className="text-sm text-gray-400">
              Este webhook receberá os códigos de acesso e códigos de empresa para envio via WhatsApp.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp_webhook_url">URL do Webhook do WhatsApp</Label>
              <Input
                id="whatsapp_webhook_url"
                value={config.whatsapp_webhook_url}
                onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_webhook_url: e.target.value }))}
                placeholder="https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook-test/vetplataforma"
                className="bg-background/50"
              />
            </div>
            
            <div className="pt-2">
              <Button
                onClick={handleTestWhatsApp}
                variant="outline"
                disabled={!config.whatsapp_webhook_url || isTesting}
                className="flex gap-2"
              >
                {isTesting ? (
                  <>Testando...</>
                ) : (
                  <>
                    <Server className="h-4 w-4" />
                    <span>Testar Webhook do WhatsApp</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-md p-4 text-blue-400 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Informações importantes</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Configure um servidor SMTP válido para permitir o envio de códigos de acesso.</li>
                  <li>O webhook recebe notificações de novos cadastros e pode ser integrado com outros sistemas.</li>
                  <li>O webhook do WhatsApp permite enviar códigos de acesso via WhatsApp.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-gray-800 pt-4">
          <Button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="ml-auto flex gap-2 bg-vet-primary hover:bg-vet-primary/90"
          >
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Salvar Configurações</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SMTPConfig;
