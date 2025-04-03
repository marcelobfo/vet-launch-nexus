
import React from 'react';
import { Input } from "@/components/ui/input";

interface ColorSchemeFormProps {
  companyInfo: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  handleCompanyInfoChange: (field: string, value: string) => void;
}

const ColorSchemeForm: React.FC<ColorSchemeFormProps> = ({ 
  companyInfo, 
  handleCompanyInfoChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cor Primária</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-md border border-white/20" 
            style={{ backgroundColor: companyInfo.primaryColor }}
          />
          <Input 
            type="text"
            value={companyInfo.primaryColor} 
            onChange={(e) => handleCompanyInfoChange('primaryColor', e.target.value)}
            className="bg-vet-primary/20 border-vet-primary/30"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cor Secundária</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-md border border-white/20" 
            style={{ backgroundColor: companyInfo.secondaryColor }}
          />
          <Input 
            type="text"
            value={companyInfo.secondaryColor} 
            onChange={(e) => handleCompanyInfoChange('secondaryColor', e.target.value)}
            className="bg-vet-primary/20 border-vet-primary/30"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cor de Destaque</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-md border border-white/20" 
            style={{ backgroundColor: companyInfo.accentColor }}
          />
          <Input 
            type="text"
            value={companyInfo.accentColor} 
            onChange={(e) => handleCompanyInfoChange('accentColor', e.target.value)}
            className="bg-vet-primary/20 border-vet-primary/30"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeForm;
