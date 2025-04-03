
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-vet-primary py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <h1 className="text-2xl font-bold font-poppins text-white mb-4">
              Vet<span className="text-vet-secondary">Launch</span>
              <span className="text-vet-accent">Nexus</span>
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              Estratégia completa para transformar seu conhecimento veterinário em um negócio digital de sucesso.
            </p>
            <div className="flex space-x-4">
              <SocialIcon />
              <SocialIcon />
              <SocialIcon />
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Recursos</h3>
            <ul className="space-y-2">
              <FooterLink href="#estrategia">Estratégia de Lançamento</FooterLink>
              <FooterLink href="#etapas">Linha do Tempo</FooterLink>
              <FooterLink href="#automacao">Automação</FooterLink>
              <FooterLink href="#custos">Custos</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Sobre</h3>
            <ul className="space-y-2">
              <FooterLink href="#">A Metodologia</FooterLink>
              <FooterLink href="#">Cases de Sucesso</FooterLink>
              <FooterLink href="#">Depoimentos</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Contato</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Fale Conosco</FooterLink>
              <FooterLink href="#">Suporte</FooterLink>
              <FooterLink href="#">Consultoria</FooterLink>
              <div className="text-gray-400 text-sm pt-4">
                <p>contato@vetlaunchnexus.com</p>
                <p>+55 (11) 99999-9999</p>
              </div>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2023 VetLaunchNexus. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm hover:text-gray-400 cursor-pointer">Termos de Uso</span>
            <span className="text-gray-500 text-sm hover:text-gray-400 cursor-pointer">Privacidade</span>
            <span className="text-gray-500 text-sm hover:text-gray-400 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <li>
    <a href={href} className="text-gray-400 text-sm hover:text-vet-secondary transition-colors duration-200">
      {children}
    </a>
  </li>
);

const SocialIcon = () => (
  <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-vet-secondary/20 transition-colors duration-200">
    <svg 
      className="w-4 h-4 text-white" 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  </a>
);

export default Footer;
