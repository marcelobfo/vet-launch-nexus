
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Shield, User, UserPlus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Super admin credentials
  const [superAdmin, setSuperAdmin] = useState({
    username: "admin",
    password: "admin123",
    isEnabled: true
  });
  
  // Load saved super admin settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('superAdminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSuperAdmin(parsed);
      } catch (e) {
        console.error("Error parsing super admin settings:", e);
      }
    }
  }, []);
  
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
    
    // Save to localStorage
    const siteConfig = JSON.parse(localStorage.getItem('siteConfig') || '{}');
    localStorage.setItem('siteConfig', JSON.stringify({
      ...siteConfig,
      adminPassword: securitySettings.adminPassword,
      passwordProtection: securitySettings.passwordProtection
    }));
    
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
  
  const handleSuperAdminChange = (field: string, value: string | boolean) => {
    setSuperAdmin(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveSuperAdmin = () => {
    // Save super admin settings
    localStorage.setItem('superAdminSettings', JSON.stringify(superAdmin));
    
    toast({
      title: "Super Admin configurado",
      description: "As credenciais de Super Admin foram atualizadas.",
    });
  };
  
  // Function to create a new company as a super admin
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    adminName: '',
    whatsapp: ''
  });
  
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCompanyChange = (field: string, value: string) => {
    setNewCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.email || !newCompany.adminName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Fixed import to use the correct exported function
      const registration = await import('@/contexts/auth/registration');
      const result = await registration.register({
        name: newCompany.adminName,
        email: newCompany.email,
        whatsapp: newCompany.whatsapp,
        companyName: newCompany.name
      });
      
      if (result.success) {
        toast({
          title: "Empresa criada",
          description: `Empresa ${newCompany.name} criada com sucesso. Código da empresa: ${result.companyCode}`,
        });
        
        // Clear form
        setNewCompany({
          name: '',
          email: '',
          adminName: '',
          whatsapp: ''
        });
      } else {
        toast({
          title: "Erro ao criar empresa",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast({
        title: "Erro ao criar empresa",
        description: "Ocorreu um erro ao criar a empresa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="space-y-6">
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
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>Configurações de Super Admin</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure as credenciais de Super Admin para gerenciar todas as empresas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar Super Admin</Label>
              <p className="text-xs text-gray-400">
                Permite acessar o sistema como Super Admin para gerenciar todas as empresas
              </p>
            </div>
            <Switch
              checked={superAdmin.isEnabled}
              onCheckedChange={(checked) => handleSuperAdminChange('isEnabled', checked)}
            />
          </div>
          
          {superAdmin.isEnabled && (
            <div className="space-y-4 pl-2 border-l-2 border-vet-accent/30">
              <div>
                <Label htmlFor="super-username">Usuário Super Admin</Label>
                <Input
                  id="super-username"
                  placeholder="Digite o usuário"
                  value={superAdmin.username}
                  onChange={(e) => handleSuperAdminChange('username', e.target.value)}
                  className="bg-vet-accent/10 border-vet-accent/30 mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="super-password">Senha Super Admin</Label>
                <div className="relative mt-1">
                  <Input
                    id="super-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha"
                    value={superAdmin.password}
                    onChange={(e) => handleSuperAdminChange('password', e.target.value)}
                    className="bg-vet-accent/10 border-vet-accent/30 pr-10"
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
              
              <div className="pt-2">
                <Button 
                  onClick={handleSaveSuperAdmin} 
                  size="sm"
                  className="bg-vet-accent hover:bg-vet-accent/90"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Salvar Credenciais
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create new company as super admin */}
      {superAdmin.isEnabled && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Criar Nova Empresa</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Crie uma nova empresa como Super Admin
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                placeholder="Digite o nome da empresa"
                value={newCompany.name}
                onChange={(e) => handleCompanyChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="admin-email">E-mail do Administrador</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Digite o e-mail do administrador"
                value={newCompany.email}
                onChange={(e) => handleCompanyChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="admin-name">Nome do Administrador</Label>
              <Input
                id="admin-name"
                placeholder="Digite o nome do administrador"
                value={newCompany.adminName}
                onChange={(e) => handleCompanyChange('adminName', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="admin-whatsapp">WhatsApp do Administrador</Label>
              <Input
                id="admin-whatsapp"
                placeholder="Digite o WhatsApp do administrador"
                value={newCompany.whatsapp}
                onChange={(e) => handleCompanyChange('whatsapp', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleCreateCompany} 
              disabled={isCreating}
              className="ml-auto bg-vet-accent hover:bg-vet-accent/90"
            >
              {isCreating ? (
                <>Criando empresa...</>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Empresa
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SecuritySettings;
