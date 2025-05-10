
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Key, Facebook } from 'lucide-react';
import { FacebookConfig } from '@/types/facebook';

interface FacebookConfigFormProps {
  fbConfig: FacebookConfig;
  loading: boolean;
  handleChange: (field: string, value: string | boolean) => void;
  handleConnect: () => void;
}

const FacebookConfigForm: React.FC<FacebookConfigFormProps> = ({
  fbConfig,
  loading,
  handleChange,
  handleConnect
}) => {
  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-md flex items-center gap-3 ${
        fbConfig.is_connected ? 'bg-green-900/20 border border-green-700/30 text-green-400' :
        'bg-amber-900/20 border border-amber-700/30 text-amber-400'
      }`}>
        {fbConfig.is_connected ? (
          <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">✓</div>
        ) : (
          <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">⚠</div>
        )}
        <div className="text-sm">
          {fbConfig.is_connected ? (
            <p><strong>Conectado:</strong> API do Facebook configurada com sucesso.</p>
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
            value={fbConfig.app_id}
            onChange={(e) => handleChange('app_id', e.target.value)}
            placeholder="123456789012345"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="appSecret">App Secret</Label>
          <div className="relative">
            <Input
              id="appSecret"
              type="password"
              value={fbConfig.app_secret}
              onChange={(e) => handleChange('app_secret', e.target.value)}
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
          value={fbConfig.access_token}
          onChange={(e) => handleChange('access_token', e.target.value)}
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
            value={fbConfig.pixel_id}
            onChange={(e) => handleChange('pixel_id', e.target.value)}
            placeholder="123456789012345"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="adAccountId">Ad Account ID</Label>
          <Input
            id="adAccountId"
            value={fbConfig.ad_account_id}
            onChange={(e) => handleChange('ad_account_id', e.target.value)}
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
              checked={fbConfig.enable_tracking}
              onCheckedChange={(checked) => handleChange('enable_tracking', checked)}
            />
            <Label htmlFor="enableTracking" className="text-sm text-gray-400">
              {fbConfig.enable_tracking ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="advancedMatching">Advanced Matching</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="advancedMatching"
              checked={fbConfig.advanced_matching}
              onCheckedChange={(checked) => handleChange('advanced_matching', checked)}
            />
            <Label htmlFor="advancedMatching" className="text-sm text-gray-400">
              {fbConfig.advanced_matching ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleConnect}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          <Facebook className="h-4 w-4 mr-2" />
          {loading ? 'Conectando...' : 'Conectar com Facebook'}
        </Button>
      </div>
    </div>
  );
};

export default FacebookConfigForm;
