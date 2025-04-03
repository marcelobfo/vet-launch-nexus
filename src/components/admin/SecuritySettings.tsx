
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";

interface SecuritySettingsProps {
  securitySettings: {
    passwordProtection: boolean;
    adminPassword: string;
  };
  setSecuritySettings: (settings: any) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  securitySettings,
  setSecuritySettings
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const handleToggleProtection = (checked: boolean) => {
    setSecuritySettings({
      ...securitySettings,
      passwordProtection: checked
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecuritySettings({
      ...securitySettings,
      adminPassword: e.target.value
    });
    
    // Limpa o erro quando o usuário digita
    if (passwordError) setPasswordError("");
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    
    // Limpa o erro quando o usuário digita
    if (passwordError) setPasswordError("");
  };
  
  const validatePassword = () => {
    if (!securitySettings.adminPassword) {
      setPasswordError("A senha não pode estar vazia");
      return false;
    }
    
    if (securitySettings.adminPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return false;
    }
    
    return true;
  };
  
  const handleSavePassword = () => {
    if (!validatePassword()) return;
    
    toast({
      title: "Senha configurada",
      description: "A proteção por senha foi atualizada.",
    });
    
    // Limpa a confirmação após salvar
    setConfirmPassword("");
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span>Configurações de Segurança</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure a proteção por senha do painel administrativo
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Proteção por Senha</Label>
            <p className="text-xs text-gray-400">
              Ativar proteção por senha para o painel administrativo
            </p>
          </div>
          <Switch
            checked={securitySettings.passwordProtection}
            onCheckedChange={handleToggleProtection}
          />
        </div>
        
        {securitySettings.passwordProtection && (
          <div className="space-y-4 pl-2 border-l-2 border-vet-secondary/30">
            <div>
              <Label htmlFor="admin-password">Senha de Administrador</Label>
              <div className="relative mt-1">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a senha"
                  value={securitySettings.adminPassword}
                  onChange={handlePasswordChange}
                  className="bg-vet-primary/20 border-vet-primary/30 pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="bg-vet-primary/20 border-vet-primary/30 mt-1"
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSavePassword} 
                size="sm"
                className="bg-vet-secondary hover:bg-vet-secondary/90"
              >
                <Lock className="mr-2 h-4 w-4" />
                Salvar Senha
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
