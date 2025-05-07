
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface TemplateHeaderProps {
  newTemplateName: string;
  setNewTemplateName: (name: string) => void;
  handleCreateTemplate: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  newTemplateName,
  setNewTemplateName,
  handleCreateTemplate
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Modelos de Página</h2>
        <p className="text-sm text-muted-foreground">
          Crie, aplique e gerencie diferentes modelos para sua página inicial
        </p>
      </div>
      
      <div className="flex gap-2 items-center">
        <Input
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          placeholder="Nome do novo modelo"
          className="w-60"
        />
        <Button 
          onClick={handleCreateTemplate}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar Modelo
        </Button>
      </div>
    </div>
  );
};

export default TemplateHeader;
