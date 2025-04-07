
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Layout, Search, Plus, Edit, Trash2, MoreHorizontal, Users } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Company {
  id: number;
  name: string;
  domain: string;
  users: number;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

const CompanyManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  
  // Mock company data
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 1,
      name: "Veto Pro 360",
      domain: "vetopro360.com.br",
      users: 3,
      plan: 'pro',
      status: 'active',
      createdAt: "2025-03-15",
    },
    {
      id: 2,
      name: "Clinica Animal",
      domain: "clinicaanimal.com.br",
      users: 2,
      plan: 'free',
      status: 'active',
      createdAt: "2025-03-20",
    },
    {
      id: 3,
      name: "Pet Health Co.",
      domain: "pethealth.com.br",
      users: 5,
      plan: 'enterprise',
      status: 'active',
      createdAt: "2025-03-25",
    },
    {
      id: 4,
      name: "Vet Care Center",
      domain: "vetcare.com.br",
      users: 1,
      plan: 'free',
      status: 'inactive',
      createdAt: "2025-04-01",
    },
  ]);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = () => {
    setEditCompany(null);
    setShowDialog(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditCompany(company);
    setShowDialog(true);
  };

  const handleDeleteCompany = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Empresa removida",
      description: "A empresa foi removida com sucesso.",
    });
  };

  const handleSaveCompany = () => {
    // This would save to a database in a real implementation
    toast({
      title: editCompany ? "Empresa atualizada" : "Empresa adicionada",
      description: editCompany 
        ? "As alterações foram salvas com sucesso." 
        : "A nova empresa foi adicionada com sucesso.",
    });
    setShowDialog(false);
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="outline" className="bg-gray-800/50 text-gray-300">Gratuito</Badge>;
      case 'pro':
        return <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">Pro</Badge>;
      case 'enterprise':
        return <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/30">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800/50">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-800 hover:bg-yellow-900/30">Pendente</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                <span>Gerenciamento de Empresas</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie todas as empresas na plataforma
              </CardDescription>
            </div>
            <Button 
              onClick={handleAddCompany} 
              className="bg-vet-primary hover:bg-vet-primary/90 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Nova Empresa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar empresas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border border-gray-800">
            <div className="grid grid-cols-12 text-xs font-medium text-gray-400 border-b border-gray-800 p-3">
              <div className="col-span-4">Empresa</div>
              <div className="col-span-3 hidden md:block">Domínio</div>
              <div className="col-span-1 text-center">Usuários</div>
              <div className="col-span-2 text-center hidden sm:block">Plano</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="divide-y divide-gray-800">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <div 
                    key={company.id} 
                    className="grid grid-cols-12 items-center p-3 hover:bg-gray-800/20 transition-colors"
                  >
                    <div className="col-span-4 font-medium">{company.name}</div>
                    <div className="col-span-3 text-gray-400 hidden md:block">{company.domain}</div>
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span>{company.users}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center hidden sm:flex justify-center">
                      {getPlanBadge(company.plan)}
                    </div>
                    <div className="col-span-2 text-center flex justify-center">
                      {getStatusBadge(company.status)}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`https://${company.domain}`, '_blank')}>
                            <Layout className="h-4 w-4 mr-2" /> Ver Site
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCompany(company.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  Nenhuma empresa encontrada para "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4 justify-between">
          <div className="text-xs text-gray-400">
            Exibindo {filteredCompanies.length} de {companies.length} empresas
          </div>
          <div>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Add/Edit Company Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCompany ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</DialogTitle>
            <DialogDescription>
              {editCompany 
                ? 'Edite os detalhes da empresa abaixo.' 
                : 'Preencha os detalhes da nova empresa abaixo.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Empresa</label>
              <Input 
                placeholder="Ex: Veto Pro 360" 
                defaultValue={editCompany?.name || ''}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Domínio</label>
              <Input 
                placeholder="Ex: vetopro360.com.br" 
                defaultValue={editCompany?.domain || ''}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plano</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={editCompany?.plan || 'free'}
                >
                  <option value="free">Gratuito</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={editCompany?.status || 'active'}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveCompany}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
