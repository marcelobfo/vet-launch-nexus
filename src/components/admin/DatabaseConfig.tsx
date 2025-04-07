
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Database, Lock, Server, Info, FileWarning } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span>Configuração do Banco de Dados</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure a conexão ao banco de dados MySQL para gerenciamento de usuários, empresas e projetos
          </CardDescription>
        </CardHeader>
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
    </div>
  );
};

export default DatabaseConfig;
