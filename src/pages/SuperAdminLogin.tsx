
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
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !accessCode) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify if the email is registered as a super admin
      const { data: superAdmins, error: queryError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();
      
      if (queryError || !superAdmins) {
        throw new Error("Credenciais inválidas ou usuário não encontrado.");
      }
      
      // Verify access code
      const { data: accessCodeData, error: accessCodeError } = await supabase
        .from('super_admin_access_codes')
        .select('*')
        .eq('email', email)
        .eq('code', accessCode)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (accessCodeError || !accessCodeData) {
        throw new Error("Código de acesso inválido ou expirado.");
      }
      
      // Mark the access code as used
      await supabase
        .from('super_admin_access_codes')
        .update({ is_used: true })
        .eq('id', accessCodeData.id);
      
      // Update the last login timestamp
      await supabase
        .from('super_admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', superAdmins.id);
      
      // Set the super admin session with an expiration of 12 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 12);
      
      localStorage.setItem('super_admin_session', JSON.stringify({
        id: superAdmins.id,
        email: superAdmins.email,
        isValid: true,
        expiresAt: expiresAt.toISOString()
      }));
      
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado como Super Admin."
      });
      
      // Redirect to super admin dashboard
      navigate('/super-admin');
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro de autenticação",
        description: error.message || "Não foi possível autenticar. Verifique suas credenciais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRequestCode = async () => {
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
      // Check if the email is registered as a super admin
      const { data: superAdmin, error: queryError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();
      
      if (queryError || !superAdmin) {
        throw new Error("Email não registrado como Super Admin.");
      }
      
      // Generate a random 8 character access code
      const code = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                   Math.random().toString(36).substring(2, 6).toUpperCase();
      
      // Set expiration to 30 minutes from now
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);
      
      // Store the access code
      await supabase
        .from('super_admin_access_codes')
        .insert([
          { 
            email,
            code,
            expires_at: expiresAt.toISOString(),
            is_used: false
          }
        ]);
      
      // In a real application, send the code via email
      // For now, we'll just simulate this with a console log
      console.log(`Access code for ${email}: ${code}`);
      
      toast({
        title: "Código enviado",
        description: "Um código de acesso foi enviado para o seu email. Por favor, verifique sua caixa de entrada.",
      });
      
      // In development, show the code in the toast
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Código de desenvolvimento",
          description: `Código: ${code} (apenas visível em ambiente de desenvolvimento)`,
          variant: "default"
        });
      }
      
    } catch (error: any) {
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
              Para acessar, informe seu email e o código de acesso.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="super.admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-input/50"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessCode">Código de Acesso</Label>
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    className="text-xs text-blue-500 hover:underline"
                    disabled={loading}
                  >
                    Solicitar código
                  </button>
                </div>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="XXXX-XXXX"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="bg-background/50 border-input/50 text-center tracking-widest font-mono"
                  maxLength={8}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  "Autenticando..."
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Acessar Painel
                  </>
                )}
              </Button>
            </form>
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
