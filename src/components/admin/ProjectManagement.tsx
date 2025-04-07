import React, { useState, useEffect, useCallback } from 'react';
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
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Circle
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

// Mind map node type
type MindMapNode = {
  id: string;
  type: 'root' | 'task' | 'subtask';
  title: string;
  description?: string;
  parentId?: string;
  children: string[];
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  assignees?: TeamMember[];
  tag?: TaskTag;
  position: { x: number; y: number };
  isUrgent?: boolean;
};

const ProjectManagement = () => {
  const { toast } = useToast();
  const [viewType, setViewType] = useState<'mindmap' | 'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const [showTaskDetailDialog, setShowTaskDetailDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanCard | null>(null);
  const [draggingCard, setDraggingCard] = useState<{ cardId: number, columnId: number } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);
  const [editingMindMapNode, setEditingMindMapNode] = useState<MindMapNode | null>(null);
  
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

  // Mind map nodes
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([
    {
      id: 'root',
      type: 'root',
      title: 'Lançamento de Produto',
      description: 'Plano geral para o lançamento do produto',
      children: ['task1', 'task2', 'task3', 'task4'],
      position: { x: 400, y: 200 },
    },
    {
      id: 'task1',
      type: 'task',
      title: 'Estratégia de Marketing',
      description: 'Desenvolver plano de marketing para o lançamento',
      parentId: 'root',
      children: ['subtask1-1', 'subtask1-2'],
      tag: availableTags[3],
      status: 'in-progress',
      position: { x: 200, y: 100 },
      assignees: [teamMembers[1]],
      isUrgent: true,
    },
    {
      id: 'subtask1-1',
      type: 'subtask',
      title: 'Redes Sociais',
      parentId: 'task1',
      children: [],
      status: 'todo',
      position: { x: 50, y: 150 },
      assignees: [teamMembers[1]],
    },
    {
      id: 'subtask1-2',
      type: 'subtask',
      title: 'E-mail Marketing',
      parentId: 'task1',
      children: [],
      status: 'in-progress',
      position: { x: 50, y: 250 },
      assignees: [teamMembers[1], teamMembers[2]],
    },
    {
      id: 'task2',
      type: 'task',
      title: 'Desenvolvimento de Conteúdo',
      description: 'Criar o conteúdo para o lançamento',
      parentId: 'root',
      children: ['subtask2-1'],
      tag: availableTags[2],
      status: 'review',
      position: { x: 600, y: 100 },
      assignees: [teamMembers[2]],
    },
    {
      id: 'subtask2-1',
      type: 'subtask',
      title: 'Vídeos de Produto',
      parentId: 'task2',
      children: [],
      status: 'done',
      position: { x: 750, y: 150 },
      assignees: [teamMembers[0], teamMembers[2]],
    },
    {
      id: 'task3',
      type: 'task',
      title: 'Logística de Lançamento',
      description: 'Coordenar a logística para o dia do lançamento',
      parentId: 'root',
      children: [],
      tag: availableTags[4],
      status: 'todo',
      position: { x: 200, y: 350 },
      assignees: [teamMembers[0], teamMembers[3]],
    },
    {
      id: 'task4',
      type: 'task',
      title: 'Análise de Mercado',
      description: 'Analisar concorrentes e posicionamento',
      parentId: 'root',
      children: [],
      tag: availableTags[5],
      status: 'done',
      position: { x: 600, y: 350 },
      assignees: [teamMembers[3]],
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

  // Drag and drop handlers for kanban cards
  const handleDragStart = (cardId: number, columnId: number) => {
    setDraggingCard({ cardId, columnId });
  };

  const handleDragOver = (e: React.DragEvent, columnId: number) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: number) => {
    e.preventDefault();
    if (draggingCard && draggingCard.columnId !== targetColumnId) {
      handleMoveCard(draggingCard.cardId, draggingCard.columnId, targetColumnId);
    }
    setDraggingCard(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggingCard(null);
    setDragOverColumn(null);
  };

  // Mind map functionality
  const handleNodeDragStart = (e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('nodeId', nodeId);
  };

  const handleNodeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNodeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('nodeId');
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMindMapNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, position: { x, y } }
          : node
      )
    );
    
    toast({
      title: "Node moved",
      description: "Node position updated successfully."
    });
  };

  const handleMindMapNodeClick = (node: MindMapNode) => {
    setEditingMindMapNode(node);
  };

  const updateMindMapNode = (updatedNode: MindMapNode) => {
    setMindMapNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === updatedNode.id 
          ? updatedNode
          : node
      )
    );
    setEditingMindMapNode(null);
    
    toast({
      title: "Node updated",
      description: "Mind map node updated successfully."
    });
  };

  const addMindMapNode = (parentId: string) => {
    const newNodeId = `node-${Date.now()}`;
    const parentNode = mindMapNodes.find(node => node.id === parentId);
    
    if (!parentNode) return;
    
    // Calculate position relative to parent
    const newNodePosition = {
      x: parentNode.position.x + 150,
      y: parentNode.position.y + 50
    };
    
    const newNode: MindMapNode = {
      id: newNodeId,
      type: 'subtask',
      title: 'Nova Tarefa',
      parentId: parentId,
      children: [],
      status: 'todo',
      position: newNodePosition
    };
    
    // Update parent node to include new child
    const updatedParent = {
      ...parentNode,
      children: [...parentNode.children, newNodeId]
    };
    
    setMindMapNodes(prevNodes => [
      ...prevNodes.map(node => node.id === parentId ? updatedParent : node),
      newNode
    ]);
    
    setEditingMindMapNode(newNode);
    
    toast({
      title: "Node added",
      description: "New mind map node added successfully."
    });
  };

  const deleteMindMapNode = (nodeId: string) => {
    // Find the node and its parent
    const nodeToDelete = mindMapNodes.find(node => node.id === nodeId);
    if (!nodeToDelete || nodeToDelete.type === 'root') return; // Cannot delete root
    
    const parentNode = nodeToDelete.parentId 
      ? mindMapNodes.find(node => node.id === nodeToDelete.parentId)
      : null;
    
    // Update parent's children list
    let updatedNodes = mindMapNodes;
    if (parentNode) {
      const updatedParent = {
        ...parentNode,
        children: parentNode.children.filter(id => id !== nodeId)
      };
      updatedNodes = updatedNodes.map(node => 
        node.id === parentNode.id ? updatedParent : node
      );
    }
    
    // Remove the node and its children recursively
    const nodesToRemove = new Set<string>();
    
    const collectNodesToRemove = (id: string) => {
      nodesToRemove.add(id);
      const node = mindMapNodes.find(n => n.id === id);
      if (node && node.children.length > 0) {
        node.children.forEach(childId => collectNodesToRemove(childId));
      }
    };
    
    collectNodesToRemove(nodeId);
    
    setMindMapNodes(updatedNodes.filter(node => !nodesToRemove.has(node.id)));
    setEditingMindMapNode(null);
    
    toast({
      title: "Node deleted",
      description: "Mind map node and its children removed successfully."
    });
  };

  // Utility function to get status color
  const getStatusColor = (status?: 'todo' | 'in-progress' | 'review' | 'done') => {
    switch (status) {
      case 'todo': return 'border-slate-400';
      case 'in-progress': return 'border-blue-500';
      case 'review': return 'border-yellow-500';
      case 'done': return 'border-green-500';
      default: return 'border-gray-400';
    }
  };

  // Render lines between connected nodes
  const renderMindMapConnections = useCallback(() => {
    return mindMapNodes.map(node => {
      if (node.children.length === 0) return null;
      
      return node.children.map(childId => {
        const childNode = mindMapNodes.find(n => n.id === childId);
        if (!childNode) return null;
        
        const startX = node.position.x + 75; // Approximate center of parent node
        const startY = node.position.y + 35;
        const endX = childNode.position.x + 75;
        const endY = childNode.position.y + 35;
        
        // Calculate path
        const path = `M${startX},${startY} C${(startX + endX) / 2},${startY} ${(startX + endX) / 2},${endY} ${endX},${endY}`;
        
        return (
          <svg key={`${node.id}-${childId}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path 
              d={path} 
              stroke="#666" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray={childNode.type === 'subtask' ? "5,5" : "none"}
            />
          </svg>
        );
      });
    });
  }, [mindMapNodes]);

  // Render different views based on selected type
  const renderContent = () => {
    switch (viewType) {
      case 'mindmap':
        return (
          <div className="p-4 relative">
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar no mapa mental..."
                  className="pl-8"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Novo Projeto</span>
                </Button>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filtrar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="urgent">Urgentes</SelectItem>
                    <SelectItem value="mine">Meus projetos</SelectItem>
                    <SelectItem value="upcoming">Próximos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div 
              className="min-h-[600px] bg-vet-dark/30 border border-gray-800 rounded-lg relative"
              onDragOver={handleNodeDragOver}
              onDrop={handleNodeDrop}
            >
              {/* Render connections between nodes */}
              {renderMindMapConnections()}
              
              {/* Render nodes */}
              {mindMapNodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute p-3 rounded-lg shadow-md ${
                    node.type === 'root' 
                      ? 'bg-vet-primary/20 border-2 border-vet-primary/50 w-[250px]' 
                      : node.type === 'task'
                        ? `bg-card border-l-4 ${getStatusColor(node.status)} w-[200px]`
                        : `bg-gray-800/70 border border-gray-700 w-[150px]`
                  } cursor-move`}
                  style={{
                    left: `${node.position.x}px`,
                    top: `${node.position.y}px`,
                    zIndex: node.type === 'root' ? 10 : 5
                  }}
                  draggable
                  onDragStart={(e) => handleNodeDragStart(e, node.id)}
                  onClick={() => handleMindMapNodeClick(node)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className={`text-${node.type === 'root' ? 'base font-bold' : 'sm font-medium'}`}>
                      {node.title}
                    </div>
                    
                    {node.isUrgent && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-900/30 text-red-400">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgente
                      </span>
                    )}
                  </div>
                  
                  {node.description && (
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{node.description}</p>
                  )}
                  
                  <div className="flex justify-between">
                    {node.tag && (
                      <span className={`text-xs ${node.tag.color} bg-opacity-20 text-opacity-90 px-2 py-0.5 rounded-full`}>
                        {node.tag.name}
                      </span>
                    )}
                    
                    {node.status && node.type !== 'root' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        node.status === 'todo' ? 'bg-slate-500/20 text-slate-300' :
                        node.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                        node.status === 'review' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {node.status === 'todo' ? 'A Fazer' :
                        node.status === 'in-progress' ? 'Em Progresso' :
                        node.status === 'review' ? 'Revisão' :
                        'Concluído'}
                      </span>
                    )}
                  </div>
                  
                  {node.assignees && node.assignees.length > 0 && (
                    <div className="flex -space-x-2 mt-2">
                      {node.assignees.slice(0, 3).map((assignee) => (
                        <Avatar key={assignee.id} className="h-6 w-6 border border-gray-800">
                          {assignee.avatar ? (
                            <AvatarImage src={assignee.avatar} alt={assignee.name} />
                          ) : (
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                      ))}
                      {node.assignees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border border-gray-800">
                          +{node.assignees.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {node.type === 'root' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="mt-2 w-full text-xs text-gray-400 hover:text-white hover:bg-gray-800/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        addMindMapNode(node.id);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar Tarefa
                    </Button>
                  )}
                  
                  {node.type === 'task' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="mt-2 w-full text-xs text-gray-400 hover:text-white hover:bg-gray-800/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        addMindMapNode(node.id);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar Subtarefa
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Dialog for editing mind map node */}
            <Dialog open={!!editingMindMapNode} on
