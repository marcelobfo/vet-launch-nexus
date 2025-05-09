
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components
import LeadListHeader from './leads/LeadListHeader';
import LeadSearch from './leads/LeadSearch';
import EmptyLeadState from './leads/EmptyLeadState';
import LeadFilters from './leads/LeadFilters';
import LeadsList from './leads/LeadsList';
import LeadStats from './leads/LeadStats';
import AddLeadDialog from './leads/AddLeadDialog';
import EmailLeadsDialog from './leads/EmailLeadsDialog';
import LoadingSpinner from '../landing-page/LoadingSpinner';

// Services
import { fetchLeadsByCompany, fetchLandingPages, addLead, deleteLeads } from '@/services/leadService';

// Types
import { Lead, LeadDB } from '@/types';

// Type for landing pages
type LandingPage = {
  id: string;
  title: string;
  slug: string;
};

const LeadManager = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  // Buscar leads e páginas ao iniciar
  useEffect(() => {
    if (company) {
      fetchData();
    }
  }, [company]);

  // Aplicar filtros quando alterar busca
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterSource, leads]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const leadsData = await fetchLeadsByCompany(company!.id);
      setLeads(leadsData);
      setFilteredLeads(leadsData);
      
      const landingPagesData = await fetchLandingPages(company!.id);
      setLandingPages(landingPagesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    let result = [...leads];
    
    // Aplicar busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        (lead.email && lead.email.toLowerCase().includes(query)) || 
        (lead.name && lead.name.toLowerCase().includes(query)) || 
        (lead.phone && lead.phone.toLowerCase().includes(query))
      );
    }
    
    // Aplicar filtro de fonte
    if (filterSource) {
      result = result.filter(lead => lead.source === filterSource);
    }
    
    setFilteredLeads(result);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Obter nome da landing page
  const getLandingPageName = (pageId: string | null) => {
    if (!pageId) return '-';
    const page = landingPages.find(p => p.id === pageId);
    return page ? page.title : '-';
  };

  // Selecionar/deselecionar todos os leads
  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Adicionar/remover lead da seleção
  const toggleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  // Adicionar novo lead manualmente
  const handleAddLead = async (newLeadData: {
    name: string;
    email: string;
    phone: string;
    tags: string;
    source: string;
  }) => {
    try {
      if (!company) throw new Error('Empresa não encontrada');
      if (!newLeadData.email) throw new Error('Email é obrigatório');
      
      // Validação simples de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newLeadData.email)) {
        throw new Error('Email inválido');
      }

      const tags = newLeadData.tags ? newLeadData.tags.split(',').map(tag => tag.trim()) : [];
      
      // Preparar dados formatados para DB
      const leadData: LeadDB = {
        company_id: company.id,
        email: newLeadData.email,
        name: newLeadData.name || null,
        phone: newLeadData.phone || null,
        source: newLeadData.source,
        tags: tags.length > 0 ? tags : null,
        custom_fields: {},
      };

      await addLead(leadData);
      
      toast({
        title: 'Lead adicionado',
        description: 'O lead foi adicionado com sucesso',
      });
      
      setShowAddDialog(false);
      fetchData();
    } catch (error: any) {
      console.error('Erro ao adicionar lead:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível adicionar o lead',
        variant: 'destructive',
      });
    }
  };

  // Enviar email para os leads selecionados
  const handleSendEmail = async (emailData: { subject: string; content: string }) => {
    try {
      if (selectedLeads.length === 0) throw new Error('Nenhum lead selecionado');
      if (!emailData.subject) throw new Error('Assunto do email é obrigatório');
      if (!emailData.content) throw new Error('Conteúdo do email é obrigatório');
      
      // Mock - em uma implementação real, você enviaria para a API de envio de emails
      toast({
        title: 'Emails enfileirados',
        description: `${selectedLeads.length} emails serão enviados em breve`,
      });
      
      setShowEmailDialog(false);
      setSelectedLeads([]);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar os emails',
        variant: 'destructive',
      });
    }
  };

  // Exportar leads
  const handleExportLeads = () => {
    const leadsToExport = selectedLeads.length > 0 
      ? leads.filter(lead => selectedLeads.includes(lead.id))
      : filteredLeads;
      
    if (leadsToExport.length === 0) {
      toast({
        title: 'Sem dados para exportar',
        description: 'Não há leads para exportar',
        variant: 'destructive',
      });
      return;
    }
    
    // Preparar dados para CSV
    const headers = ['Nome', 'Email', 'Telefone', 'Fonte', 'Tags', 'Data de Cadastro'];
    const csvData = leadsToExport.map(lead => [
      lead.name || '',
      lead.email,
      lead.phone || '',
      lead.source || '',
      lead.tags ? lead.tags.join(', ') : '',
      new Date(lead.created_at).toLocaleDateString('pt-BR'),
    ]);
    
    // Converter para CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download do arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Exportação concluída',
      description: `${leadsToExport.length} leads exportados com sucesso`,
    });
  };

  // Excluir leads
  const handleDeleteLeads = async () => {
    if (selectedLeads.length === 0) {
      toast({
        title: 'Nenhum lead selecionado',
        description: 'Selecione pelo menos um lead para excluir',
        variant: 'destructive',
      });
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir ${selectedLeads.length} lead(s)?`)) {
      try {
        await deleteLeads(selectedLeads);
        
        toast({
          title: 'Leads excluídos',
          description: `${selectedLeads.length} lead(s) foram excluídos com sucesso`,
        });
        
        setSelectedLeads([]);
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir leads:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir os leads',
          variant: 'destructive',
        });
      }
    }
  };

  // Obter fontes únicas para filtro
  const getUniqueSources = () => {
    const sources = new Set<string>();
    leads.forEach(lead => {
      if (lead.source) sources.add(lead.source);
    });
    return Array.from(sources);
  };

  return (
    <div className="space-y-6">
      <LeadListHeader onAddLeadClick={() => setShowAddDialog(true)} />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="list" className="flex-1">Lista de Leads</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Seus Leads</CardTitle>
                <LeadSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner />
                </div>
              ) : filteredLeads.length === 0 ? (
                <EmptyLeadState 
                  hasFilters={!!searchQuery || !!filterSource} 
                  onAddLeadClick={() => setShowAddDialog(true)} 
                />
              ) : (
                <>
                  <LeadFilters 
                    filterSource={filterSource}
                    setFilterSource={setFilterSource}
                    selectedLeads={selectedLeads}
                    uniqueSources={getUniqueSources()}
                    onDeleteLeads={handleDeleteLeads}
                    onExportLeads={handleExportLeads}
                    onShowEmailDialog={() => setShowEmailDialog(true)}
                  />
                  
                  <LeadsList 
                    filteredLeads={filteredLeads}
                    selectedLeads={selectedLeads}
                    toggleSelectLead={toggleSelectLead}
                    toggleSelectAll={toggleSelectAll}
                    formatDate={formatDate}
                    getLandingPageName={getLandingPageName}
                  />
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Exibindo {filteredLeads.length} de {leads.length} lead(s)
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadStats leads={leads} />
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Desempenho por Fonte</h3>
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  Dados insuficientes para gerar gráficos
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddLeadDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAddLead={handleAddLead} 
      />
      
      <EmailLeadsDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        selectedLeadsCount={selectedLeads.length}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
};

export default LeadManager;
