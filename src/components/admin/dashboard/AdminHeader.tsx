
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';

const AdminHeader = () => {
  const { user, company, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível encerrar sua sessão",
        variant: "destructive"
      });
    }
  };
  
  if (!user || !company) {
    return null;
  }
  
  return (
    <header className="border-b border-border">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciador de Lançamentos</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
            {company.name}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <User className="h-4 w-4 mr-2" />
                <span>{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
