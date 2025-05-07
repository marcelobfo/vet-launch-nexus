
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ContactFormModal from './ContactFormModal';

const FinalCta = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [isConfeitariaTemplate, setIsConfeitariaTemplate] = useState(false);
  const whatsappNumber = "5538988285462";
  const whatsappMessage = encodeURIComponent("Olá! Tenho interesse na estratégia de lançamento.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    // Check if the active template is the confeitaria one
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { activeTemplateId } = JSON.parse(storedConfig);
        setIsConfeitariaTemplate(activeTemplateId === "template-4");
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
  }, []);

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/30 z-0"></div>
      
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        <div className="glass-card p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-white leading-tight">
            {isConfeitariaTemplate ? (
              <>
                Pronto para Transformar sua Confeitaria em um 
                <span className="text-accent"> Negócio Digital</span>?
              </>
            ) : (
              <>
                Pronto para Transformar seu Conhecimento em um 
                <span className="text-accent"> Negócio Digital</span>?
              </>
            )}
          </h2>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {isConfeitariaTemplate ? (
              "Aplique esta estratégia e maximize seus resultados com um lançamento estruturado e otimizado para confeitaria gourmet."
            ) : (
              "Aplique esta estratégia e maximize seus resultados com um lançamento estruturado e otimizado para seu nicho."
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg"
              onClick={() => setContactFormOpen(true)}
            >
              Iniciar Meu Lançamento
            </Button>
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Falar com um Especialista
              </a>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <BenefitTag text="Estratégia Comprovada" />
            <BenefitTag text="Suporte Especializado" />
            <BenefitTag text="Otimização de Custos" />
            <BenefitTag text="Resultados Mensuráveis" />
          </div>
        </div>
      </div>
      
      <ContactFormModal 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen}
        title="Iniciar meu lançamento"
        description="Preencha o formulário abaixo para receber mais informações sobre como iniciar seu lançamento de sucesso."
      />
    </section>
  );
};

const BenefitTag = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-sm text-white">{text}</span>
  </div>
);

export default FinalCta;
