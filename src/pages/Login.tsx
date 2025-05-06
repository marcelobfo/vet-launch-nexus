
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { RegisterSuccess } from '@/components/auth/RegisterSuccess';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendMagicLink, verifyLoginCode, register, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Register state
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [newCompanyCode, setNewCompanyCode] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  // Redirect if already authenticated
  if (user) {
    navigate('/');
    return null;
  }
  
  const handleSendAccessCode = async (email: string, companyCode: string) => {
    const result = await sendMagicLink(email, companyCode);
    
    if (result.success) {
      toast({
        title: "Código enviado",
        description: result.message || `Um código de acesso foi enviado para ${email}.`,
      });
    } else {
      toast({
        title: "Erro ao enviar código",
        description: result.message || "Não foi possível enviar o código. Verifique as informações e tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleVerifyAccessCode = async (email: string, code: string, companyCode: string) => {
    // Usar os valores passados diretamente da função handleVerifyCode
    const result = await verifyLoginCode(email, code, companyCode);
    
    if (result.success) {
      toast({
        title: "Acesso autorizado",
        description: "Você será redirecionado para o sistema.",
      });
      // Redirection is handled automatically by the auth context
    } else {
      toast({
        title: "Código inválido",
        description: result.message || "O código informado não é válido ou expirou. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleRegister = async (userData: { 
    name: string; 
    email: string; 
    whatsapp: string; 
    companyName: string 
  }) => {
    const result = await register(userData);
    
    if (result.success) {
      toast({
        title: "Cadastro realizado com sucesso",
        description: result.message || "Um código de acesso foi enviado para seu e-mail.",
      });
      
      setRegistrationComplete(true);
      setRegisteredEmail(userData.email);
      if (result.companyCode) {
        setNewCompanyCode(result.companyCode);
      }
    } else {
      toast({
        title: "Erro ao cadastrar",
        description: result.message || "Não foi possível completar o cadastro. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };
  
  const resetRegistrationForm = () => {
    setRegistrationComplete(false);
    setNewCompanyCode("");
    setRegisteredEmail("");
    setActiveTab("login");
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Gerenciador de Lançamentos</h1>
          <p className="text-gray-400">Sistema de lançamentos para diversas áreas de mercado</p>
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
                <LoginForm 
                  onSendAccessCode={handleSendAccessCode}
                  onVerifyAccessCode={handleVerifyAccessCode}
                />
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register">
                {!registrationComplete ? (
                  <RegisterForm onRegister={handleRegister} />
                ) : (
                  <RegisterSuccess 
                    email={registeredEmail}
                    companyCode={newCompanyCode}
                    onReset={resetRegistrationForm}
                  />
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
