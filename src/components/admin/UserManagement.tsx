import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import { 
  User, 
  Users, 
  Search, 
  Plus,
  X,
  Edit,
  Trash2,
  Mail,
  Briefcase,
  MoreVertical,
  Shield
} from 'lucide-react';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// User type definition
export type CompanyUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'active' | 'inactive';
  dateAdded: string;
};

const UserManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  
  // New user form state
  const [newUser, setNewUser] = useState<Partial<CompanyUser>>({
    name: '',
    email: '',
    role: '',
    department: 'Veterinária',
    status: 'active',
  });
  
  // Sample department options
  const departments = [
    'Veterinária',
    'Marketing',
    'Design',
    'Administrativo',
    'Vendas',
    'Atendimento',
    'Financeiro',
  ];
  
  // Sample roles - Adding Super Admin role
  const roles = [
    'Super Admin',
    'Administrador',
    'Gerente',
    'Veterinário',
    'Especialista de Marketing',
    'Designer',
    'Analista',
    'Assistente',
    'Estagiário',
  ];
  
  // Mock users
  const [users, setUsers] = useState<CompanyUser[]>([
    { 
      id: 1, 
      name: 'Carlos Silva', 
      email: 'carlos@exemplo.com.br', 
      role: 'Veterinário', 
      department: 'Veterinária',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'active',
      dateAdded: '2025-01-15',
    },
    { 
      id: 2, 
      name: 'Ana Oliveira', 
      email: 'ana@exemplo.com.br', 
      role: 'Especialista de Marketing', 
      department: 'Marketing',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'active',
      dateAdded: '2025-02-20',
    },
    { 
      id: 3, 
      name: 'Pedro Santos', 
      email: 'pedro@exemplo.com.br', 
      role: 'Designer', 
      department: 'Design',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: 'active',
      dateAdded: '2025-02-28',
    },
    { 
      id: 4, 
      name: 'Mariana Costa', 
      email: 'mariana@exemplo.com.br', 
      role: 'Analista', 
      department: 'Administrativo',
      avatar: 'https://i.pravatar.cc/150?img=9',
      status: 'active',
      dateAdded: '2025-03-10',
    },
    { 
      id: 5, 
      name: 'Lucas Gomes', 
      email: 'lucas@exemplo.com.br', 
      role: 'Super Admin', 
      department: 'Administrativo',
      avatar: 'https://i.pravatar.cc/150?img=60',
      status: 'active',
      dateAdded: '2025-01-05',
    },
  ]);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower)
    );
  });
  
  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Dados incompletos",
        description: "Preencha nome, email e cargo para adicionar o usuário.",
        variant: "destructive"
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email || '')) {
      toast({
        title: "Email inválido",
        description: "Forneça um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }
    
    const id = Math.max(...users.map(u => u.id), 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    // If editing, update existing user
    if (editingUser) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                name: newUser.name || user.name,
                email: newUser.email || user.email,
                role: newUser.role || user.role,
                department: newUser.department || user.department,
                status: newUser.status || user.status,
              }
            : user
        )
      );
      
      toast({
        title: "Usuário atualizado",
        description: `Informações de ${newUser.name} atualizadas com sucesso.`
      });
    } else {
      // Add new user
      const newUserData: CompanyUser = {
        id,
        name: newUser.name || '',
        email: newUser.email || '',
        role: newUser.role || '',
        department: newUser.department || 'Veterinária',
        status: newUser.status || 'active',
        dateAdded: today,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };
      
      setUsers(prevUsers => [...prevUsers, newUserData]);
      
      toast({
        title: "Usuário adicionado",
        description: `${newUserData.name} foi adicionado com sucesso.`
      });
    }
    
    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      role: '',
      department: 'Veterinária',
      status: 'active',
    });
    
    setShowNewUserDialog(false);
    setEditingUser(null);
  };
  
  // Delete user
  const handleDeleteUser = (userId: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso."
    });
  };
  
  // Edit user
  const handleEditUser = (user: CompanyUser) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    });
    setShowNewUserDialog(true);
  };
  
  // Toggle user status
  const handleToggleUserStatus = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === 'active' ? 'inativo' : 'ativo';
    
    toast({
      title: "Status atualizado",
      description: `O usuário foi marcado como ${newStatus}.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        
        <Button onClick={() => {
          setEditingUser(null);
          setNewUser({
            name: '',
            email: '',
            role: '',
            department: 'Veterinária',
            status: 'active',
          });
          setShowNewUserDialog(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Usuários da Empresa</CardTitle>
            
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1.5 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuário</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cargo</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departamento</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data de Adição</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-800/20">
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            )}
                          </Avatar>
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
                        <div className="text-sm">{user.department}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <Badge className={`
                          ${user.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                          }
                        `}>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(user.dateAdded).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                              {user.status === 'active' ? (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <User className="h-4 w-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  Nenhum usuário encontrado. Ajuste os critérios de busca ou adicione novos usuários.
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-400">
              Total: {users.length} usuários ({users.filter(u => u.status === 'active').length} ativos)
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Apenas ativos</SelectItem>
                <SelectItem value="inactive">Apenas inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardFooter>
      </Card>
      
      {/* Dialog for adding/editing user */}
      <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Atualize as informações do usuário abaixo.' 
                : 'Preencha as informações abaixo para adicionar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={newUser.name || ''}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Nome do usuário"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex">
                <div className="relative flex-1">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email || ''}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@exemplo.com"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select 
                  value={newUser.department} 
                  onValueChange={(value) => setNewUser({...newUser, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newUser.status} 
                onValueChange={(value: 'active' | 'inactive') => setNewUser({...newUser, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowNewUserDialog(false);
              setEditingUser(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>
              {editingUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
