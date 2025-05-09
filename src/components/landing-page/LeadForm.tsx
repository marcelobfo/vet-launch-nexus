
import React from 'react';
import { LeadFormData } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  formTitle?: string;
  formDescription?: string;
  buttonText?: string;
  showSuccessMessage?: boolean;
  isSubmitting?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({
  onSubmit,
  formTitle = "Cadastre-se para saber mais",
  formDescription = "Preencha o formulário abaixo e entraremos em contato",
  buttonText = "Enviar",
  showSuccessMessage = false,
  isSubmitting = false
}) => {
  const [formData, setFormData] = React.useState<LeadFormData>({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {showSuccessMessage ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cadastro realizado com sucesso!</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Obrigado pelo seu interesse. Entraremos em contato em breve.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-medium text-center mb-2">{formTitle}</h3>
          {formDescription && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">{formDescription}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Seu email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="tel"
                name="phone"
                placeholder="Seu telefone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : buttonText}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default LeadForm;
