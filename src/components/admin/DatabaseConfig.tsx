
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database, Server, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import BasicSettings from './database/BasicSettings';
import AdvancedSettings from './database/AdvancedSettings';
import ApiDocs from './database/ApiDocs';
import SetupGuide from './database/SetupGuide';
import SqlSchema from './database/SqlSchema';

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
        
        {showGuide && <SetupGuide supabaseConfig={supabaseConfig} />}
        
        <CardContent className="space-y-6">
          <Tabs value={configTab} onValueChange={setConfigTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <BasicSettings dbConfig={dbConfig} handleChange={handleChange} />
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <AdvancedSettings 
                dbConfig={{
                  tablePrefix: dbConfig.tablePrefix,
                  charset: dbConfig.charset,
                  collation: dbConfig.collation
                }} 
                handleChange={handleChange} 
              />
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6">
              <ApiDocs />
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
      
      {/* Hidden SQL Schema for copying */}
      <SqlSchema />
    </div>
  );
};

export default DatabaseConfig;
