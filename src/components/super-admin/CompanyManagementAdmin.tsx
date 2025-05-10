import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

const CompanyManagementAdmin = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCompanies(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar empresas",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleStatusToggle = async (companyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: !currentStatus })
        .eq('id', companyId);

      if (error) {
        throw error;
      }
      
      toast({
        title: `Empresa ${currentStatus ? 'desativada' : 'ativada'}`,
        description: `A empresa foi ${currentStatus ? 'desativada' : 'ativada'} com sucesso.`,
        variant: currentStatus ? "destructive" : "default"
      });
      
      fetchCompanies();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (companyId: string) => {
    navigate(`/super-admin/company/${companyId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Empresas</h2>
      <Table>
        <TableCaption>Lista de empresas cadastradas no sistema.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.code}</TableCell>
              <TableCell>
                <Switch
                  id={`company-status-${company.id}`}
                  checked={company.is_active}
                  onCheckedChange={() => handleStatusToggle(company.id, company.is_active)}
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(company.id)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <a href={`/admin?company=${company.code}`} target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout mr-2 h-4 w-4"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="9" x="14" y="3" rx="1"/><rect width="7" height="9" x="3" y="12" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/></svg>
                        Acessar como Admin
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyManagementAdmin;
