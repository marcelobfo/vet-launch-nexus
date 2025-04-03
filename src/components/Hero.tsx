
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-vet-primary via-vet-primary/95 to-vet-dark z-0"></div>
      
      {/* Floating elements - veterinary related */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-vet-secondary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-vet-accent/10 rounded-full blur-2xl"></div>
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-vet-secondary/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="animate-fade-in">
          <span className="inline-block px-4 py-1.5 mb-6 text-vet-secondary bg-vet-secondary/10 rounded-full font-medium text-sm">
            Método 6 em 7, Adaptado para Veterinários
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6 text-white">
            Lançamento <span className="text-vet-secondary">Expert</span> Veterinário
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para profissionais veterinários.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-vet-accent hover:bg-vet-accent/90 text-white px-8 py-6 text-lg">
              Começar Meu Lançamento
            </Button>
            <Button variant="outline" className="border-vet-secondary text-vet-secondary hover:bg-vet-secondary/10 px-8 py-6 text-lg">
              Ver Estratégia Completa
            </Button>
          </div>
        </div>
        
        {/* Netflix-style features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Pré-Lançamento",
              desc: "Construção de autoridade e captação de leads qualificados",
              color: "bg-vet-secondary"
            },
            {
              title: "Evento de Lançamento",
              desc: "Aulas ao vivo com alta conversão e engajamento",
              color: "bg-vet-accent"
            },
            {
              title: "Automação Inteligente",
              desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
              color: "bg-blue-600"
            }
          ].map((item, index) => (
            <div key={index} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className={`w-12 h-1 ${item.color} mb-4`}></div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Down arrow */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#estrategia" className="text-white/70 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Hero;
