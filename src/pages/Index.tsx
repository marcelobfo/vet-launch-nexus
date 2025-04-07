
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import Hero from '@/components/Hero';
import LaunchStrategy from '@/components/LaunchStrategy';
import Timeline from '@/components/Timeline';
import Automation from '@/components/Automation';
import Costs from '@/components/Costs';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';

const Index = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  useEffect(() => {
    document.title = "Vet Launch Nexus | Estratégia de Lançamento para Veterinários";
  }, []);

  return (
    <div className="min-h-screen bg-vet-dark text-white overflow-x-hidden">
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
