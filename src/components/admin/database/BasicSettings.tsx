
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";

interface BasicSettingsProps {
  dbConfig: {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
    connectionType: string;
    enableSsl: boolean;
  };
  handleChange: (field: string, value: string | boolean) => void;
}

const BasicSettings: React.FC<BasicSettingsProps> = ({ dbConfig, handleChange }) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default BasicSettings;
