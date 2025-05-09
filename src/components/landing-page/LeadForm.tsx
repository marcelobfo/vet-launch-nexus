
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface LeadFormProps {
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
  formContent?: Record<string, any>;
}

const LeadForm: React.FC<LeadFormProps> = ({
  pageId,
  companyCode,
  pageTitle,
  pageSlug,
  formContent
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, informe seu email');
      return;
    }
    
    if (!privacyAccepted) {
      setError('Por favor, aceite os termos de privacidade');
      return;
    }
    
    setError('');
    setSubmitting(true);

    try {
      // Mock submission logic 
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-medium text-center mb-4">Obrigado!</h3>
        <p className="text-center mb-4">
          Seu cadastro foi realizado com sucesso. Em breve entraremos em contato.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone / WhatsApp</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="privacy" 
            checked={privacyAccepted} 
            onCheckedChange={(checked) => setPrivacyAccepted(Boolean(checked))} 
          />
          <Label htmlFor="privacy" className="text-sm">
            Concordo com a política de privacidade e termos de uso
          </Label>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={submitting}
        >
          {submitting ? 'Enviando...' : 'Cadastrar'}
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;
