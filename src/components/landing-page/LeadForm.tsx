
import React, { useState } from 'react';
import { LeadFormData, LandingPageSection } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { check } from 'lucide-react';

interface FormSectionProps {
  content: LandingPageSection['content'];
  pageId: string;
  companyCode: string;
  pageTitle: string;
  pageSlug: string;
}

const LeadForm: React.FC<FormSectionProps> = ({ content, pageId, companyCode, pageTitle, pageSlug }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      alert('Por favor, informe seu email');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Chamar a edge function para processar o lead
      const { data, error } = await supabase.functions.invoke('process-lead', {
        body: {
          email: formData.email,
          name: formData.name || null,
          phone: formData.phone || null,
          companyCode: companyCode,
          landingPageId: pageId,
          source: 'landing-page',
          customFields: {
            page_slug: pageSlug,
            page_title: pageTitle
          }
        }
      });
      
      if (error) throw error;
      
      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      alert('Ocorreu um erro ao enviar o formulário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-md mx-auto">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">
            {content.title || "Preencha o formulário"}
          </h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Seu nome"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {submitting ? "Enviando..." : content.buttonText || "Enviar"}
          </button>
        </form>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto flex items-center justify-center">
            <check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium text-green-800 dark:text-green-300 mt-4">
            {content.successTitle || "Obrigado!"}
          </h3>
          <p className="text-green-700 dark:text-green-400 mt-2">
            {content.successMessage || "Suas informações foram enviadas com sucesso."}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadForm;
