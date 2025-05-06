
import React, { useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import Hero from '@/components/Hero';
import LaunchStrategy from '@/components/LaunchStrategy';
import Timeline from '@/components/Timeline';
import Automation from '@/components/Automation';
import Costs from '@/components/Costs';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

interface IndexProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}

const Index = ({ isDarkTheme, setIsDarkTheme }: IndexProps) => {
  const { user, company } = useAuth();
  
  useEffect(() => {
    // Load title from localStorage if available
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { companyInfo } = JSON.parse(storedConfig);
        if (companyInfo && companyInfo.heroTitle) {
          document.title = `${companyInfo.heroTitle} | Estratégia de Lançamento`;
        } else {
          document.title = "Gerenciador de Lançamentos | Estratégia de Lançamento";
        }
      } catch (error) {
        console.error("Error parsing stored config:", error);
        document.title = "Gerenciador de Lançamentos | Estratégia de Lançamento";
      }
    } else {
      document.title = "Gerenciador de Lançamentos | Estratégia de Lançamento";
    }
  }, []);

  return (
    <div className="min-h-screen bg-card text-white overflow-x-hidden">
      <NavBar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      <Hero />
      <LaunchStrategy />
      <Timeline />
      <Automation />
      <Costs />
      <FinalCta />
      <Footer />
    </div>
  );
};

export default Index;
