
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextsFormProps {
  companyInfo: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
  };
  handleCompanyInfoChange: (field: string, value: string) => void;
}

const TextsForm: React.FC<TextsFormProps> = ({ 
  companyInfo, 
  handleCompanyInfoChange 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título do Hero</label>
        <Input 
          value={companyInfo.heroTitle} 
          onChange={(e) => handleCompanyInfoChange('heroTitle', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtítulo do Hero</label>
        <Textarea 
          value={companyInfo.heroSubtitle} 
          onChange={(e) => handleCompanyInfoChange('heroSubtitle', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30 min-h-20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Texto Sobre</label>
        <Input 
          value={companyInfo.aboutText} 
          onChange={(e) => handleCompanyInfoChange('aboutText', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
    </div>
  );
};

export default TextsForm;
