
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import TemplateHeader from './TemplateHeader';
import TemplateList from './TemplateList';
import { Template, defaultTemplates } from '@/data/defaultTemplates';

const TemplateModels: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  
  useEffect(() => {
    // Load templates from localStorage
    const storedTemplates = localStorage.getItem('pageTemplates');
    if (storedTemplates) {
      try {
        setTemplates(JSON.parse(storedTemplates));
      } catch (error) {
        console.error("Error parsing stored templates:", error);
        // If there's an error, initialize with default templates
        setTemplates(defaultTemplates);
        localStorage.setItem('pageTemplates', JSON.stringify(defaultTemplates));
      }
    } else {
      // Initialize with default templates
      setTemplates(defaultTemplates);
      localStorage.setItem('pageTemplates', JSON.stringify(defaultTemplates));
    }
    
    // Check for active template
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { activeTemplateId } = JSON.parse(storedConfig);
        setActiveTemplate(activeTemplateId || null);
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
  }, []);
  
  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('pageTemplates', JSON.stringify(newTemplates));
  };
  
  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Insira um nome para o template",
        variant: "destructive"
      });
      return;
    }
    
    // Get current site config to use as a base
    const storedConfig = localStorage.getItem('siteConfig');
    let currentConfig = {
      companyInfo: {
        heroTitle: "Novo Template",
        heroSubtitle: "Descrição do novo template",
        aboutText: "Método 6 em 7",
        heroFeatures: [
          {
            title: "Recurso 1",
            desc: "Descrição do recurso 1",
            color: "bg-primary"
          },
          {
            title: "Recurso 2",
            desc: "Descrição do recurso 2",
            color: "bg-accent"
          },
          {
            title: "Recurso 3",
            desc: "Descrição do recurso 3",
            color: "bg-blue-600"
          }
        ]
      },
      colors: {
        primary: "#4361ee",
        secondary: "#3f37c9",
        accent: "#4cc9f0"
      }
    };
    
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        if (parsedConfig.companyInfo) {
          currentConfig = {
            companyInfo: {
              ...parsedConfig.companyInfo,
              heroFeatures: parsedConfig.companyInfo.heroFeatures || currentConfig.companyInfo.heroFeatures
            },
            colors: parsedConfig.colors || currentConfig.colors
          };
        }
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
    
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: "Modelo personalizado criado pelo usuário",
      config: currentConfig
    };
    
    saveTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    
    toast({
      title: "Template criado",
      description: `O template "${newTemplateName}" foi criado com sucesso`,
    });
  };
  
  const handleApplyTemplate = (template: Template) => {
    // Update site config with template settings
    const storedConfig = localStorage.getItem('siteConfig') || '{}';
    let config;
    
    try {
      config = JSON.parse(storedConfig);
    } catch (error) {
      config = {};
    }
    
    // Update config with template values
    const updatedConfig = {
      ...config,
      companyInfo: {
        ...config.companyInfo,
        ...template.config.companyInfo
      },
      colors: template.config.colors,
      activeTemplateId: template.id
    };
    
    localStorage.setItem('siteConfig', JSON.stringify(updatedConfig));
    setActiveTemplate(template.id);
    
    toast({
      title: "Template aplicado",
      description: `O template "${template.name}" foi aplicado com sucesso`,
    });
    
    // Refresh the page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Cópia)`,
    };
    
    saveTemplates([...templates, duplicatedTemplate]);
    
    toast({
      title: "Template duplicado",
      description: `Uma cópia do template "${template.name}" foi criada`,
    });
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(updatedTemplates);
    
    // If we're deleting the active template, unset it
    if (activeTemplate === templateId) {
      const storedConfig = localStorage.getItem('siteConfig') || '{}';
      let config;
      
      try {
        config = JSON.parse(storedConfig);
        delete config.activeTemplateId;
        localStorage.setItem('siteConfig', JSON.stringify(config));
        setActiveTemplate(null);
      } catch (error) {
        console.error("Error updating config:", error);
      }
    }
    
    toast({
      title: "Template excluído",
      description: "O template foi excluído com sucesso",
    });
  };
  
  return (
    <div className="space-y-6">
      <TemplateHeader 
        newTemplateName={newTemplateName}
        setNewTemplateName={setNewTemplateName}
        handleCreateTemplate={handleCreateTemplate}
      />
      
      <TemplateList 
        templates={templates}
        activeTemplate={activeTemplate}
        onApply={handleApplyTemplate}
        onDuplicate={handleDuplicateTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};

export default TemplateModels;
