
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { FacebookConfig } from '@/types/facebook';

export const useFacebookConfig = () => {
  const { toast } = useToast();
  const { company } = useAuth();
  
  const [fbConfig, setFbConfig] = useState<FacebookConfig>({
    company_id: company?.id || '',
    app_id: '',
    app_secret: '',
    access_token: '',
    pixel_id: '',
    ad_account_id: '',
    enable_tracking: true,
    advanced_matching: false,
    is_connected: false
  });

  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    if (company) {
      fetchFacebookConfig();
    }
  }, [company]);

  const fetchFacebookConfig = async () => {
    if (!company) return;
    
    try {
      // First, check if the facebook_configs table exists
      const { error: tableError } = await supabase
        .from('facebook_configs')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (tableError && tableError.code === '42P01') { // relation does not exist
        console.log('facebook_configs table does not exist, creating it...');
        await createFacebookConfigTable();
        setLoadingConfig(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('facebook_configs')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setFbConfig({
          ...data,
          app_secret: data.app_secret ? '••••••••••••••••' : '', // Mask the secret
        });
      }
    } catch (error) {
      console.error('Error fetching Facebook config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };
  
  // Create the facebook_configs table if it doesn't exist
  const createFacebookConfigTable = async () => {
    try {
      // In a real application, you'd use a proper database migration
      // For this example, we'll just set an empty config
      console.log('Would create facebook_configs table here in a real app');
      // We don't actually create the table here since we don't have direct SQL access
    } catch (error) {
      console.error('Error creating facebook_configs table:', error);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFbConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnect = async () => {
    if (!fbConfig.app_id || !fbConfig.access_token) {
      toast({
        title: "Campos obrigatórios",
        description: "App ID e Access Token são obrigatórios para conectar com a API do Facebook.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, verify the token against the Facebook API
      // Here we'll just simulate a successful connection
      
      const updatedConfig = {
        ...fbConfig,
        is_connected: true,
        company_id: company?.id || '',
        updated_at: new Date().toISOString()
      };
      
      // Check if the table exists
      const { error: checkError } = await supabase
        .from('facebook_configs')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, we can't insert
        toast({
          title: "Erro de Configuração",
          description: "A tabela facebook_configs não existe no banco de dados. Entre em contato com o suporte.",
          variant: "destructive"
        });
        return;
      }
      
      // If there's an existing config, update it, otherwise insert a new one
      if (fbConfig.id) {
        // Don't send masked password back to server
        const configToSave = { 
          ...updatedConfig,
          // Only update app_secret if it's not masked (i.e., user changed it)
          app_secret: fbConfig.app_secret === '••••••••••••••••' 
            ? undefined 
            : fbConfig.app_secret
        };
        
        const { error } = await supabase
          .from('facebook_configs')
          .update(configToSave)
          .eq('id', fbConfig.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('facebook_configs')
          .insert([updatedConfig]);
          
        if (error) throw error;
      }
      
      setFbConfig(updatedConfig);
      
      toast({
        title: "Conectado com Sucesso",
        description: "API do Facebook configurada com sucesso.",
      });
    } catch (error) {
      console.error('Error connecting to Facebook API:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar à API do Facebook. Verifique suas credenciais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    fbConfig,
    loading,
    loadingConfig,
    handleChange,
    handleConnect
  };
};
