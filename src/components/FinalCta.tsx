
import React from 'react';
import { Button } from '@/components/ui/button';

const FinalCta = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-vet-primary/10 via-vet-primary/20 to-vet-primary/30 z-0"></div>
      
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-vet-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-vet-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        <div className="glass-card p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-white leading-tight">
            Pronto para Transformar seu Conhecimento Veterinário em um 
            <span className="text-vet-accent"> Negócio Digital</span>?
          </h2>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Aplique esta estratégia e maximize seus resultados com um lançamento estruturado e otimizado para o mercado veterinário.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button className="bg-vet-accent hover:bg-vet-accent/90 text-white px-8 py-6 text-lg">
              Iniciar Meu Lançamento
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
              Falar com um Especialista
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
    </section>
  );
};

const BenefitTag = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
    <svg className="w-4 h-4 text-vet-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-sm text-white">{text}</span>
  </div>
);

export default FinalCta;
