
import React from 'react';
import { CreatePageDialogProps, TEMPLATES } from '@/types/landingPageTypes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

const CreatePageDialog: React.FC<CreatePageDialogProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSave,
  editMode,
  handleTitleChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-vet-primary">
            {editMode ? 'Salvar Alterações' : 'Criar Página'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageDialog;
