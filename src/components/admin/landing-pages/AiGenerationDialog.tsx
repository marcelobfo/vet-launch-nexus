
import React from 'react';
import { AiGenerationDialogProps } from '@/types/landingPageTypes';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Sparkles } from 'lucide-react';

const AiGenerationDialog: React.FC<AiGenerationDialogProps> = ({
  open,
  onOpenChange,
  aiPrompt,
  setAiPrompt,
  onGenerate,
  loading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={onGenerate} disabled={loading} className="gap-2">
            {loading ? (
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
  );
};

export default AiGenerationDialog;
