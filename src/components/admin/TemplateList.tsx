
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import TemplateCard from './TemplateCard';
import { Template } from '@/data/defaultTemplates';

interface TemplateListProps {
  templates: Template[];
  activeTemplate: string | null;
  onApply: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  activeTemplate,
  onApply,
  onDuplicate,
  onDelete
}) => {
  return (
    <ScrollArea className="h-[500px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templates.map((template) => (
          <TemplateCard 
            key={template.id}
            template={template}
            isActive={activeTemplate === template.id}
            onApply={onApply}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TemplateList;
