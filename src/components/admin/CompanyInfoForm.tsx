
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CompanyInfoFormProps {
  companyInfo: {
    name: string;
    heroTitle?: string;
    heroSubtitle?: string;
    aboutText?: string;
    website?: string;
    address?: string;
    phone?: string;
    industry?: string;
    size?: string;
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
    texts?: {
      slogan: string;
      aboutShort: string;
      about: string;
    };
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  handleCompanyInfoChange: (field: string, value: string) => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ 
  companyInfo, 
  handleCompanyInfoChange 
}) => {
  // Map the companyInfo data structure to what the component expects
  const heroTitle = companyInfo.heroTitle || companyInfo.texts?.slogan || '';
  const heroSubtitle = companyInfo.heroSubtitle || companyInfo.texts?.aboutShort || '';
  const aboutText = companyInfo.aboutText || companyInfo.texts?.about || '';

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="company-name" className="block text-sm font-medium mb-1">Nome da Empresa</Label>
        <Input 
          id="company-name"
          value={companyInfo.name} 
          onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      
      <div>
        <Label htmlFor="hero-title" className="block text-sm font-medium mb-1">Título Principal</Label>
        <Input 
          id="hero-title"
          value={heroTitle} 
          onChange={(e) => handleCompanyInfoChange(companyInfo.heroTitle ? 'heroTitle' : 'texts.slogan', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      
      <div>
        <Label htmlFor="hero-subtitle" className="block text-sm font-medium mb-1">Subtítulo</Label>
        <Textarea 
          id="hero-subtitle"
          value={heroSubtitle} 
          onChange={(e) => handleCompanyInfoChange(companyInfo.heroSubtitle ? 'heroSubtitle' : 'texts.aboutShort', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30 resize-none min-h-20"
        />
      </div>
      
      <div>
        <Label htmlFor="about-text" className="block text-sm font-medium mb-1">Texto "Sobre"</Label>
        <Input 
          id="about-text"
          value={aboutText} 
          onChange={(e) => handleCompanyInfoChange(companyInfo.aboutText ? 'aboutText' : 'texts.about', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;
