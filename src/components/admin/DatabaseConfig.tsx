
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Database, Lock, Server, Info, FileWarning, Clipboard, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

const DatabaseConfig = () => {
  const { toast } = useToast();
  
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    database: 'vetpro360',
    username: 'admin',
    password: '',
    connectionType: 'mysql',
    enableSsl: true,
    tablePrefix: 'vp_',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci'
  });

  const [configTab, setConfigTab] = useState('basic');
  const [showGuide, setShowGuide] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const handleChange = (field: string, value: string | boolean) => {
    setDbConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = () => {
    toast({
      title: "Teste de Conexão",
      description: "Esta funcionalidade requer uma conexão com backend real. Utilize a integração com Supabase para implementar.",
    });
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuração Salva",
      description: "Esta funcionalidade requer uma conexão com backend real. Utilize a integração com Supabase para implementar.",
    });
  };

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

  // Configuração do Supabase para o arquivo config.toml
  const supabaseConfig = `project_id = "opipazvvefdcdyywybpm"

[functions.test-smtp]
verify_jwt = false

[functions.send-email]
verify_jwt = false`;

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>Configuração do Banco de Dados</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure a conexão ao banco de dados para gerenciamento de usuários, empresas e projetos
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowGuide(!showGuide)}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              {showGuide ? 'Esconder Guia' : 'Mostrar Guia Passo a Passo'}
            </Button>
          </div>
        </CardHeader>
        
        {showGuide && (
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
        )}
        
        <CardContent className="space-y-6">
          <Tabs value={configTab} onValueChange={setConfigTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="connectionType">Tipo de Conexão</Label>
                  <Select
                    value={dbConfig.connectionType}
                    onValueChange={(value) => handleChange('connectionType', value)}
                  >
                    <SelectTrigger id="connectionType">
                      <SelectValue placeholder="Selecione o tipo de conexão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mariadb">MariaDB</SelectItem>
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="supabase">Supabase (Recomendado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="enableSsl">Conexão Segura (SSL)</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSsl"
                      checked={dbConfig.enableSsl}
                      onCheckedChange={(checked) => handleChange('enableSsl', checked)}
                    />
                    <Label htmlFor="enableSsl" className="text-sm text-gray-400">
                      {dbConfig.enableSsl ? 'Ativado' : 'Desativado'}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={dbConfig.host}
                    onChange={(e) => handleChange('host', e.target.value)}
                    placeholder="localhost ou endereço IP"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="port">Porta</Label>
                  <Input
                    id="port"
                    value={dbConfig.port}
                    onChange={(e) => handleChange('port', e.target.value)}
                    placeholder="3306"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="database">Nome do Banco de Dados</Label>
                <Input
                  id="database"
                  value={dbConfig.database}
                  onChange={(e) => handleChange('database', e.target.value)}
                  placeholder="vetpro360"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    value={dbConfig.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="admin"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={dbConfig.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                    />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tablePrefix">Prefixo das Tabelas</Label>
                  <Input
                    id="tablePrefix"
                    value={dbConfig.tablePrefix}
                    onChange={(e) => handleChange('tablePrefix', e.target.value)}
                    placeholder="vp_"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="charset">Charset</Label>
                  <Select
                    value={dbConfig.charset}
                    onValueChange={(value) => handleChange('charset', value)}
                  >
                    <SelectTrigger id="charset">
                      <SelectValue placeholder="Selecione o charset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utf8mb4">utf8mb4</SelectItem>
                      <SelectItem value="utf8">utf8</SelectItem>
                      <SelectItem value="latin1">latin1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="collation">Collation</Label>
                <Select
                  value={dbConfig.collation}
                  onValueChange={(value) => handleChange('collation', value)}
                >
                  <SelectTrigger id="collation">
                    <SelectValue placeholder="Selecione a collation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</SelectItem>
                    <SelectItem value="utf8mb4_general_ci">utf8mb4_general_ci</SelectItem>
                    <SelectItem value="utf8_unicode_ci">utf8_unicode_ci</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <div className="bg-vet-dark/50 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  Documentação da API
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  A API REST permite integração com outras aplicações e serviços.
                </p>
                
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="endpoint1" className="border-gray-800">
                    <AccordionTrigger className="text-sm">
                      Endpoint de Usuários
                    </AccordionTrigger>
                    <AccordionContent className="text-xs">
                      <code className="block bg-black/30 p-2 rounded-md">
                        GET /api/v1/users<br />
                        POST /api/v1/users<br />
                        GET /api/v1/users/:id<br />
                        PUT /api/v1/users/:id<br />
                        DELETE /api/v1/users/:id
                      </code>
                      <p className="mt-2 text-gray-400">
                        Permite gerenciar usuários do sistema.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="endpoint2" className="border-gray-800">
                    <AccordionTrigger className="text-sm">
                      Endpoint de Empresas
                    </AccordionTrigger>
                    <AccordionContent className="text-xs">
                      <code className="block bg-black/30 p-2 rounded-md">
                        GET /api/v1/companies<br />
                        POST /api/v1/companies<br />
                        GET /api/v1/companies/:id<br />
                        PUT /api/v1/companies/:id<br />
                        DELETE /api/v1/companies/:id
                      </code>
                      <p className="mt-2 text-gray-400">
                        Permite gerenciar empresas no sistema.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="endpoint3" className="border-gray-800">
                    <AccordionTrigger className="text-sm">
                      Endpoint de Projetos
                    </AccordionTrigger>
                    <AccordionContent className="text-xs">
                      <code className="block bg-black/30 p-2 rounded-md">
                        GET /api/v1/projects<br />
                        POST /api/v1/projects<br />
                        GET /api/v1/projects/:id<br />
                        PUT /api/v1/projects/:id<br />
                        DELETE /api/v1/projects/:id
                      </code>
                      <p className="mt-2 text-gray-400">
                        Permite gerenciar projetos e tarefas.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-4 flex items-center gap-2 p-2 bg-amber-900/20 border border-amber-700/30 rounded-md text-amber-400 text-xs">
                  <FileWarning className="h-4 w-4" />
                  <p>
                    Para utilizar a API, será necessário implementar autenticação via token JWT.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              className="gap-2"
            >
              <Server className="h-4 w-4" />
              <span>Testar Conexão</span>
            </Button>
            
            <Button
              onClick={handleSaveConfig}
              className="bg-vet-primary hover:bg-vet-primary/90 gap-2"
            >
              <Database className="h-4 w-4" />
              <span>Salvar Configuração</span>
            </Button>
          </div>
          
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-md p-3 text-amber-400 text-sm">
            <p>
              <strong>Nota:</strong> Para implementar a funcionalidade completa de banco de dados, 
              recomenda-se utilizar a integração com Supabase, que oferece autenticação, 
              banco de dados e armazenamento para aplicações web.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Script oculto para o SQL Schema - usado apenas para copiar */}
      <script type="application/sql" style={{ display: 'none' }}>
{`-- Script para criar a estrutura do banco de dados no Supabase

-- Tabela de empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- Código único da empresa para acesso
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Configurações SMTP
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_pass TEXT,
  smtp_from TEXT,
  
  -- URL do webhook para receber notificações
  webhook_url TEXT,
  
  -- Permitir auto-cadastro de usuários
  allow_signup BOOLEAN DEFAULT true
);

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT,
  company_id UUID NOT NULL REFERENCES companies(id),
  role TEXT NOT NULL DEFAULT 'user', -- 'admin', 'user', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  department TEXT,
  
  -- Chave única para evitar duplicidade de email na mesma empresa
  UNIQUE(email, company_id)
);

-- Tabela de projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID NOT NULL REFERENCES companies(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'canceled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE,
  end_date DATE,
  owner_id UUID REFERENCES users(id)
);

-- Tabela de tarefas do projeto
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE,
  assigned_to UUID REFERENCES users(id)
);

-- Tabela de códigos de acesso temporários
CREATE TABLE access_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id),
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT false
);`}
      </script>
    </div>
  );
};

export default DatabaseConfig;
