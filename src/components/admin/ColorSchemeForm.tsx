
import React from 'react';
import { Input } from "@/components/ui/input";

interface ColorSchemeFormProps {
  companyInfo: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    colors?: {
      primary: string;
      secondary: string;
      accent: string;
    }
  };
  handleCompanyInfoChange: (field: string, value: string) => void;
}

const ColorSchemeForm: React.FC<ColorSchemeFormProps> = ({ 
  companyInfo, 
  handleCompanyInfoChange 
}) => {
  // Map the companyInfo data structure to what the component expects
  const primaryColor = companyInfo.primaryColor || companyInfo.colors?.primary || '#00A3E0';
  const secondaryColor = companyInfo.secondaryColor || companyInfo.colors?.secondary || '#F28B00';
  const accentColor = companyInfo.accentColor || companyInfo.colors?.accent || '#95D600';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cor Primária</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-md border border-white/20" 
            style={{ backgroundColor: primaryColor }}
          />
          <Input 
            type="text"
            value={primaryColor} 
            onChange={(e) => handleCompanyInfoChange(companyInfo.primaryColor ? 'primaryColor' : 'colors.primary', e.target.value)}
            className="bg-vet-primary/20 border-vet-primary/30"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cor Secundária</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-md border border-white/20" 
            style={{ backgroundColor: secondaryColor }}
          />
          <Input 
            type="text"
            value={secondaryColor} 
            onChange={(e) => handleCompanyInfoChange(companyInfo.secondaryColor ? 'secondaryColor' : 'colors.secondary', e.target.value)}
            className="bg-vet-primary/20 border-vet-primary/30"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cor de Destaque</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-md border border-white/20" 
            style={{ backgroundColor: accentColor }}
          />
          <Input 
            type="text"
            value={accentColor} 
            onChange={(e) => handleCompanyInfoChange(companyInfo.accentColor ? 'accentColor' : 'colors.accent', e.target.value)}
            className="bg-vet-primary/20 border-vet-primary/30"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeForm;
