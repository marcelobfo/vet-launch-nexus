
import { LandingPage, LandingPageSection, LandingPageDB } from '@/types';

// Templates predefinidos
export const TEMPLATES = [
  { id: 'basic', name: 'Página Básica', description: 'Template simples com cabeçalho, conteúdo e rodapé' },
  { id: 'lead-capture', name: 'Captura de Leads', description: 'Template com formulário para captura de contatos' },
  { id: 'sales-page', name: 'Página de Vendas', description: 'Template completo para páginas de vendas' },
  { id: 'webinar', name: 'Webinar', description: 'Template para inscrição em webinar/evento' },
  { id: 'thank-you', name: 'Página de Agradecimento', description: 'Template para página de agradecimento pós-conversão' },
];

export interface LandingPageFormData {
  title: string;
  slug: string;
  templateId: string;
  webhook_url: string;
  published: boolean;
}

// Props for page components
export interface PageListProps {
  pages: LandingPage[];
  loading: boolean;
  onEdit: (page: LandingPage) => void;
  onDelete: (pageId: string) => void;
  onDuplicate: (page: LandingPage) => void;
  onTogglePublish: (page: LandingPage) => void;
  onOpenAiModal: (page: LandingPage) => void;
  formatDate: (dateString: string) => string;
}

export interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: LandingPageFormData;
  setFormData: React.Dispatch<React.SetStateAction<LandingPageFormData>>;
  onSave: () => Promise<void>;
  editMode: boolean;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AiGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiPrompt: string;
  setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
  onGenerate: () => Promise<void>;
  loading: boolean;
}
