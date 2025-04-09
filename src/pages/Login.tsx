
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Building, UserPlus, Send, ArrowRight } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendMagicLink, register, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerWhatsapp, setRegisterWhatsapp] = useState("");
  const [registerCompanyName, setRegisterCompanyName] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [newCompanyCode, setNewCompanyCode] = useState("");
  
  // Redirecionar se já estiver autenticado
  if (user) {
    navigate('/');
    return null;
  }
  
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail.trim()) {
      toast({
        title: "E-mail necessário",
        description: "Por favor, insira seu e-mail para receber o link de acesso.",
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
      const result = await sendMagicLink(loginEmail, companyCode);
      
      if (result.success) {
        setMagicLinkSent(true);
        toast({
          title: "Link enviado",
          description: result.message || `Um link de acesso foi enviado para ${loginEmail}.`,
        });
      } else {
        toast({
          title: "Erro ao enviar link",
          description: result.message || "Não foi possível enviar o link. Verifique as informações e tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar link",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName.trim() || !registerEmail.trim() || !registerWhatsapp.trim() || !registerCompanyName.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios para o cadastro.",
        variant: "destructive"
      });
      return;
    }
    
    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register({
        name: registerName,
        email: registerEmail,
        whatsapp: registerWhatsapp,
        companyName: registerCompanyName
      });
      
      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: result.message || "Um link de acesso foi enviado para seu e-mail.",
        });
        
        setRegistrationComplete(true);
        if (result.companyCode) {
          setNewCompanyCode(result.companyCode);
        }
        
        // Limpar campos de registro
        setRegisterName("");
        setRegisterEmail("");
        setRegisterWhatsapp("");
        setRegisterCompanyName("");
      } else {
        toast({
          title: "Erro ao cadastrar",
          description: result.message || "Não foi possível completar o cadastro. Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatWhatsapp = (value: string) => {
    // Remove não-dígitos
    let digits = value.replace(/\D/g, '');
    
    // Formata no padrão BR: (XX) XXXXX-XXXX
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
  
  const resetRegistrationForm = () => {
    setRegistrationComplete(false);
    setNewCompanyCode("");
    setActiveTab("login");
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Vet Pro 360</h1>
          <p className="text-gray-400">Sistema de lançamentos para profissionais veterinários</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-card/90 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Acesso à Plataforma</CardTitle>
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
                {!magicLinkSent ? (
                  <form onSubmit={handleSendMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-code">Código da Empresa</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="company-code"
                          type="text"
                          placeholder="Código da empresa"
                          value={companyCode}
                          onChange={(e) => setCompanyCode(e.target.value)}
                          className="pl-10 bg-background/50 border-input/50"
                        />
                      </div>
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
                          className="pl-10 bg-background/50 border-input/50"
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
                          Enviar Link de Acesso
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <h3 className="text-lg font-medium">Link enviado!</h3>
                    
                    <p className="text-gray-400">
                      Enviamos um link de acesso para <strong>{loginEmail}</strong>.<br />
                      Por favor, verifique seu e-mail e clique no link para acessar o sistema.
                    </p>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setMagicLinkSent(false)}
                      className="mt-4"
                    >
                      Voltar
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register">
                {!registrationComplete ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome Completo</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="bg-background/50 border-input/50"
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
                          className="pl-10 bg-background/50 border-input/50"
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
                        className="bg-background/50 border-input/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-company-name">Nome da Empresa</Label>
                      <Input
                        id="register-company-name"
                        type="text"
                        placeholder="Digite o nome da sua empresa"
                        value={registerCompanyName}
                        onChange={(e) => setRegisterCompanyName(e.target.value)}
                        className="bg-background/50 border-input/50"
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
                          Cadastrar Empresa
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
                      <Building className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <h3 className="text-lg font-medium">Empresa Cadastrada!</h3>
                    
                    <p className="text-gray-400">
                      Sua empresa foi cadastrada com sucesso.<br />
                      Enviamos um link de acesso para <strong>{registerEmail}</strong>.
                    </p>
                    
                    {newCompanyCode && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
                        <p className="text-sm text-gray-400 mb-2">Código da empresa:</p>
                        <p className="text-xl font-mono font-bold tracking-wider">{newCompanyCode}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Guarde este código. Ele será necessário para que outros usuários acessem sua empresa.
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetRegistrationForm}
                      className="mt-4"
                    >
                      Voltar para Login
                    </Button>
                  </div>
                )}
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
