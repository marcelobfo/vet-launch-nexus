
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Copy, Trash, Check, FileText, Grid3X3 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  config: {
    companyInfo: {
      heroTitle: string;
      heroSubtitle: string;
      aboutText: string;
      heroFeatures: {
        title: string;
        desc: string;
        color: string;
      }[];
    },
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    }
  };
}

const defaultTemplates: Template[] = [
  {
    id: "template-1",
    name: "Lançamento Veterinário",
    description: "Modelo de lançamento para profissionais da área veterinária",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Expert Veterinário",
        heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para profissionais veterinários.",
        aboutText: "Método 6 em 7, Adaptado para Veterinários",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads qualificados",
            color: "bg-vet-secondary"
          },
          {
            title: "Evento de Lançamento",
            desc: "Aulas ao vivo com alta conversão e engajamento",
            color: "bg-vet-accent"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
            color: "bg-blue-600"
          }
        ]
      },
      colors: {
        primary: "#00A3E0",
        secondary: "#F28B00",
        accent: "#95D600"
      }
    }
  },
  {
    id: "template-2",
    name: "Lançamento Coaching",
    description: "Modelo de lançamento para coaches e mentores",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Expert Coaching",
        heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para coaches.",
        aboutText: "Método 6 em 7, Potencializado para Coaches",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads qualificados",
            color: "bg-blue-600"
          },
          {
            title: "Evento de Lançamento",
            desc: "Aulas ao vivo com alta conversão e engajamento",
            color: "bg-purple-600"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
            color: "bg-green-600"
          }
        ]
      },
      colors: {
        primary: "#4A4DE7",
        secondary: "#FF6B6B",
        accent: "#2DCE89"
      }
    }
  },
  {
    id: "template-3",
    name: "Lançamento Nutrição",
    description: "Modelo de lançamento para nutricionistas",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Expert Nutrição",
        heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para nutricionistas.",
        aboutText: "Método 6 em 7, Adaptado para Nutrição",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads qualificados",
            color: "bg-green-600"
          },
          {
            title: "Evento de Lançamento",
            desc: "Aulas ao vivo com alta conversão e engajamento",
            color: "bg-amber-600"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
            color: "bg-emerald-600"
          }
        ]
      },
      colors: {
        primary: "#4CAF50",
        secondary: "#FF9800",
        accent: "#E91E63"
      }
    }
  }
];

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
      
      <ScrollArea className="h-[500px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`border ${activeTemplate === template.id ? 'border-primary' : 'border-border'}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    {activeTemplate === template.id && (
                      <Check className="h-5 w-5 mr-2 text-primary" />
                    )}
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDuplicateTemplate(template)}
                      title="Duplicar modelo"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteTemplate(template.id)}
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
                    onClick={() => handleApplyTemplate(template)}
                    disabled={activeTemplate === template.id}
                  >
                    {activeTemplate === template.id ? 'Modelo Ativo' : 'Aplicar Modelo'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplateModels;
