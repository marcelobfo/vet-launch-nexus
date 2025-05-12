
import React from 'react';
import { Building, MoreVertical, Pencil, X, Check, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Company } from '@/types';

interface CompanyListProps {
  companies: Company[];
  selectedCompanyId: string | null;
  onCompanySelect: (companyId: string) => void;
  onEditCompany: (company: Company) => void;
  onToggleCompanyStatus: (companyId: string, currentStatus: boolean) => void;
  onDeleteCompany: (companyId: string) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  selectedCompanyId,
  onCompanySelect,
  onEditCompany,
  onToggleCompanyStatus,
  onDeleteCompany
}) => {
  return (
    <div className="space-y-1">
      {companies.length > 0 ? (
        companies.map(company => (
          <div 
            key={company.id}
            className={`
              flex items-center justify-between p-2 rounded-lg cursor-pointer
              ${selectedCompanyId === company.id ? 'bg-primary/20' : 'hover:bg-muted/50'}
              ${!company.is_active && 'opacity-70'}
            `}
            onClick={() => onCompanySelect(company.id)}
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <div>
                <div className="font-medium">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  Código: {company.code} • {company.user_count || 0} usuários
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Badge className={company.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                {company.is_active ? 'Ativa' : 'Inativa'}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEditCompany(company);
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompanyStatus(company.id, company.is_active || false);
                  }}>
                    {company.is_active ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCompany(company.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Nenhuma empresa encontrada
        </div>
      )}
    </div>
  );
};

export default CompanyList;
