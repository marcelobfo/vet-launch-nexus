
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { EyeIcon, Edit2Icon, CheckCircle, XCircle, Building } from "lucide-react";
import LoadingSpinner from '../landing-page/LoadingSpinner';

interface Company {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  user_count: number;
}

const CompanyManagementAdmin = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  const fetchCompanies = async () => {
    try {
      // Note: In a real application, we would create a SQL function to get companies with their user count
      const { data: companiesData, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      
      // Fetch user count for each company
      const companiesWithUserCount = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { data: users, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('company_id', company.id);
          
          return {
            ...company,
            user_count: users?.length || 0
          };
        })
      );
      
      setCompanies(companiesWithUserCount);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as empresas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleCompanyStatus = async (companyId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('companies')
        .update({ is_active: !currentStatus })
        .eq('id', companyId);
      
      // Update the local state
      setCompanies(companies.map(company => {
        if (company.id === companyId) {
          return { ...company, is_active: !currentStatus };
        }
        return company;
      }));
      
      toast({
        title: 'Status atualizado',
        description: `Empresa ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`,
      });
    } catch (error) {
      console.error('Error updating company status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da empresa',
        variant: 'destructive',
      });
    }
  };
  
  // Format date in Brazilian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Empresas Cadastradas
        </CardTitle>
        <Button size="sm">Adicionar Empresa</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <Table>
            <TableCaption>Lista de empresas cadastradas no sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhuma empresa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <code className="bg-gray-800 px-2 py-1 rounded text-sm">
                        {company.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.is_active ? "success" : "destructive"}>
                        {company.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>{company.user_count}</TableCell>
                    <TableCell>
                      {company.created_at ? formatDate(company.created_at) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Ver detalhes">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="icon" title="Editar">
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant={company.is_active ? "destructive" : "success"}
                          size="icon"
                          title={company.is_active ? "Desativar" : "Ativar"}
                          onClick={() => toggleCompanyStatus(company.id, company.is_active)}
                        >
                          {company.is_active ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyManagementAdmin;
