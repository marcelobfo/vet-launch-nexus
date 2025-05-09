
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface EmailLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeadsCount: number;
  onSendEmail: (emailData: { subject: string; content: string }) => Promise<void>;
}

const EmailLeadsDialog: React.FC<EmailLeadsDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedLeadsCount, 
  onSendEmail 
}) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEmailData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    await onSendEmail(emailData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar Email para {selectedLeadsCount} Lead(s)</DialogTitle>
          <DialogDescription>
            Crie o email que será enviado para os leads selecionados
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Assunto *</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={handleChange}
              placeholder="Assunto do email"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              value={emailData.content}
              onChange={handleChange}
              placeholder="Conteúdo do email..."
              rows={8}
              required
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="gap-2 bg-vet-primary">
            <Send className="h-4 w-4" />
            <span>Enviar Email</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailLeadsDialog;
