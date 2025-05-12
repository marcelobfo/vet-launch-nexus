
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Company } from '@/types';

interface CompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: {
    name: string;
    allow_signup: boolean;
    is_active: boolean;
  };
  setCompanyData: React.Dispatch<React.SetStateAction<{
    name: string;
    allow_signup: boolean;
    is_active: boolean;
  }>>;
  editingCompany: Company | null;
  onSave: () => Promise<void>;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({
  isOpen,
  onClose,
  companyData,
  setCompanyData,
  editingCompany,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCompany ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</DialogTitle>
          <DialogDescription>
            {editingCompany 
              ? 'Atualize as informações da empresa abaixo.' 
              : 'Preencha as informações abaixo para adicionar uma nova empresa.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input 
              id="name" 
              value={companyData.name}
              onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
              placeholder="Nome da empresa"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="allow_signup"
              checked={companyData.allow_signup}
              onCheckedChange={(checked) => setCompanyData({...companyData, allow_signup: checked})}
            />
            <Label htmlFor="allow_signup">Permitir novos cadastros</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={companyData.is_active}
              onCheckedChange={(checked) => setCompanyData({...companyData, is_active: checked})}
            />
            <Label htmlFor="is_active">Empresa ativa</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {editingCompany ? 'Salvar Alterações' : 'Adicionar Empresa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDialog;
