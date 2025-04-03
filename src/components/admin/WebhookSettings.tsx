
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendReportToWebhook } from "@/utils/reportGenerator";
import { useToast } from "@/hooks/use-toast";
import { Clock, Globe, Send } from "lucide-react";

interface WebhookSettingsProps {
  companyInfo: any;
  metrics: any;
  webhookSettings: {
    url: string;
    autoSend: boolean;
    frequency: "daily" | "weekly" | "monthly";
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
  const [testLoading, setTestLoading] = useState(false);
  
  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookSettings({
      ...webhookSettings,
      url: e.target.value
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
  
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <span>Configurações de Webhook</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure o envio automático de relatórios por webhook
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook</Label>
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
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-400">
          Os dados serão enviados no formato JSON
        </p>
        <Button 
          onClick={handleTestWebhook} 
          disabled={testLoading || !webhookSettings.url}
          className="bg-vet-secondary hover:bg-vet-secondary/90"
        >
          {testLoading ? "Enviando..." : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Testar Webhook
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookSettings;
