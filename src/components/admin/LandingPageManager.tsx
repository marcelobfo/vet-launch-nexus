
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  MoreHorizontal,
  Sparkles,
  Globe,
  Code,
  FileJson,
} from 'lucide-react';

// Tipo para as landing pages
type LandingPage = {
  id: string;
  title: string;
  slug: string;
  content: any;
  template_id?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  webhook_url?: string;
};

// Templates predefinidos
const TEMPLATES = [
  { id: 'basic', name: 'Página Básica', description: 'Template simples com cabeçalho, conteúdo e rodapé' },
  { id: 'lead-capture', name: 'Captura de Leads', description: 'Template com formulário para captura de contatos' },
  { id: 'sales-page', name: 'Página de Vendas', description: 'Template completo para páginas de vendas' },
  { id: 'webinar', name: 'Webinar', description: 'Template para inscrição em webinar/evento' },
  { id: 'thank-you', name: 'Página de Agradecimento', description: 'Template para página de agradecimento pós-conversão' },
];

const LandingPageManager = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<LandingPage | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    templateId: 'basic',
    webhook_url: '',
    published: false,
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Carregar páginas ao iniciar o componente
  useEffect(() => {
    if (company) {
      fetchPages();
    }
  }, [company]);

  // Buscar landing pages da empresa
  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('company_id', company?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as páginas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Abrir modal para criar nova página
  const handleCreateNew = () => {
    setFormData({
      title: '',
      slug: '',
      templateId: 'basic',
      webhook_url: '',
      published: false,
    });
    setEditMode(false);
    setCurrentPage(null);
    setCreateDialogOpen(true);
  };

  // Abrir modal para editar página existente
  const handleEdit = (page: LandingPage) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      templateId: page.template_id || 'basic',
      webhook_url: page.webhook_url || '',
      published: page.published,
    });
    setEditMode(true);
    setCurrentPage(page);
    setCreateDialogOpen(true);
  };

  // Atualizar título e gerar slug automaticamente
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  // Abrir modal de IA
  const handleOpenAiModal = (page?: LandingPage) => {
    if (page) {
      setCurrentPage(page);
      setAiPrompt(`Melhore a página "${page.title}" para aumentar a conversão de leads.`);
    } else {
      setCurrentPage(null);
      setAiPrompt('Crie uma página de captura de leads para um curso online de marketing digital.');
    }
    setAiDialogOpen(true);
  };

  // Criar/editar landing page
  const handleSavePage = async () => {
    try {
      if (!company) throw new Error('Empresa não encontrada');
      
      const pageData = {
        title: formData.title,
        slug: formData.slug,
        company_id: company.id,
        template_id: formData.templateId,
        webhook_url: formData.webhook_url || null,
        published: formData.published,
        content: currentPage?.content || {
          sections: [
            { type: 'header', content: { title: formData.title, subtitle: 'Subtítulo da página' } },
            { type: 'text', content: { text: 'Conteúdo da página aqui...' } },
            { type: 'cta', content: { buttonText: 'Clique Aqui', buttonLink: '#' } }
          ]
        }
      };

      if (editMode && currentPage) {
        // Atualizar página existente
        const { data, error } = await supabase
          .from('landing_pages')
          .update({
            ...pageData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPage.id)
          .select();

        if (error) throw error;
        
        toast({
          title: 'Página atualizada',
          description: 'A landing page foi atualizada com sucesso',
        });
      } else {
        // Criar nova página
        const { data, error } = await supabase
          .from('landing_pages')
          .insert({
            ...pageData
          })
          .select();

        if (error) throw error;
        
        toast({
          title: 'Página criada',
          description: 'A nova landing page foi criada com sucesso',
        });
      }

      // Fechar modal e recarregar páginas
      setCreateDialogOpen(false);
      fetchPages();
    } catch (error: any) {
      console.error('Erro ao salvar página:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar a página',
        variant: 'destructive',
      });
    }
  };

  // Gerar conteúdo com IA
  const handleGenerateWithAi = async () => {
    setAiLoading(true);
    try {
      // Este é um mock da funcionalidade de IA
      // Em uma implementação real, você faria uma chamada para uma API de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Conteúdo gerado',
        description: 'Conteúdo gerado com IA em breve será implementado',
      });
      
      setAiDialogOpen(false);
      
      // Se não estiver em edição, abre o modal de criação com dados da IA
      if (!currentPage) {
        setFormData({
          title: 'Página gerada com IA',
          slug: 'pagina-gerada-ia',
          templateId: 'lead-capture',
          webhook_url: '',
          published: false,
        });
        setCreateDialogOpen(true);
      }
    } catch (error) {
      console.error('Erro ao gerar com IA:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o conteúdo com IA',
        variant: 'destructive',
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Excluir página
  const handleDelete = async (pageId: string) => {
    if (confirm('Tem certeza que deseja excluir esta página?')) {
      try {
        const { error } = await supabase
          .from('landing_pages')
          .delete()
          .eq('id', pageId);
          
        if (error) throw error;
        
        toast({
          title: 'Página excluída',
          description: 'A landing page foi excluída com sucesso',
        });
        
        fetchPages();
      } catch (error) {
        console.error('Erro ao excluir página:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a página',
          variant: 'destructive',
        });
      }
    }
  };

  // Duplicar página
  const handleDuplicate = async (page: LandingPage) => {
    try {
      const newTitle = `${page.title} (cópia)`;
      const newSlug = `${page.slug}-copia`;
      
      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          title: newTitle,
          slug: newSlug,
          company_id: page.company_id,
          template_id: page.template_id,
          content: page.content,
          published: false,
          webhook_url: page.webhook_url,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Página duplicada',
        description: 'A landing page foi duplicada com sucesso',
      });
      
      fetchPages();
    } catch (error) {
      console.error('Erro ao duplicar página:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível duplicar a página',
        variant: 'destructive',
      });
    }
  };

  // Toggle de publicação
  const handleTogglePublish = async (page: LandingPage) => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .update({
          published: !page.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id)
        .select();
        
      if (error) throw error;
      
      toast({
        title: page.published ? 'Página despublicada' : 'Página publicada',
        description: `A landing page foi ${page.published ? 'despublicada' : 'publicada'} com sucesso`,
      });
      
      fetchPages();
    } catch (error) {
      console.error('Erro ao alterar status de publicação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status da página',
        variant: 'destructive',
      });
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Landing Pages</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Crie e gerencie suas páginas de lançamento e captura de leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenAiModal()} className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Criar com IA</span>
          </Button>
          <Button onClick={handleCreateNew} className="bg-vet-primary gap-2">
            <Plus className="h-4 w-4" />
            <span>Nova Página</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Landing Pages</CardTitle>
          <CardDescription>
            Gerencie todas as suas páginas de lançamento e captura de leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-vet-primary"></div>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center p-8 border rounded-lg border-dashed">
              <h3 className="font-medium text-lg mb-2">Sem landing pages</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comece criando sua primeira página de lançamento ou captura de leads
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleCreateNew} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Criar do Zero</span>
                </Button>
                <Button onClick={() => handleOpenAiModal()} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Gerar com IA</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atualizada em</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-sm text-gray-500">{page.slug}</TableCell>
                      <TableCell>
                        {page.published ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-800">
                            Publicada
                          </Badge>
                        ) : (
                          <Badge variant="outline">Rascunho</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(page.updated_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(page)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePublish(page)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {page.published ? 'Despublicar' : 'Publicar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(page)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenAiModal(page)}>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Melhorar com IA
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(page.id)} className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total: {pages.length} páginas ({pages.filter(p => p.published).length} publicadas)
          </div>
        </CardFooter>
      </Card>

      {/* Modal de criação/edição de página */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Editar Landing Page' : 'Criar Nova Landing Page'}</DialogTitle>
            <DialogDescription>
              {editMode
                ? 'Edite as informações da sua landing page'
                : 'Preencha os dados abaixo para criar uma nova landing page'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Página</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Ex: Inscrição para Webinar"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug da URL</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ex: inscricao-webinar"
              />
              <p className="text-xs text-gray-500">
                URL: seudominio.com/p/<span className="font-mono">{formData.slug}</span>
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={formData.templateId}
                onValueChange={(value) => setFormData({ ...formData, templateId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="webhook">Webhook para Captura de Leads (opcional)</Label>
              <Input
                id="webhook"
                value={formData.webhook_url}
                onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                placeholder="https://seu-webhook.com/endpoint"
              />
              <p className="text-xs text-gray-500">
                Se não for informado, o webhook da empresa será usado
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publicar página imediatamente</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePage} className="bg-vet-primary">
              {editMode ? 'Salvar Alterações' : 'Criar Página'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de IA */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar com IA</DialogTitle>
            <DialogDescription>
              Descreva a landing page que você deseja criar e a IA irá gerá-la para você
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ai-prompt">Prompt para a IA</Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Crie uma landing page para captura de leads de um curso de marketing digital"
                rows={6}
              />
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
              <p className="font-medium mb-2">Dicas para melhores resultados:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Seja específico sobre o propósito da página (venda, captura de leads, etc)</li>
                <li>Mencione o tom de comunicação (formal, casual, persuasivo)</li>
                <li>Descreva o público-alvo da página</li>
                <li>Informe detalhes do produto/serviço (benefícios, diferenciais)</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)} disabled={aiLoading}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateWithAi} disabled={aiLoading} className="gap-2">
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Gerar com IA</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPageManager;
