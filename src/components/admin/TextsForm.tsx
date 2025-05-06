
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface Feature {
  title: string;
  desc: string;
  color: string;
}

interface TextsFormProps {
  companyInfo: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    heroFeatures?: Feature[];
  };
  handleCompanyInfoChange: (field: string, value: string | any) => void;
}

const TextsForm: React.FC<TextsFormProps> = ({ 
  companyInfo, 
  handleCompanyInfoChange 
}) => {
  // Initialize features if not present
  const features = companyInfo.heroFeatures || [
    { title: "Recurso 1", desc: "Descrição do recurso 1", color: "bg-primary" },
    { title: "Recurso 2", desc: "Descrição do recurso 2", color: "bg-accent" },
    { title: "Recurso 3", desc: "Descrição do recurso 3", color: "bg-blue-600" }
  ];
  
  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    handleCompanyInfoChange('heroFeatures', updatedFeatures);
  };
  
  const addFeature = () => {
    const updatedFeatures = [...features, { 
      title: `Recurso ${features.length + 1}`, 
      desc: `Descrição do recurso ${features.length + 1}`, 
      color: "bg-blue-600" 
    }];
    
    handleCompanyInfoChange('heroFeatures', updatedFeatures);
  };
  
  const removeFeature = (index: number) => {
    if (features.length <= 1) return;
    
    const updatedFeatures = features.filter((_, i) => i !== index);
    handleCompanyInfoChange('heroFeatures', updatedFeatures);
  };
  
  const colorOptions = [
    { label: "Primária", value: "bg-primary" },
    { label: "Secundária", value: "bg-secondary" },
    { label: "Destaque", value: "bg-accent" },
    { label: "Azul", value: "bg-blue-600" },
    { label: "Verde", value: "bg-green-600" },
    { label: "Vermelho", value: "bg-red-600" },
    { label: "Roxo", value: "bg-purple-600" },
    { label: "Âmbar", value: "bg-amber-600" },
    { label: "Esmeralda", value: "bg-emerald-600" },
  ];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título do Hero</label>
        <Input 
          value={companyInfo.heroTitle} 
          onChange={(e) => handleCompanyInfoChange('heroTitle', e.target.value)}
          className="bg-primary/20 border-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subtítulo do Hero</label>
        <Textarea 
          value={companyInfo.heroSubtitle} 
          onChange={(e) => handleCompanyInfoChange('heroSubtitle', e.target.value)}
          className="bg-primary/20 border-primary/30 min-h-20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Texto Sobre</label>
        <Input 
          value={companyInfo.aboutText} 
          onChange={(e) => handleCompanyInfoChange('aboutText', e.target.value)}
          className="bg-primary/20 border-primary/30"
        />
      </div>
      
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Recursos Destacados</label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addFeature}
            disabled={features.length >= 6}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Recurso
          </Button>
        </div>
        
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Recurso {index + 1}</span>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => removeFeature(index)}
                    disabled={features.length <= 1}
                    className="h-6 w-6"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Título</label>
                  <Input 
                    value={feature.title} 
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Descrição</label>
                  <Input 
                    value={feature.desc} 
                    onChange={(e) => handleFeatureChange(index, 'desc', e.target.value)}
                    className="text-sm h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Cor</label>
                  <select
                    value={feature.color}
                    onChange={(e) => handleFeatureChange(index, 'color', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 h-8 text-sm"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextsForm;
