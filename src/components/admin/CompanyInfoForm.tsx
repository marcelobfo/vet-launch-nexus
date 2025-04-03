
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CompanyInfoFormProps {
  companyInfo: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
  };
  handleCompanyInfoChange: (field: string, value: string) => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ 
  companyInfo, 
  handleCompanyInfoChange 
}) => {
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
          value={companyInfo.heroTitle} 
          onChange={(e) => handleCompanyInfoChange('heroTitle', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      
      <div>
        <Label htmlFor="hero-subtitle" className="block text-sm font-medium mb-1">Subtítulo</Label>
        <Textarea 
          id="hero-subtitle"
          value={companyInfo.heroSubtitle} 
          onChange={(e) => handleCompanyInfoChange('heroSubtitle', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30 resize-none min-h-20"
        />
      </div>
      
      <div>
        <Label htmlFor="about-text" className="block text-sm font-medium mb-1">Texto "Sobre"</Label>
        <Input 
          id="about-text"
          value={companyInfo.aboutText} 
          onChange={(e) => handleCompanyInfoChange('aboutText', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;
