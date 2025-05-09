
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { LandingPage, LandingPageDB, LandingPageSection } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from 'lucide-react';

// Import our new components
import PageList from './landing-pages/PageList';
import CreatePageDialog from './landing-pages/CreatePageDialog';
import AiGenerationDialog from './landing-pages/AiGenerationDialog';
import { LandingPageFormData } from '@/types/landingPageTypes';
import { 
  fetchLandingPages, 
  saveLandingPage, 
  deleteLandingPage, 
  duplicateLandingPage,
  togglePagePublishStatus,
  generateSlug
} from '@/services/landingPageService';

const LandingPageManager = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<LandingPage | null>(null);

  const [formData, setFormData] = useState<LandingPageFormData>({
    title: '',
    slug: '',
    templateId: 'basic',
    webhook_url: '',
    published: false,
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Load pages when the component mounts
  useEffect(() => {
    if (company) {
      loadPages();
    }
  }, [company]);

  // Load landing pages
  const loadPages = async () => {
    setLoading(true);
    try {
      if (!company) throw new Error('Company not found');
      
      const loadedPages = await fetchLandingPages(company.id);
      setPages(loadedPages);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as páginas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creating new page
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

  // Open modal for editing existing page
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

  // Update title and automatically generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  // Open AI modal
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

  // Create/edit landing page
  const handleSavePage = async () => {
    try {
      if (!company) throw new Error('Empresa não encontrada');
      
      // Prepare the object with default or existing sections
      const sections: LandingPageSection[] = currentPage?.content?.sections || [
        { type: 'header', content: { title: formData.title, subtitle: 'Subtítulo da página' } },
        { type: 'text', content: { text: 'Conteúdo da página aqui...' } },
        { type: 'cta', content: { buttonText: 'Clique Aqui', buttonLink: '#' } }
      ];
      
      // Convert to the format accepted by the database
      const pageData: LandingPageDB = {
        title: formData.title,
        slug: formData.slug,
        company_id: company.id,
        template_id: formData.templateId,
        webhook_url: formData.webhook_url || null,
        published: formData.published,
        content: JSON.stringify({ sections })
      };

      if (editMode && currentPage) {
        await saveLandingPage(pageData, currentPage.id);
        
        toast({
          title: 'Página atualizada',
          description: 'A landing page foi atualizada com sucesso',
        });
      } else {
        await saveLandingPage(pageData);
        
        toast({
          title: 'Página criada',
          description: 'A nova landing page foi criada com sucesso',
        });
      }

      // Close modal and reload pages
      setCreateDialogOpen(false);
      loadPages();
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar a página',
        variant: 'destructive',
      });
    }
  };

  // Generate content with AI
  const handleGenerateWithAi = async () => {
    setAiLoading(true);
    try {
      // This is a mock of the AI functionality
      // In a real implementation, you would make a call to an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Conteúdo gerado',
        description: 'Conteúdo gerado com IA em breve será implementado',
      });
      
      setAiDialogOpen(false);
      
      // If not in edit mode, open the creation modal with AI data
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
      console.error('Error generating with AI:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o conteúdo com IA',
        variant: 'destructive',
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Delete page
  const handleDelete = async (pageId: string) => {
    if (confirm('Tem certeza que deseja excluir esta página?')) {
      try {
        await deleteLandingPage(pageId);
        
        toast({
          title: 'Página excluída',
          description: 'A landing page foi excluída com sucesso',
        });
        
        loadPages();
      } catch (error) {
        console.error('Error deleting page:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a página',
          variant: 'destructive',
        });
      }
    }
  };

  // Duplicate page
  const handleDuplicate = async (page: LandingPage) => {
    try {
      const newTitle = `${page.title} (cópia)`;
      const newSlug = `${page.slug}-copia`;
      
      await duplicateLandingPage(page, newTitle, newSlug);
      
      toast({
        title: 'Página duplicada',
        description: 'A landing page foi duplicada com sucesso',
      });
      
      loadPages();
    } catch (error) {
      console.error('Error duplicating page:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível duplicar a página',
        variant: 'destructive',
      });
    }
  };

  // Toggle publication status
  const handleTogglePublish = async (page: LandingPage) => {
    try {
      await togglePagePublishStatus(page);
      
      toast({
        title: page.published ? 'Página despublicada' : 'Página publicada',
        description: `A landing page foi ${page.published ? 'despublicada' : 'publicada'} com sucesso`,
      });
      
      loadPages();
    } catch (error) {
      console.error('Error changing publication status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status da página',
        variant: 'destructive',
      });
    }
  };

  // Format date
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
          <PageList
            pages={pages}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onTogglePublish={handleTogglePublish}
            onOpenAiModal={handleOpenAiModal}
            formatDate={formatDate}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total: {pages.length} páginas ({pages.filter(p => p.published).length} publicadas)
          </div>
        </CardFooter>
      </Card>

      {/* Dialogs */}
      <CreatePageDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSavePage}
        editMode={editMode}
        handleTitleChange={handleTitleChange}
      />
      
      <AiGenerationDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onGenerate={handleGenerateWithAi}
        loading={aiLoading}
      />
    </div>
  );
};

export default LandingPageManager;
