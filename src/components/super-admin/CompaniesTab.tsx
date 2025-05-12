
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import CompanyList from './CompanyList';
import UsersList from './UsersList';
import CompanyDialog from './CompanyDialog';
import { Company } from '@/types';

interface ExtendedCompany extends Company {
  user_count?: number;
}

const CompaniesTab: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<ExtendedCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<ExtendedCompany | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    allow_signup: true,
    is_active: true
  });

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      // Get all companies with user count
      const { data, error } = await supabase
        .from('companies')
        .select('*, users:users(count)')
        .order('name');
      
      if (error) throw error;
      
      // Format the data to include user counts
      const formattedCompanies = data.map((company: any) => ({
        ...company,
        user_count: company.users[0].count || 0
      }));
      
      setCompanies(formattedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de empresas.",
        variant: "destructive"
      });
    }
  };

  // Fetch users for a specific company
  const fetchCompanyUsers = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .order('name');
      
      if (error) throw error;
      
      setCompanyUsers(data || []);
      setSelectedCompanyId(companyId);
    } catch (error) {
      console.error('Error fetching company users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários da empresa.",
        variant: "destructive"
      });
    }
  };

  // Handle save company
  const handleSaveCompany = async () => {
    if (!newCompany.name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome da empresa.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingCompany) {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update({
            name: newCompany.name,
            is_active: newCompany.is_active,
            allow_signup: newCompany.allow_signup
          })
          .eq('id', editingCompany.id);
        
        if (error) throw error;
        
        toast({
          title: "Empresa atualizada",
          description: `As informações de ${newCompany.name} foram atualizadas com sucesso.`
        });
      } else {
        // Generate a random 6-character code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Create new company
        const { error } = await supabase
          .from('companies')
          .insert([
            { 
              name: newCompany.name,
              code,
              is_active: newCompany.is_active,
              allow_signup: newCompany.allow_signup
            }
          ]);
        
        if (error) throw error;
        
        toast({
          title: "Empresa adicionada",
          description: `${newCompany.name} foi adicionada com sucesso.`
        });
      }
      
      // Reset form and close dialog
      setNewCompany({
        name: '',
        allow_signup: true,
        is_active: true
      });
      
      setShowNewCompanyDialog(false);
      setEditingCompany(null);
      
      // Refresh the list of companies
      await fetchCompanies();
      
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a empresa.",
        variant: "destructive"
      });
    }
  };

  // Handle toggle company status
  const handleToggleCompanyStatus = async (companyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: !currentStatus })
        .eq('id', companyId);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: `A empresa foi ${!currentStatus ? 'ativada' : 'desativada'} com sucesso.`
      });
      
      // Refresh the list of companies
      await fetchCompanies();
      
    } catch (error) {
      console.error('Error toggling company status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da empresa.",
        variant: "destructive"
      });
    }
  };

  // Handle edit company
  const handleEditCompany = (company: ExtendedCompany) => {
    setEditingCompany(company);
    setNewCompany({
      name: company.name,
      is_active: company.is_active || false,
      allow_signup: company.allow_signup || true
    });
    setShowNewCompanyDialog(true);
  };

  // Handle delete company
  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Esta ação irá excluir permanentemente a empresa e todos os seus dados. Deseja continuar?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);
      
      if (error) throw error;
      
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída permanentemente."
      });
      
      // Refresh the list of companies
      await fetchCompanies();
      
      // Clear selected company if it was deleted
      if (selectedCompanyId === companyId) {
        setSelectedCompanyId(null);
        setCompanyUsers([]);
      }
      
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a empresa.",
        variant: "destructive"
      });
    }
  };
  
  // Handle toggle user status
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: `O usuário foi ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`
      });
      
      // Refresh the list of users
      if (selectedCompanyId) {
        await fetchCompanyUsers(selectedCompanyId);
      }
      
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do usuário.",
        variant: "destructive"
      });
    }
  };

  // React.useEffect to fetch companies on mount
  React.useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column: Companies list */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Empresas</span>
              <Button size="sm" onClick={() => {
                setEditingCompany(null);
                setNewCompany({
                  name: '',
                  allow_signup: true,
                  is_active: true
                });
                setShowNewCompanyDialog(true);
              }} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Nova</span>
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <CompanyList 
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onCompanySelect={fetchCompanyUsers}
              onEditCompany={handleEditCompany}
              onToggleCompanyStatus={handleToggleCompanyStatus}
              onDeleteCompany={handleDeleteCompany}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Right column: Company users */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCompanyId ? (
                <>Usuários de {companies.find(c => c.id === selectedCompanyId)?.name}</>
              ) : (
                <>Selecione uma empresa</>
              )}
            </CardTitle>
            <CardDescription>
              {selectedCompanyId
                ? 'Lista de usuários cadastrados nesta empresa'
                : 'Clique em uma empresa ao lado para visualizar seus usuários'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {selectedCompanyId ? (
              companyUsers.length > 0 ? (
                <UsersList 
                  companyUsers={companyUsers} 
                  onToggleUserStatus={handleToggleUserStatus} 
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Esta empresa não possui usuários cadastrados
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecione uma empresa para visualizar seus usuários
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Company Dialog */}
      <CompanyDialog 
        isOpen={showNewCompanyDialog}
        onClose={() => {
          setShowNewCompanyDialog(false);
          setEditingCompany(null);
        }}
        companyData={newCompany}
        setCompanyData={setNewCompany}
        editingCompany={editingCompany}
        onSave={handleSaveCompany}
      />
    </div>
  );
};

export default CompaniesTab;
