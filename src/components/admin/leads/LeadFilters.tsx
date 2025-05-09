
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, X, Download, Trash2, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface LeadFiltersProps {
  filterSource: string | null;
  setFilterSource: (source: string | null) => void;
  selectedLeads: string[];
  uniqueSources: string[];
  onDeleteLeads: () => void;
  onExportLeads: () => void;
  onShowEmailDialog: () => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  filterSource,
  setFilterSource,
  selectedLeads,
  uniqueSources,
  onDeleteLeads,
  onExportLeads,
  onShowEmailDialog
}) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
              {filterSource && <Badge variant="outline" className="ml-1">{filterSource}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {uniqueSources.map((source) => (
              <DropdownMenuItem 
                key={source}
                onClick={() => setFilterSource(source === filterSource ? null : source)}
                className="flex items-center justify-between"
              >
                {source}
                {source === filterSource && <span className="ml-2 text-vet-primary">✓</span>}
              </DropdownMenuItem>
            ))}
            {filterSource && (
              <DropdownMenuItem 
                onClick={() => setFilterSource(null)}
                className="border-t mt-1 pt-1"
              >
                Limpar filtro
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {selectedLeads.length > 0 && (
          <span className="text-sm">
            {selectedLeads.length} lead(s) selecionado(s)
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        {selectedLeads.length > 0 && (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onShowEmailDialog}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Enviar Email
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onDeleteLeads}
              className="gap-2 text-red-500 border-red-200 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={onExportLeads}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
};

export default LeadFilters;
