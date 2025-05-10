
import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, RefreshCw } from "lucide-react";

interface EmptyCampaignStateProps {
  refreshCampaigns: () => void;
}

const EmptyCampaignState: React.FC<EmptyCampaignStateProps> = ({ refreshCampaigns }) => {
  return (
    <div className="text-center py-8 px-4 border border-gray-800 rounded-md bg-gray-900/50">
      <Facebook className="h-10 w-10 mx-auto mb-3 text-gray-500" />
      <h3 className="text-lg font-medium mb-1">Nenhuma campanha encontrada</h3>
      <p className="text-gray-400 mb-4">
        Não há campanhas disponíveis no momento.
      </p>
      <Button variant="outline" onClick={refreshCampaigns}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Verificar novamente
      </Button>
    </div>
  );
};

export default EmptyCampaignState;
