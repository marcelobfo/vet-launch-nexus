
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, Trash2, Mail, Calendar, Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface SuperAdmin {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

const CreateSuperAdminForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch super admins
  useEffect(() => {
    const fetchSuperAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('super_admins')
          .select('*')
          .order('email');
        
        if (error) throw error;
        
        setSuperAdmins(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching super admins:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de super administradores.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchSuperAdmins();
  }, [toast]);
  
  const handleCreateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if the email already exists
      const { data: existingAdmin, error: checkError } = await supabase
        .from('super_admins')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (existingAdmin) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está registrado como Super Admin.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create a placeholder password hash (will be updated on first login)
      const placeholderPasswordHash = 'placeholder_for_first_login_' + Math.random().toString(36).substring(2);
      
      // Insert new super admin
      const { error: insertError } = await supabase
        .from('super_admins')
        .insert([
          { 
            email, 
            password_hash: placeholderPasswordHash,
            is_active: true 
          }
        ]);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Super Admin adicionado",
        description: `${email} foi adicionado como Super Admin.`
      });
      
      setEmail("");
      
      // Refresh the list
      const { data, error } = await supabase
        .from('super_admins')
        .select('*')
        .order('email');
      
      if (!error) {
        setSuperAdmins(data || []);
      }
      
    } catch (error) {
      console.error('Error creating super admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o Super Admin.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleToggleSuperAdminStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('super_admins')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: `O Super Admin foi ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`
      });
      
      // Refresh the list
      const { data, error: fetchError } = await supabase
        .from('super_admins')
        .select('*')
        .order('email');
      
      if (!fetchError) {
        setSuperAdmins(data || []);
      }
      
    } catch (error) {
      console.error('Error toggling super admin status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do Super Admin.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteSuperAdmin = async (id: string, email: string) => {
    if (!confirm(`Tem certeza que deseja remover ${email} como Super Admin?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('super_admins')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Super Admin removido",
        description: `${email} foi removido da lista de Super Admins.`
      });
      
      // Refresh the list
      const { data, error: fetchError } = await supabase
        .from('super_admins')
        .select('*')
        .order('email');
      
      if (!fetchError) {
        setSuperAdmins(data || []);
      }
      
    } catch (error) {
      console.error('Error deleting super admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o Super Admin.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSuperAdmin} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="email" className="sr-only">Email</Label>
          <div className="relative">
            <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              placeholder="Email do novo Super Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Adicionando..."
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar
            </>
          )}
        </Button>
      </form>
      
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data de Criação</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Último Login</th>
                <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Carregando...</td>
                </tr>
              ) : superAdmins.length > 0 ? (
                superAdmins.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-800/20">
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700">
                          <User className="h-4 w-4 text-gray-300" />
                        </div>
                        <div className="ml-2">
                          <div className="text-sm">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <Badge className={admin.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                        {admin.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(admin.created_at)}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {formatDate(admin.last_login)}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleSuperAdminStatus(admin.id, admin.is_active)}
                        >
                          {admin.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                          onClick={() => handleDeleteSuperAdmin(admin.id, admin.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Nenhum Super Admin encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Card className="bg-blue-900/20 border border-blue-800/30 p-4">
        <div className="text-sm text-blue-400">
          <p className="font-medium mb-2">Informações importantes</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Super Admins têm acesso a todas as empresas e usuários do sistema.</li>
            <li>Desative um Super Admin ao invés de excluí-lo para manter o histórico.</li>
            <li>Os Super Admins podem gerenciar outros Super Admins e empresas.</li>
            <li>O acesso é feito pela página de login específica para Super Admins.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default CreateSuperAdminForm;
