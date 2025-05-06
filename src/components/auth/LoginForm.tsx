
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Building, Send, ArrowRight, KeyRound } from "lucide-react";

interface LoginFormProps {
  onSendAccessCode: (email: string, companyCode: string) => Promise<void>;
  onVerifyAccessCode: (code: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSendAccessCode, 
  onVerifyAccessCode 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

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
      await onSendAccessCode(loginEmail, companyCode);
      setCodeSent(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      toast({
        title: "Código necessário",
        description: "Por favor, insira o código de acesso que foi enviado para seu e-mail.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await onVerifyAccessCode(accessCode);
    } finally {
      setLoading(false);
    }
  };

  if (!codeSent) {
    return (
      <form onSubmit={handleSendCode} className="space-y-4">
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
              Enviar Código de Acesso
            </>
          )}
        </Button>
      </form>
    );
  }
  
  return (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-gray-400 mb-1">Enviamos um código para</p>
        <p className="font-medium">{loginEmail}</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="access-code">Código de Acesso</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="access-code"
            type="text"
            placeholder="Digite o código recebido"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            className="pl-10 bg-background/50 border-input/50 text-center font-mono text-lg tracking-widest"
            maxLength={8}
            autoFocus
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-vet-primary hover:bg-vet-primary/90"
        disabled={loading}
      >
        {loading ? (
          "Verificando..."
        ) : (
          <>
            <ArrowRight className="mr-2 h-4 w-4" />
            Acessar Sistema
          </>
        )}
      </Button>
      
      <div className="text-center mt-4">
        <button 
          type="button" 
          onClick={() => setCodeSent(false)} 
          className="text-sm text-gray-400 hover:text-gray-300"
        >
          Voltar para envio de código
        </button>
      </div>
    </form>
  );
};
