
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

interface LeadListHeaderProps {
  onAddLeadClick: () => void;
}

const LeadListHeader: React.FC<LeadListHeaderProps> = ({ onAddLeadClick }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Gerenciamento de Leads</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie seus contatos e envie campanhas de email
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onAddLeadClick}
          className="bg-vet-primary gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Adicionar Lead</span>
        </Button>
      </div>
    </div>
  );
};

export default LeadListHeader;
