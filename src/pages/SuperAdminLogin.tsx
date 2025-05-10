
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const SuperAdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("38988285462"); // Pre-set the WhatsApp number
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  
  // Check if user is already authenticated as super admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const storedSession = localStorage.getItem('super_admin_session');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session && session.isValid && new Date(session.expiresAt) > new Date()) {
            setIsAuthenticated(true);
            navigate('/super-admin');
          }
        } catch (error) {
          // Invalid session format, clear it
          localStorage.removeItem('super_admin_session');
        }
      }
    };
    
    checkSuperAdmin();
  }, [navigate]);
  
  const handleRequestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe o email para solicitar o código de acesso.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the edge function to request an access code
      const { data, error } = await supabase.functions.invoke('super-admin-auth', {
        body: {
          action: 'request_code',
          email,
          phoneNumber: whatsapp
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.message || "Não foi possível enviar o código de acesso.");
      }
      
      toast({
        title: "Código enviado",
        description: `Um código de acesso foi enviado para o seu WhatsApp (${whatsapp}).`,
      });
      
      // Move to code verification step
      setStep('code');
      
      // In development, show the code in the toast if available
      if (data.devCode) {
        toast({
          title: "Código de desenvolvimento",
          description: `Código: ${data.devCode} (apenas visível em ambiente de desenvolvimento)`,
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error("Erro ao solicitar código:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o código de acesso.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode) {
      toast({
        title: "Código necessário",
        description: "Por favor, digite o código de acesso recebido.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the edge function to verify the access code
      const { data, error } = await supabase.functions.invoke('super-admin-auth', {
        body: {
          action: 'verify_code',
          email,
          code: accessCode
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success || !data.session) {
        throw new Error(data.message || "Não foi possível verificar o código.");
      }
      
      // Store the super admin session
      localStorage.setItem('super_admin_session', JSON.stringify(data.session));
      
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado como Super Admin."
      });
      
      // Redirect to super admin dashboard
      navigate('/super-admin');
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast({
        title: "Erro de autenticação",
        description: error.message || "Não foi possível autenticar. Verifique o código e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const goBack = () => {
    setStep('email');
    setAccessCode('');
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Acesso Super Admin</h1>
          <p className="text-gray-400">Área restrita para administradores do sistema</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-card/90 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <span>Super Admin</span>
            </CardTitle>
            <CardDescription>
              {step === 'email' 
                ? "Para acessar, informe seu email de Super Admin."
                : "Digite o código de acesso enviado para seu WhatsApp."}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Super Admin</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="super.admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-input/50"
                    autoComplete="off"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp para receber o código</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(38) 98828-5462"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="bg-background/50 border-input/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? (
                    "Enviando código..."
                  ) : (
                    "Solicitar Código de Acesso"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Código de Acesso</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="XXXX-XXXX"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="bg-background/50 border-input/50 text-center tracking-widest font-mono"
                    maxLength={8}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? (
                      "Verificando..."
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Acessar Painel
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={loading}
                    className="mt-2"
                  >
                    Voltar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-gray-800 pt-4 flex justify-center">
            <p className="text-xs text-gray-400 text-center">
              Acesso exclusivo para administradores autorizados do sistema
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
