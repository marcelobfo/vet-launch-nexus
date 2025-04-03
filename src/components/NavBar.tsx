
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
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
        <div className="flex items-center">
          <h1 className="text-2xl font-bold font-poppins text-white">
            Vet<span className="text-vet-secondary">Launch</span>
            <span className="text-vet-accent">Nexus</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="#estrategia">Estratégia</NavLink>
          <NavLink href="#etapas">Etapas</NavLink>
          <NavLink href="#automacao">Automação</NavLink>
          <NavLink href="#custos">Custos</NavLink>
        </div>
        
        <Button className="bg-vet-accent hover:bg-vet-accent/90 text-white px-6">
          Começar Agora
        </Button>
      </div>
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
