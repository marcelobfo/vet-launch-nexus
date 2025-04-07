
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

import { 
  BrainCircuit, 
  CheckSquare, 
  Grid2X2, 
  ListTodo,
  Plus, 
  MoreVertical,
  CalendarDays,
  Clock,
  Users,
  Tag,
  User,
  Edit,
  Trash2,
  Bell,
  Search,
  X,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types for team members, tasks, and kanban cards
type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

type TaskTag = {
  id: number;
  name: string;
  color: string;
};

type KanbanCard = {
  id: number;
  title: string;
  description?: string;
  tag: TaskTag;
  dueDate?: string;
  assignees: TeamMember[];
  isUrgent: boolean;
};

type KanbanColumn = {
  id: number;
  title: string;
  color: string;
  cards: KanbanCard[];
};

const ProjectManagement = () => {
  const { toast } = useToast();
  const [viewType, setViewType] = useState<'mindmap' | 'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const [showTaskDetailDialog, setShowTaskDetailDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanCard | null>(null);
  
  // Form state for new task
  const [newTask, setNewTask] = useState<Partial<KanbanCard>>({
    title: '',
    description: '',
    assignees: [],
    isUrgent: false,
  });

  // Mock team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Carlos Silva', email: 'carlos@exemplo.com.br', role: 'Veterinário', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Ana Oliveira', email: 'ana@exemplo.com.br', role: 'Marketing', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Pedro Santos', email: 'pedro@exemplo.com.br', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Mariana Costa', email: 'mariana@exemplo.com.br', role: 'Analista', avatar: 'https://i.pravatar.cc/150?img=9' },
  ]);

  // Mock tags
  const [availableTags, setAvailableTags] = useState<TaskTag[]>([
    { id: 1, name: 'Técnico', color: 'bg-blue-500' },
    { id: 2, name: 'Design', color: 'bg-purple-500' },
    { id: 3, name: 'Conteúdo', color: 'bg-green-500' },
    { id: 4, name: 'Marketing', color: 'bg-orange-500' },
    { id: 5, name: 'Planejamento', color: 'bg-yellow-500' },
    { id: 6, name: 'Análise', color: 'bg-red-500' },
  ]);
  
  // Mock kanban columns with color coding
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([
    {
      id: 1,
      title: "A Fazer",
      color: "border-l-4 border-l-slate-400",
      cards: [
        { 
          id: 1, 
          title: "Configurar Facebook Pixel", 
          description: "Instalar e configurar o pixel para rastreamento de conversões",
          tag: availableTags[0], 
          dueDate: "2025-05-10",
          assignees: [teamMembers[0]],
          isUrgent: false,
        },
        { 
          id: 2, 
          title: "Criar Página de Vendas", 
          description: "Desenvolver landing page com elementos de conversão",
          tag: availableTags[1], 
          dueDate: "2025-05-12",
          assignees: [teamMembers[2]],
          isUrgent: true,
        },
      ]
    },
    {
      id: 2,
      title: "Em Progresso",
      color: "border-l-4 border-l-blue-500",
      cards: [
        { 
          id: 3, 
          title: "Gravar Vídeos de Lançamento", 
          description: "Produzir conteúdo audiovisual para a campanha",
          tag: availableTags[2], 
          dueDate: "2025-05-08",
          assignees: [teamMembers[0], teamMembers[1]],
          isUrgent: false,
        },
        { 
          id: 4, 
          title: "Preparar E-mail Marketing", 
          description: "Criar sequência de e-mails para nutrição de leads",
          tag: availableTags[3], 
          dueDate: "2025-05-09",
          assignees: [teamMembers[1]],
          isUrgent: false,
        },
      ]
    },
    {
      id: 3,
      title: "Revisão",
      color: "border-l-4 border-l-yellow-500",
      cards: [
        { 
          id: 5, 
          title: "Revisar Textos de Vendas", 
          description: "Verificar copy e chamadas para ação",
          tag: availableTags[2], 
          dueDate: "2025-05-07",
          assignees: [teamMembers[3]],
          isUrgent: true,
        },
      ]
    },
    {
      id: 4,
      title: "Concluído",
      color: "border-l-4 border-l-green-500",
      cards: [
        { 
          id: 6, 
          title: "Definir Datas de Lançamento", 
          description: "Estabelecer cronograma de lançamento",
          tag: availableTags[4], 
          dueDate: "2025-05-01",
          assignees: [teamMembers[0], teamMembers[3]],
          isUrgent: false,
        },
        { 
          id: 7, 
          title: "Pesquisa de Mercado", 
          description: "Analisar concorrentes e posicionamento",
          tag: availableTags[5], 
          dueDate: "2025-04-30",
          assignees: [teamMembers[1]],
          isUrgent: false,
        },
      ]
    }
  ]);

  // Mock project cards for list view
  const projectCards = [
    {
      id: 1,
      title: "Planejamento de Lançamento",
      status: "Em Andamento",
      progress: 65,
      tasks: 12,
      completed: 8,
      dueDate: "2025-05-15",
      assignees: [teamMembers[0], teamMembers[1]],
      tag: availableTags[4],
      isUrgent: false,
    },
    {
      id: 2,
      title: "Criação de Conteúdo",
      status: "Em Andamento",
      progress: 30,
      tasks: 8,
      completed: 2,
      dueDate: "2025-05-10",
      assignees: [teamMembers[0], teamMembers[2]],
      tag: availableTags[2],
      isUrgent: true,
    },
    {
      id: 3,
      title: "Configuração de Anúncios",
      status: "Não Iniciado",
      progress: 0,
      tasks: 6,
      completed: 0,
      dueDate: "2025-05-20",
      assignees: [teamMembers[1]],
      tag: availableTags[3],
      isUrgent: false,
    },
    {
      id: 4,
      title: "Prospecção de Leads",
      status: "Concluído",
      progress: 100,
      tasks: 5,
      completed: 5,
      dueDate: "2025-05-05",
      assignees: [teamMembers[3]],
      tag: availableTags[5],
      isUrgent: false,
    },
  ];

  // Handle adding new task
  const handleAddTask = () => {
    if (!selectedColumn || !newTask.title || !newTask.tag) {
      toast({
        title: "Informações incompletas",
        description: "Preencha título, tag e descrição para adicionar a tarefa.",
        variant: "destructive"
      });
      return;
    }

    const newCard: KanbanCard = {
      id: Math.floor(Math.random() * 1000), // Generate random ID (would be from backend in real app)
      title: newTask.title || "",
      description: newTask.description,
      tag: newTask.tag as TaskTag,
      dueDate: newTask.dueDate,
      assignees: newTask.assignees as TeamMember[] || [],
      isUrgent: newTask.isUrgent || false
    };

    // Add to selected column
    setKanbanColumns(prev => prev.map(col => {
      if (col.id === selectedColumn) {
        return {
          ...col,
          cards: [...col.cards, newCard]
        };
      }
      return col;
    }));

    // Reset form and close dialog
    setNewTask({
      title: '',
      description: '',
      assignees: [],
      isUrgent: false,
    });
    setShowNewCardDialog(false);
    
    toast({
      title: "Tarefa adicionada",
      description: `"${newCard.title}" foi adicionada à coluna "${kanbanColumns.find(col => col.id === selectedColumn)?.title}".`
    });
  };

  // Handle moving a card
  const handleMoveCard = (cardId: number, sourceColumnId: number, targetColumnId: number) => {
    // Find the source column and card
    const sourceColumn = kanbanColumns.find(col => col.id === sourceColumnId);
    if (!sourceColumn) return;
    
    const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;
    
    const card = sourceColumn.cards[cardIndex];
    
    // Update columns: remove from source, add to target
    setKanbanColumns(prev => prev.map(col => {
      if (col.id === sourceColumnId) {
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== cardId)
        };
      }
      if (col.id === targetColumnId) {
        return {
          ...col,
          cards: [...col.cards, card]
        };
      }
      return col;
    }));
    
    toast({
      title: "Tarefa movida",
      description: `"${card.title}" foi movida para "${kanbanColumns.find(col => col.id === targetColumnId)?.title}".`
    });
  };

  // Handle team member management
  const handleAddTeamMember = (member: TeamMember) => {
    if (!newTask.assignees) {
      setNewTask({...newTask, assignees: [member]});
    } else if (!newTask.assignees.some(m => m.id === member.id)) {
      setNewTask({...newTask, assignees: [...newTask.assignees, member]});
    }
  };
  
  const handleRemoveTeamMember = (memberId: number) => {
    if (newTask.assignees) {
      setNewTask({
        ...newTask, 
        assignees: newTask.assignees.filter(m => m.id !== memberId)
      });
    }
  };

  // Handle viewing task details
  const handleViewTaskDetails = (card: KanbanCard) => {
    setSelectedTask(card);
    setShowTaskDetailDialog(true);
  };

  // Handle opening new card dialog
  const handleOpenNewCardDialog = (columnId: number) => {
    setSelectedColumn(columnId);
    setShowNewCardDialog(true);
  };

  // Handle deleting a task
  const handleDeleteTask = (cardId: number, columnId: number) => {
    setKanbanColumns(prev => prev.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        };
      }
      return col;
    }));
    
    setShowTaskDetailDialog(false);
    
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso."
    });
  };

  // Filter cards based on search query
  const getFilteredKanbanColumns = () => {
    if (!searchQuery.trim()) return kanbanColumns;
    
    return kanbanColumns.map(column => ({
      ...column,
      cards: column.cards.filter(card => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        card.tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.assignees.some(assignee => assignee.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }));
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
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar tarefas..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1.5 h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notificações</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-2 font-medium border-b border-gray-800">
                      Notificações
                    </div>
                    <div className="divide-y divide-gray-800 max-h-80 overflow-auto">
                      <div className="p-3 flex gap-3 items-start hover:bg-gray-800/30">
                        <div className="rounded-full bg-yellow-500/20 p-1.5">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nova tarefa urgente</p>
                          <p className="text-xs text-gray-400">Pedro adicionou uma tarefa urgente à coluna Revisão</p>
                          <p className="text-xs text-gray-500 mt-1">2 horas atrás</p>
                        </div>
                      </div>
                      <div className="p-3 flex gap-3 items-start hover:bg-gray-800/30">
                        <div className="rounded-full bg-green-500/20 p-1.5">
                          <ArrowRight className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Tarefa movida para Concluído</p>
                          <p className="text-xs text-gray-400">Ana moveu "Definir Datas de Lançamento" para Concluído</p>
                          <p className="text-xs text-gray-500 mt-1">1 dia atrás</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border-t border-gray-800 text-center">
                      <Button variant="ghost" size="sm" className="text-xs w-full text-gray-400 hover:text-white">
                        Ver todas as notificações
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filtrar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgentes</SelectItem>
                    <SelectItem value="mine">Minhas tarefas</SelectItem>
                    <SelectItem value="upcoming">Próximas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {getFilteredKanbanColumns().map((column) => (
                <div key={column.id} className={`bg-card rounded-lg border border-gray-800 p-3 ${column.color}`}>
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
                        className={`bg-vet-dark p-3 rounded-md border ${card.isUrgent ? 'border-red-500' : 'border-gray-800'} cursor-pointer hover:border-gray-700 transition-colors`}
                        onClick={() => handleViewTaskDetails(card)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm font-medium">{card.title}</div>
                          {card.isUrgent && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-900/30 text-red-400">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgente
                            </span>
                          )}
                        </div>
                        
                        {card.description && (
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{card.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${card.tag.color} bg-opacity-20 text-opacity-90 px-2 py-0.5 rounded-full`}>
                            {card.tag.name}
                          </span>
                          
                          <div className="flex items-center">
                            {card.dueDate && (
                              <span className="text-xs text-gray-400 mr-2 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                            
                            {card.assignees.length > 0 && (
                              <div className="flex -space-x-2">
                                {card.assignees.slice(0, 2).map((assignee) => (
                                  <Avatar key={assignee.id} className="h-6 w-6 border border-gray-800">
                                    {assignee.avatar ? (
                                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                    ) : (
                                      <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                    )}
                                  </Avatar>
                                ))}
                                {card.assignees.length > 2 && (
                                  <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border border-gray-800">
                                    +{card.assignees.length - 2}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-gray-400"
                      onClick={() => handleOpenNewCardDialog(column.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar cartão
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dialog for task details */}
            <Dialog open={showTaskDetailDialog} onOpenChange={setShowTaskDetailDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl">{selectedTask?.title}</DialogTitle>
                    {selectedTask?.isUrgent && (
                      <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgente
                      </Badge>
                    )}
                  </div>
                </DialogHeader>
                
                <div className="space-y-4">
                  {selectedTask?.description && (
                    <div>
                      <Label className="text-gray-400 text-sm">Descrição</Label>
                      <p className="mt-1 text-sm">{selectedTask.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Categoria</Label>
                      <div className="mt-1">
                        <Badge className={`${selectedTask?.tag.color} bg-opacity-20`}>
                          {selectedTask?.tag.name}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedTask?.dueDate && (
                      <div>
                        <Label className="text-gray-400 text-sm">Data de entrega</Label>
                        <div className="mt-1 flex items-center text-sm">
                          <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(selectedTask.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-sm">Responsáveis</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedTask?.assignees.map(assignee => (
                        <div 
                          key={assignee.id} 
                          className="flex items-center gap-2 bg-gray-800/50 text-sm rounded-md px-2 py-1"
                        >
                          <Avatar className="h-6 w-6">
                            {assignee.avatar ? (
                              <AvatarImage src={assignee.avatar} alt={assignee.name} />
                            ) : (
                              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{assignee.name}</span>
                        </div>
                      ))}
                      {(!selectedTask?.assignees || selectedTask.assignees.length === 0) && (
                        <span className="text-sm text-gray-400">Nenhum responsável designado</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <Label className="text-gray-400 text-sm">Mover para</Label>
                    <Select 
                      defaultValue={kanbanColumns.find(col => 
                        col.cards.some(card => card.id === selectedTask?.id)
                      )?.id.toString()}
                      onValueChange={(value) => {
                        if (selectedTask) {
                          const sourceColumnId = kanbanColumns.find(col => 
                            col.cards.some(card => card.id === selectedTask.id)
                          )?.id;
                          
                          if (sourceColumnId && sourceColumnId !== parseInt(value)) {
                            handleMoveCard(selectedTask.id, sourceColumnId, parseInt(value));
                            setShowTaskDetailDialog(false);
                          }
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        {kanbanColumns.map((column) => (
                          <SelectItem key={column.id} value={column.id.toString()}>
                            {column.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between items-center">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (selectedTask) {
                        const columnId = kanbanColumns.find(col => 
                          col.cards.some(card => card.id === selectedTask.id)
                        )?.id;
                        
                        if (columnId) {
                          handleDeleteTask(selectedTask.id, columnId);
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                  
                  <Button onClick={() => setShowTaskDetailDialog(false)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Dialog for new card */}
            <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova tarefa à coluna "{kanbanColumns.find(col => col.id === selectedColumn)?.title}".
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      value={newTask.title || ''}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Título da tarefa"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      value={newTask.description || ''}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Descreva a tarefa"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tag">Categoria</Label>
                      <Select 
                        onValueChange={(value) => {
                          const tag = availableTags.find(t => t.id === parseInt(value));
                          if (tag) setNewTask({...newTask, tag});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ${tag.color} mr-2`}></div>
                                {tag.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Data de Entrega</Label>
                      <Input 
                        id="dueDate" 
                        type="date"
                        value={newTask.dueDate || ''}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Responsáveis</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-0">
                          <div className="p-2 font-medium border-b border-gray-800">
                            Membros da Equipe
                          </div>
                          <div className="max-h-60 overflow-auto">
                            {teamMembers.map(member => (
                              <div 
                                key={member.id}
                                className="p-2 flex items-center gap-2 hover:bg-gray-800/50 cursor-pointer"
                                onClick={() => {
                                  handleAddTeamMember(member);
                                }}
                              >
                                <Avatar className="h-8 w-8">
                                  {member.avatar ? (
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                  ) : (
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{member.name}</p>
                                  <p className="text-xs text-gray-400">{member.role}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-10 p-2 border border-gray-800 rounded-md">
                      {newTask.assignees && newTask.assignees.length > 0 ? (
                        newTask.assignees.map(assignee => (
                          <div 
                            key={assignee.id} 
                            className="flex items-center gap-1 bg-gray-800 text-sm rounded-md px-2 py-1"
                          >
                            <Avatar className="h-5 w-5">
                              {assignee.avatar ? (
                                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                              ) : (
                                <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                              )}
                            </Avatar>
                            <span>{assignee.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 text-gray-400 hover:text-white p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTeamMember(assignee.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Clique em "Adicionar" para selecionar responsáveis</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="urgente" 
                      checked={newTask.isUrgent}
                      onCheckedChange={(checked) => setNewTask({...newTask, isUrgent: checked as boolean})}
                    />
                    <label
                      htmlFor="urgente"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Marcar como urgente
                    </label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewCardDialog(false)}>Cancelar</Button>
                  <Button onClick={handleAddTask}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );

      case 'list':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar projetos..."
                  className="pl-8"
                />
              </div>
              
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Novo Projeto</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectCards.map(card => (
                <Card key={card.id} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <CardDescription>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${card.tag.color} bg-opacity-20 mt-1`}>
                            {card.tag.name}
                          </span>
                          <span className="ml-2 text-gray-400">
                            {card.status}
                          </span>
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Marcar como concluído
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <span>{new Date(card.dueDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ListTodo className="h-4 w-4 text-gray-400" />
                          <span>{card.completed}/{card.tasks} tarefas</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className={`${card.progress === 100 ? 'bg-green-500' : 'bg-vet-primary'} h-2 rounded-full`}
                          style={{ width: `${card.progress}%` }}
                        ></div>
                      </div>
                      
                      {card.isUrgent && (
                        <div className="flex items-center gap-1 text-red-400 text-xs">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Prioridade alta</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-gray-800">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex -space-x-2">
                        {card.assignees.slice(0, 3).map((assignee) => (
                          <Avatar key={assignee.id} className="h-6 w-6 border border-gray-800">
                            {assignee.avatar ? (
                              <AvatarImage src={assignee.avatar} alt={assignee.name} />
                            ) : (
                              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
                        ))}
                        {card.assignees.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border border-gray-800">
                            +{card.assignees.length - 3}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Grid2X2 className="h-3.5 w-3.5" />
                        <span className="text-xs">Ver Kanban</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 flex items-center justify-center">
            <p>Selecione uma visualização</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Projetos</h2>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue={viewType} onValueChange={(v) => setViewType(v as 'mindmap' | 'kanban' | 'list')}>
            <TabsList className="grid grid-cols-3 w-[300px]">
              <TabsTrigger value="mindmap" className="flex items-center gap-1">
                <BrainCircuit className="h-4 w-4" />
                <span>Mapa Mental</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-1">
                <Grid2X2 className="h-4 w-4" />
                <span>Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" />
                <span>Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default ProjectManagement;
