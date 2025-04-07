
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BrainCircuit, 
  CheckSquare, 
  Grid2X2, 
  ListTodo,
  Plus, 
  MoreVertical,
  CalendarDays
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectManagement = () => {
  const { toast } = useToast();
  const [viewType, setViewType] = useState<'mindmap' | 'kanban' | 'list'>('mindmap');
  
  // Mock data for project cards
  const projectCards = [
    {
      id: 1,
      title: "Planejamento de Lançamento",
      status: "Em Andamento",
      progress: 65,
      tasks: 12,
      completed: 8,
      dueDate: "2025-05-15",
    },
    {
      id: 2,
      title: "Criação de Conteúdo",
      status: "Em Andamento",
      progress: 30,
      tasks: 8,
      completed: 2,
      dueDate: "2025-05-10",
    },
    {
      id: 3,
      title: "Configuração de Anúncios",
      status: "Não Iniciado",
      progress: 0,
      tasks: 6,
      completed: 0,
      dueDate: "2025-05-20",
    },
    {
      id: 4,
      title: "Prospecção de Leads",
      status: "Concluído",
      progress: 100,
      tasks: 5,
      completed: 5,
      dueDate: "2025-05-05",
    },
  ];

  // Mock kanban columns
  const kanbanColumns = [
    {
      title: "A Fazer",
      cards: [
        { id: 1, title: "Configurar Facebook Pixel", tag: "Técnico" },
        { id: 2, title: "Criar Página de Vendas", tag: "Design" },
      ]
    },
    {
      title: "Em Progresso",
      cards: [
        { id: 3, title: "Gravar Vídeos de Lançamento", tag: "Conteúdo" },
        { id: 4, title: "Preparar E-mail Marketing", tag: "Marketing" },
      ]
    },
    {
      title: "Revisão",
      cards: [
        { id: 5, title: "Revisar Textos de Vendas", tag: "Conteúdo" },
      ]
    },
    {
      title: "Concluído",
      cards: [
        { id: 6, title: "Definir Datas de Lançamento", tag: "Planejamento" },
        { id: 7, title: "Pesquisa de Mercado", tag: "Análise" },
      ]
    }
  ];

  const handleAddProject = () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "A funcionalidade de adicionar projetos será implementada em breve.",
    });
  };

  // Render different views based on selected type
  const renderContent = () => {
    switch (viewType) {
      case 'mindmap':
        return (
          <div className="p-4 min-h-[400px] flex items-center justify-center bg-vet-dark/50 rounded-lg border border-gray-800">
            <div className="text-center space-y-3">
              <BrainCircuit className="h-16 w-16 mx-auto text-vet-primary/60" />
              <p className="text-gray-400">Visualização de Mapa Mental requer integração com backend.</p>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-vet-primary/20 hover:bg-vet-primary/30"
              >
                Ver Exemplo de Mapa Mental
              </Button>
            </div>
          </div>
        );
      case 'kanban':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kanbanColumns.map((column, index) => (
              <div key={index} className="bg-card rounded-lg border border-gray-800 p-3">
                <h3 className="font-medium mb-3 flex items-center justify-between">
                  <span>{column.title}</span>
                  <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded">
                    {column.cards.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {column.cards.map(card => (
                    <div 
                      key={card.id} 
                      className="bg-vet-dark p-3 rounded-md border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors"
                    >
                      <div className="text-sm font-medium mb-2">{card.title}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-vet-primary/20 text-vet-primary/90 px-2 py-0.5 rounded-full">
                          {card.tag}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-400">
                    <Plus className="h-4 w-4 mr-1" /> Adicionar cartão
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-2">
            {projectCards.map((project) => (
              <div 
                key={project.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${
                    project.status === "Concluído" ? "bg-green-500" : 
                    project.status === "Em Andamento" ? "bg-blue-500" : 
                    "bg-gray-500"
                  }`} />
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-gray-400">
                      {project.completed}/{project.tasks} tarefas • {project.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400 flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Arquivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                <span>Gerenciamento de Projetos</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie os projetos de lançamento em diferentes visualizações
              </CardDescription>
            </div>
            <Button onClick={handleAddProject} className="bg-vet-primary hover:bg-vet-primary/90">
              <Plus className="h-4 w-4 mr-1" /> Novo Projeto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="mindmap" onValueChange={(v) => setViewType(v as any)}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="mindmap" className="flex items-center gap-1">
                <BrainCircuit className="h-4 w-4" /> Mapa Mental
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-1">
                <Grid2X2 className="h-4 w-4" /> Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" /> Lista
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="mindmap" className="mt-4">
              {renderContent()}
            </TabsContent>
            
            <TabsContent value="kanban" className="mt-4">
              {renderContent()}
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              {renderContent()}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4">
          <div className="text-xs text-gray-400">
            <p>
              Para implementar a funcionalidade completa de gerenciamento de projetos, 
              é necessário configurar um backend para armazenar e sincronizar os dados.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectManagement;
