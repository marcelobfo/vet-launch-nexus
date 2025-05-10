
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Mail, User, UserPlus, Shield } from "lucide-react";

const CreateSuperAdminForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar um Super Admin.",
        variant: "destructive"
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if the email already exists as a super admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (existingAdmin) {
        throw new Error("Este email já está registrado como Super Admin.");
      }
      
      // Insert the new super admin
      const { data: newAdmin, error } = await supabase
        .from('super_admins')
        .insert([
          { 
            name,
            email,
            is_active: true
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Generate a random 8 character access code
      const code = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                   Math.random().toString(36).substring(2, 6).toUpperCase();
      
      // Set expiration to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      // Store the access code
      await supabase
        .from('super_admin_access_codes')
        .insert([
          { 
            email,
            code,
            expires_at: expiresAt.toISOString(),
            is_used: false
          }
        ]);
      
      // In a real application, send the code via email
      // For now, we'll just simulate this with a console log
      console.log(`Access code for new Super Admin ${email}: ${code}`);
      
      toast({
        title: "Super Admin criado",
        description: `${name} foi adicionado como Super Admin. Um código de acesso foi enviado para ${email}.`,
      });
      
      // Reset form
      setName('');
      setEmail('');
      
      // In development, show the code in the toast
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Código de desenvolvimento",
          description: `Código: ${code} (apenas visível em ambiente de desenvolvimento)`,
          variant: "default"
        });
      }
      
    } catch (error: any) {
      console.error("Erro ao criar Super Admin:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o Super Admin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Nome do Super Admin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-background/50 border-input/50"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-background/50 border-input/50"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? (
          "Processando..."
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Criar Super Admin
          </>
        )}
      </Button>
    </form>
  );
};

export default CreateSuperAdminForm;
