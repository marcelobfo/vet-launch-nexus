
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  UserPlus,
  Mail,
  MoreHorizontal,
  Download,
  Tag,
  Send,
  Trash2,
  Filter,
  X,
} from 'lucide-react';

// Tipo para landing pages
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
  
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    tags: '',
    source: 'manual',
  });

  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
  });

  // Buscar leads e páginas ao iniciar
  useEffect(() => {
    if (company) {
      fetchLeads();
      fetchLandingPages();
    }
  }, [company]);

  // Aplicar filtros quando alterar busca
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterSource, leads]);

  // Buscar leads da empresa
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', company?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Processar os dados para garantir o formato correto
      const formattedLeads: Lead[] = (data || []).map(lead => {
        return {
          ...lead,
          custom_fields: lead.custom_fields || null,
          tags: lead.tags || null,
          name: lead.name || null,
          phone: lead.phone || null,
          source: lead.source || null,
          landing_page_id: lead.landing_page_id || null
        };
      });
      
      setLeads(formattedLeads);
      setFilteredLeads(formattedLeads);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar landing pages
  const fetchLandingPages = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('id, title, slug')
        .eq('company_id', company?.id);

      if (error) throw error;
      setLandingPages(data || []);
    } catch (error) {
      console.error('Erro ao carregar landing pages:', error);
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
  const handleAddLead = async () => {
    try {
      if (!company) throw new Error('Empresa não encontrada');
      if (!newLead.email) throw new Error('Email é obrigatório');
      
      // Validação simples de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newLead.email)) {
        throw new Error('Email inválido');
      }

      const tags = newLead.tags ? newLead.tags.split(',').map(tag => tag.trim()) : [];
      
      const { data, error } = await supabase
        .from('leads')
        .upsert({
          company_id: company.id,
          email: newLead.email,
          name: newLead.name || null,
          phone: newLead.phone || null,
          source: newLead.source,
          tags: tags.length > 0 ? tags : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'company_id,email' })
        .select();

      if (error) throw error;
      
      toast({
        title: 'Lead adicionado',
        description: 'O lead foi adicionado com sucesso',
      });
      
      setShowAddDialog(false);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        tags: '',
        source: 'manual',
      });
      fetchLeads();
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
  const handleSendEmail = async () => {
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
      setEmailData({
        subject: '',
        content: '',
      });
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
        const { error } = await supabase
          .from('leads')
          .delete()
          .in('id', selectedLeads);
          
        if (error) throw error;
        
        toast({
          title: 'Leads excluídos',
          description: `${selectedLeads.length} lead(s) foram excluídos com sucesso`,
        });
        
        setSelectedLeads([]);
        fetchLeads();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Leads</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie seus contatos e envie campanhas de email
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-vet-primary gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Lead</span>
          </Button>
        </div>
      </div>

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
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-2.5"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-vet-primary"></div>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center p-8 border rounded-lg border-dashed">
                  <h3 className="font-medium text-lg mb-2">Nenhum lead encontrado</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery || filterSource 
                      ? 'Nenhum lead corresponde aos filtros aplicados. Tente outros filtros ou limpe a busca.'
                      : 'Você ainda não tem leads cadastrados. Comece adicionando um lead ou criando páginas de captura.'}
                  </p>
                  {!searchQuery && !filterSource && (
                    <Button onClick={() => setShowAddDialog(true)}>
                      Adicionar Lead Manualmente
                    </Button>
                  )}
                </div>
              ) : (
                <>
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
                          {getUniqueSources().map((source) => (
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
                            onClick={() => setShowEmailDialog(true)}
                            className="gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Enviar Email
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleDeleteLeads}
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
                        onClick={handleExportLeads}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <input
                              type="checkbox"
                              checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded"
                            />
                          </TableHead>
                          <TableHead>Nome / Email</TableHead>
                          <TableHead>Fonte</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Cadastro</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedLeads.includes(lead.id)}
                                onChange={() => toggleSelectLead(lead.id)}
                                className="rounded"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{lead.name || '-'}</div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                                {lead.phone && (
                                  <div className="text-xs text-gray-400">{lead.phone}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {lead.source && (
                                <Badge variant="outline">
                                  {lead.landing_page_id 
                                    ? getLandingPageName(lead.landing_page_id)
                                    : lead.source}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {lead.tags && lead.tags.map((tag, index) => (
                                  <Badge 
                                    key={index} 
                                    className="bg-blue-500/10 text-blue-400 border-blue-200"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(lead.created_at)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Enviar Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Tag className="h-4 w-4 mr-2" />
                                    Adicionar Tags
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
              <CardDescription>
                Análise de desempenho das suas páginas de captura de leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{leads.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Leads este mês</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {leads.filter(lead => {
                        const today = new Date();
                        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                        return new Date(lead.created_at) >= firstDay;
                      }).length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">--</div>
                  </CardContent>
                </Card>
              </div>
              
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

      {/* Modal de adicionar lead */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Lead</DialogTitle>
            <DialogDescription>
              Preencha os dados do lead que deseja adicionar manualmente
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Nome do contato"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={newLead.tags}
                onChange={(e) => setNewLead({ ...newLead, tags: e.target.value })}
                placeholder="Ex: cliente, interessado, webinar"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddLead} className="bg-vet-primary">
              Adicionar Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de envio de email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Email para {selectedLeads.length} Lead(s)</DialogTitle>
            <DialogDescription>
              Crie o email que será enviado para os leads selecionados
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Assunto do email"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                value={emailData.content}
                onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                placeholder="Conteúdo do email..."
                rows={8}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendEmail} className="gap-2 bg-vet-primary">
              <Send className="h-4 w-4" />
              <span>Enviar Email</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManager;
