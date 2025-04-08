
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, AlertCircle, Clipboard, CheckCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupGuideProps {
  supabaseConfig: string;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ supabaseConfig }) => {
  const { toast } = useToast();
  const [copiedText, setCopiedText] = React.useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
      toast({
        title: "Copiado!",
        description: `${label} foi copiado para a área de transferência.`
      });
    });
  };

  return (
    <div className="px-6 pb-4">
      <Alert className="bg-blue-950/40 border-blue-700/50 mb-4">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-400">Guia de Configuração do Banco de Dados</AlertTitle>
        <AlertDescription className="text-gray-300">
          Siga este guia passo a passo para configurar seu banco de dados e funções edge no Supabase.
        </AlertDescription>
      </Alert>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <div className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              Acessar o Painel do Supabase
            </h3>
            <p className="text-sm text-gray-400 pl-8">
              Faça login na sua conta Supabase e acesse o projeto onde deseja configurar o banco de dados.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <div className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              Criar as Tabelas no SQL Editor
            </h3>
            <p className="text-sm text-gray-400 pl-8">
              Acesse o SQL Editor no painel do Supabase e execute o script para criar as tabelas necessárias.
              Você pode usar o script do arquivo <code className="text-pink-400">src/lib/supabase-schema.sql</code>.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <div className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              Configurar as Edge Functions
            </h3>
            <p className="text-sm text-gray-400 pl-8">
              Crie um arquivo <code className="text-pink-400">supabase/config.toml</code> na raiz do seu projeto com o seguinte conteúdo:
            </p>
            <div className="bg-gray-900/70 p-3 rounded-md pl-8 relative">
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => copyToClipboard(supabaseConfig, 'Configuração do Supabase')}
              >
                {copiedText === 'Configuração do Supabase' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {supabaseConfig}
              </pre>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <div className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
              Implementar Functions de SMTP e Email
            </h3>
            <p className="text-sm text-gray-400 pl-8">
              Crie as pastas <code className="text-pink-400">supabase/functions/test-smtp</code> e <code className="text-pink-400">supabase/functions/send-email</code> e implemente as funções de edge conforme os arquivos já configurados no projeto.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <div className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</div>
              Implantar as Edge Functions
            </h3>
            <p className="text-sm text-gray-400 pl-8">
              Use o comando <code className="text-pink-400">supabase functions deploy test-smtp</code> e <code className="text-pink-400">supabase functions deploy send-email</code> para implantar suas funções.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <div className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">6</div>
              Configurar a Aplicação
            </h3>
            <p className="text-sm text-gray-400 pl-8">
              Atualize o arquivo <code className="text-pink-400">src/integrations/supabase/client.ts</code> com suas credenciais do Supabase e configure o componente <code className="text-pink-400">SMTPConfig</code> para usar as edge functions.
            </p>
          </div>
          
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-md p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-amber-400 font-medium text-sm">Importante!</h4>
                <p className="text-sm text-amber-300/80">
                  Nunca compartilhe suas chaves de API ou credenciais do Supabase. Use variáveis de ambiente e segredos para armazenar informações sensíveis.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                const schemaSQL = document.querySelector('script[type="application/sql"]');
                if (schemaSQL) {
                  copyToClipboard(schemaSQL.textContent || '', 'SQL do Esquema');
                }
              }}
            >
              <Download className="h-4 w-4" />
              Copiar SQL do Esquema
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SetupGuide;
