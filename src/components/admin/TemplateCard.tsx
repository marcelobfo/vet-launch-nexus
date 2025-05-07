
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Trash, FileText, Grid3X3 } from "lucide-react";
import { Template } from '@/data/defaultTemplates';

interface TemplateCardProps {
  template: Template;
  isActive: boolean;
  onApply: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isActive,
  onApply,
  onDuplicate,
  onDelete
}) => {
  return (
    <Card 
      className={`border ${isActive ? 'border-primary' : 'border-border'}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {isActive && (
              <Check className="h-5 w-5 mr-2 text-primary" />
            )}
            {template.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDuplicate(template)}
              title="Duplicar modelo"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(template.id)}
              title="Excluir modelo"
              className="text-destructive hover:text-destructive/90"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: template.config.colors.primary }}
              title="Cor primária"
            />
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: template.config.colors.secondary }}
              title="Cor secundária"
            />
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: template.config.colors.accent }}
              title="Cor de destaque"
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{template.config.companyInfo.heroTitle.substring(0, 30)}...</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Grid3X3 className="h-3 w-3" />
              <span>{template.config.companyInfo.heroFeatures.length} recursos</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onApply(template)}
            disabled={isActive}
          >
            {isActive ? 'Modelo Ativo' : 'Aplicar Modelo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
