
import React from 'react';
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

interface RegisterSuccessProps {
  email: string;
  companyCode: string;
  onReset: () => void;
}

export const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ 
  email, 
  companyCode, 
  onReset 
}) => {
  return (
    <div className="space-y-4 text-center">
      <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
        <Building className="h-8 w-8 text-green-600" />
      </div>
      
      <h3 className="text-lg font-medium">Empresa Cadastrada!</h3>
      
      <p className="text-gray-400">
        Sua empresa foi cadastrada com sucesso.<br />
        Enviamos um código de acesso para <strong>{email}</strong>.
      </p>
      
      {companyCode && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
          <p className="text-sm text-gray-400 mb-2">Código da empresa:</p>
          <p className="text-xl font-mono font-bold tracking-wider">{companyCode}</p>
          <p className="text-xs text-gray-400 mt-2">
            Guarde este código. Ele será necessário para que outros usuários acessem sua empresa.
          </p>
        </div>
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={onReset}
        className="mt-4"
      >
        Voltar para Login
      </Button>
    </div>
  );
};
