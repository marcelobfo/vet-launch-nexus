
import React from 'react';
import { Button } from "@/components/ui/button";

interface EmptyLeadStateProps {
  hasFilters: boolean;
  onAddLeadClick: () => void;
}

const EmptyLeadState: React.FC<EmptyLeadStateProps> = ({ hasFilters, onAddLeadClick }) => {
  return (
    <div className="text-center p-8 border rounded-lg border-dashed">
      <h3 className="font-medium text-lg mb-2">Nenhum lead encontrado</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {hasFilters 
          ? 'Nenhum lead corresponde aos filtros aplicados. Tente outros filtros ou limpe a busca.'
          : 'Você ainda não tem leads cadastrados. Comece adicionando um lead ou criando páginas de captura.'}
      </p>
      {!hasFilters && (
        <Button onClick={onAddLeadClick}>
          Adicionar Lead Manualmente
        </Button>
      )}
    </div>
  );
};

export default EmptyLeadState;
