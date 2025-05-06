
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ContactFormModal from './ContactFormModal';

const Hero = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "Gerenciador de Lançamentos",
    subtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para diversos nichos de mercado.",
    aboutText: "Método 6 em 7, Adaptável para Qualquer Nicho",
    features: [
      {
        title: "Pré-Lançamento",
        desc: "Construção de autoridade e captação de leads qualificados",
        color: "bg-primary"
      },
      {
        title: "Evento de Lançamento",
        desc: "Aulas ao vivo com alta conversão e engajamento",
        color: "bg-accent"
      },
      {
        title: "Automação Inteligente",
        desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
        color: "bg-blue-600"
      }
    ]
  });
  
  useEffect(() => {
    // Check if there's stored content in localStorage
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { companyInfo } = JSON.parse(storedConfig);
        if (companyInfo) {
          const features = companyInfo.heroFeatures || heroData.features;
          
          setHeroData({
            title: companyInfo.heroTitle || heroData.title,
            subtitle: companyInfo.heroSubtitle || heroData.subtitle,
            aboutText: companyInfo.aboutText || heroData.aboutText,
            features: features
          });
        }
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-card z-0"></div>
      
      {/* Floating elements - decorative */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="animate-fade-in">
          <span className="inline-block px-4 py-1.5 mb-6 text-secondary bg-secondary/10 rounded-full font-medium text-sm">
            {heroData.aboutText}
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6 text-white">
            <span className="text-secondary">{heroData.title}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            {heroData.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg"
              onClick={() => setContactFormOpen(true)}
            >
              Começar Meu Lançamento
            </Button>
            <Button 
              variant="outline" 
              className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg"
              asChild
            >
              <a href="#estrategia">Ver Estratégia Completa</a>
            </Button>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {heroData.features.map((item, index) => (
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

      <ContactFormModal 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen}
        title="Começar meu lançamento"
        description="Preencha o formulário abaixo para receber mais informações sobre como iniciar seu lançamento de sucesso."
      />
    </div>
  );
};

export default Hero;
