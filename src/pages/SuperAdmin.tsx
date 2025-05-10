
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  Building, 
  LogOut, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  MoreVertical,
  User
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SuperAdminHeader from '@/components/super-admin/SuperAdminHeader';
import CreateSuperAdminForm from '@/components/super-admin/CreateSuperAdminForm';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Define types
interface SuperAdmin {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface Company {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  user_count?: number;
}

const SuperAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("companies");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([]);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    allow_signup: true,
    is_active: true
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  
  // Check if user is authenticated as super admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const storedSession = localStorage.getItem('super_admin_session');
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          if (sessionData && sessionData.isValid && new Date(sessionData.expiresAt) > new Date()) {
            // Verify if the super admin still exists in the database
            const { data, error } = await supabase
              .from('super_admins')
              .select('*')
              .eq('id', sessionData.id)
              .eq('email', sessionData.email)
              .eq('is_active', true)
              .single();
            
            if (!error && data) {
              setSession(sessionData);
              await fetchCompanies();
              await fetchSuperAdmins();
            } else {
              // Super admin no longer exists or is inactive
              localStorage.removeItem('super_admin_session');
              navigate('/super-admin-login');
            }
          } else {
            // Session expired
            localStorage.removeItem('super_admin_session');
            navigate('/super-admin-login');
          }
        } catch (error) {
          // Invalid session format
          localStorage.removeItem('super_admin_session');
          navigate('/super-admin-login');
        }
      } else {
        // No session found
        navigate('/super-admin-login');
      }
      setLoading(false);
    };
    
    checkSuperAdmin();
  }, [navigate]);

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

  // Fetch super admins
  const fetchSuperAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('super_admins')
        .select('*')
        .order('email');
      
      if (error) throw error;
      
      setSuperAdmins(data);
    } catch (error) {
      console.error('Error fetching super admins:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de super administradores.",
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('super_admin_session');
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel Super Admin."
    });
    navigate('/super-admin-login');
  };

  // Handle add/edit company
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
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setNewCompany({
      name: company.name,
      is_active: company.is_active,
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vet-dark">
        <Card className="p-6 text-center bg-card border-gray-800">
          <div className="animate-pulse">Verificando autenticação...</div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SuperAdminHeader onLogout={handleLogout} />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold">Painel Super Admin</h1>
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="companies">
                <Building className="h-4 w-4 mr-2" />
                Empresas
              </TabsTrigger>
              <TabsTrigger value="admins">
                <Users className="h-4 w-4 mr-2" />
                Super Admins
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies">
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
                              onClick={() => fetchCompanyUsers(company.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{company.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Código: {company.code} • {company.user_count} usuários
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
                                      handleEditCompany(company);
                                    }}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleCompanyStatus(company.id, company.is_active);
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
                                        handleDeleteCompany(company.id);
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
                          <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-800/50">
                                  <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuário</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cargo</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                  {companyUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-800/20">
                                      <td className="p-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700">
                                            <User className="h-4 w-4 text-gray-300" />
                                          </div>
                                          <div className="ml-2">
                                            <div className="text-sm font-medium">{user.name}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{user.email}</div>
                                      </td>
                                      <td className="p-3 whitespace-nowrap">
                                        <div className="text-sm">{user.role}</div>
                                      </td>
                                      <td className="p-3 whitespace-nowrap">
                                        <Badge className={user.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                                          {user.is_active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                      </td>
                                      <td className="p-3 whitespace-nowrap">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                                        >
                                          {user.is_active ? (
                                            <>
                                              <X className="h-4 w-4 mr-1" />
                                              Desativar
                                            </>
                                          ) : (
                                            <>
                                              <Check className="h-4 w-4 mr-1" />
                                              Ativar
                                            </>
                                          )}
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
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
              </div>
            </TabsContent>
            
            <TabsContent value="admins">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Gerenciar Super Admins</span>
                    <Button size="sm" className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Adicionar Super Admin</span>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateSuperAdminForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Dialog for adding/editing company */}
          <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCompany ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</DialogTitle>
                <DialogDescription>
                  {editingCompany 
                    ? 'Atualize as informações da empresa abaixo.' 
                    : 'Preencha as informações abaixo para adicionar uma nova empresa.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input 
                    id="name" 
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow_signup"
                    checked={newCompany.allow_signup}
                    onCheckedChange={(checked) => setNewCompany({...newCompany, allow_signup: checked})}
                  />
                  <Label htmlFor="allow_signup">Permitir novos cadastros</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={newCompany.is_active}
                    onCheckedChange={(checked) => setNewCompany({...newCompany, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Empresa ativa</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setShowNewCompanyDialog(false);
                  setEditingCompany(null);
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCompany}>
                  {editingCompany ? 'Salvar Alterações' : 'Adicionar Empresa'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
