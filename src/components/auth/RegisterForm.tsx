
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserPlus, Building } from "lucide-react";
import { formatWhatsapp } from '@/utils/formatters';

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    email: string;
    whatsapp: string;
    companyName: string;
  }) => Promise<void>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerWhatsapp, setRegisterWhatsapp] = useState("");
  const [registerCompanyName, setRegisterCompanyName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
      await onRegister({
        name: registerName,
        email: registerEmail,
        whatsapp: registerWhatsapp,
        companyName: registerCompanyName
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatWhatsapp(value);
    setRegisterWhatsapp(formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
