
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div>
      <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
      <Input 
        value={companyInfo.name} 
        onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
        className="bg-vet-primary/20 border-vet-primary/30"
      />
    </div>
  );
};

export default CompanyInfoForm;
