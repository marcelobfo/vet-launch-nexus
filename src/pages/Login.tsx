
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, UserPlus, Send, ArrowRight } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerWhatsapp, setRegisterWhatsapp] = useState("");
  const [registerCompanyCode, setRegisterCompanyCode] = useState("");
  
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail.trim()) {
      toast({
        title: "E-mail necessário",
        description: "Por favor, insira seu e-mail para receber o código de acesso.",
        variant: "destructive"
      });
      return;
    }
    
    if (!companyCode.trim()) {
      toast({
        title: "Código da empresa necessário",
        description: "Por favor, insira o código da empresa para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would be a fetch to your backend
      // to verify the company code and send the login code via SMTP
      setTimeout(() => {
        // Simulating API response
        setCodeSent(true);
        setLoading(false);
        toast({
          title: "Código enviado",
          description: `Um código de acesso foi enviado para ${loginEmail}.`,
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao enviar código",
        description: "Não foi possível enviar o código. Verifique as informações e tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginCode.trim()) {
      toast({
        title: "Código necessário",
        description: "Por favor, insira o código recebido por e-mail.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would be a fetch to your backend
      // to verify the login code
      setTimeout(() => {
        // Simulating successful login
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", loginEmail);
        localStorage.setItem("companyCode", companyCode);
        
        setLoading(false);
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o dashboard.",
        });
        
        // Redirect to appropriate page
        navigate("/");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Código inválido ou expirado. Por favor, tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName.trim() || !registerEmail.trim() || !registerWhatsapp.trim() || !registerCompanyCode.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios para o cadastro.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would be a fetch to your backend
      // to register the user and send the registration data to the webhook
      setTimeout(() => {
        // Simulate webhook call with registration data
        console.log("Webhook payload:", {
          name: registerName,
          email: registerEmail,
          whatsapp: registerWhatsapp,
          companyCode: registerCompanyCode,
          timestamp: new Date().toISOString()
        });
        
        setLoading(false);
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Você receberá um código de acesso no e-mail informado.",
        });
        
        // Switch to login tab after successful registration
        setActiveTab("login");
        setLoginEmail(registerEmail);
        setCompanyCode(registerCompanyCode);
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível completar o cadastro. Tente novamente mais tarde.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const formatWhatsapp = (value: string) => {
    // Remove non-digits
    let digits = value.replace(/\D/g, '');
    
    // Format according to BR format: (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };
  
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatWhatsapp(value);
    setRegisterWhatsapp(formatted);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-vet-dark p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Vet Pro 360</h1>
          <p className="text-gray-400">Sistema de lançamentos para profissionais veterinários</p>
        </div>
        
        <Card className="bg-card border-gray-800">
          <CardHeader>
            <CardTitle>Acesso à Plataforma</CardTitle>
            <CardDescription>
              Faça login ou cadastre-se para acessar a plataforma
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login">
                {!codeSent ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-code">Código da Empresa</Label>
                      <Input
                        id="company-code"
                        type="text"
                        placeholder="Código da empresa"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value)}
                        className="bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 bg-vet-primary/20 border-vet-primary/30"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-vet-secondary hover:bg-vet-secondary/90"
                      disabled={loading}
                    >
                      {loading ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Código de Acesso
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-code">Código de Acesso</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="access-code"
                          type="text"
                          placeholder="Digite o código recebido por e-mail"
                          value={loginCode}
                          onChange={(e) => setLoginCode(e.target.value)}
                          className="pl-10 bg-vet-primary/20 border-vet-primary/30"
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Um código de acesso foi enviado para {loginEmail}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setCodeSent(false)}
                        disabled={loading}
                      >
                        Voltar
                      </Button>
                      
                      <Button 
                        type="submit" 
                        className="flex-1 bg-vet-secondary hover:bg-vet-secondary/90"
                        disabled={loading}
                      >
                        {loading ? (
                          "Verificando..."
                        ) : (
                          <>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Entrar
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-company-code">Código da Empresa</Label>
                    <Input
                      id="register-company-code"
                      type="text"
                      placeholder="Código da empresa"
                      value={registerCompanyCode}
                      onChange={(e) => setRegisterCompanyCode(e.target.value)}
                      className="bg-vet-primary/20 border-vet-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="bg-vet-primary/20 border-vet-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 bg-vet-primary/20 border-vet-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-whatsapp">WhatsApp</Label>
                    <Input
                      id="register-whatsapp"
                      type="tel"
                      placeholder="(XX) XXXXX-XXXX"
                      value={registerWhatsapp}
                      onChange={handleWhatsappChange}
                      maxLength={15}
                      className="bg-vet-primary/20 border-vet-primary/30"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-vet-primary hover:bg-vet-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      "Processando..."
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Cadastrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t border-gray-800 pt-4 flex justify-center">
            <p className="text-xs text-gray-400 text-center">
              Ao fazer login ou se cadastrar, você concorda com os Termos de Serviço e Política de Privacidade.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
