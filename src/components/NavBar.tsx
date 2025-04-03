
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import ContactFormModal from './ContactFormModal';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [companyName, setCompanyName] = useState("Veto pro 360");
  const [contactFormOpen, setContactFormOpen] = useState(false);
  
  useEffect(() => {
    // Check if there's stored company info in localStorage
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { companyInfo } = JSON.parse(storedConfig);
        if (companyInfo?.name) {
          setCompanyName(companyInfo.name);
        }
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
      scrolled ? "bg-vet-primary/95 shadow-md backdrop-blur-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-poppins text-white">
            <span className="text-vet-accent">{companyName}</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="#estrategia">Estratégia</NavLink>
          <NavLink href="#etapas">Etapas</NavLink>
          <NavLink href="#automacao">Automação</NavLink>
          <NavLink href="#custos">Custos</NavLink>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            className="bg-vet-accent hover:bg-vet-accent/90 text-white px-6"
            onClick={() => setContactFormOpen(true)}
          >
            Começar Agora
          </Button>
          <Button asChild variant="ghost" className="text-white p-1" aria-label="Administração">
            <a href="/admin">
              <ShieldCheck className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
      
      <ContactFormModal 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen}
        title="Começar meu lançamento"
        description="Preencha o formulário abaixo para receber mais informações sobre como iniciar seu lançamento de sucesso."
      />
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <a 
      href={href} 
      className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200 font-medium"
    >
      {children}
    </a>
  );
};

export default NavBar;
