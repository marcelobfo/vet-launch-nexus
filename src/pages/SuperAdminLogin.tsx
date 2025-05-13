
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const SuperAdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("marcelobfo@outlook.com");
  const [whatsapp, setWhatsapp] = useState("38988285462");
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  
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
      setError("Por favor, informe o email para solicitar o código de acesso.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Solicitando código para:", email);
      
      const response = await fetch(`https://opipazvvefdcdyywybpm.supabase.co/functions/v1/super-admin-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          action: 'request_code',
          email,
          phoneNumber: whatsapp
        })
      });
      
      const data = await response.json();
      console.log("Resposta:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao comunicar com o servidor");
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
      
      // Store the dev code if available
      if (data.devCode) {
        setDevCode(data.devCode);
        toast({
          title: "Código de desenvolvimento",
          description: `Código: ${data.devCode}`,
          variant: "default"
        });
      }
      
    } catch (err: any) {
      console.error("Erro ao solicitar código:", err);
      setError(err.message || "Não foi possível enviar o código de acesso.");
      toast({
        title: "Erro",
        description: err.message || "Não foi possível enviar o código de acesso.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode) {
      setError("Por favor, digite o código de acesso recebido.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://opipazvvefdcdyywybpm.supabase.co/functions/v1/super-admin-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          action: 'verify_code',
          email,
          code: accessCode
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao comunicar com o servidor");
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
    } catch (err: any) {
      console.error("Erro ao verificar código:", err);
      setError(err.message || "Não foi possível autenticar. Verifique o código e tente novamente.");
      toast({
        title: "Erro de autenticação",
        description: err.message || "Não foi possível autenticar. Verifique o código e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const goBack = () => {
    setStep('email');
    setAccessCode('');
    setError(null);
  };

  const autoFillCode = () => {
    if (devCode) {
      setAccessCode(devCode);
    }
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
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm text-red-500">{error}</span>
              </div>
            )}
            
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
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Enviando código...
                    </span>
                  ) : (
                    "Solicitar Código de Acesso"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Código de Acesso</Label>
                  <div className="relative">
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
                    {devCode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                        onClick={autoFillCode}
                      >
                        Auto-preencher
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Verificando...
                      </span>
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
