
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export interface FacebookCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  platform: 'facebook' | 'instagram' | 'both';
  start_date: string;
  end_date: string | null;
  budget: number;
  spent: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  created_at: string;
}

export const useFacebookCampaigns = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<FacebookCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [facebookConnected, setFacebookConnected] = useState(false);
  
  useEffect(() => {
    if (company) {
      checkFacebookConnection();
      fetchCampaigns();
    }
  }, [company]);
  
  const checkFacebookConnection = async () => {
    if (!company) return;
    
    try {
      // Check if table exists
      const { error: tableError } = await supabase
        .from('facebook_configs')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (tableError && tableError.code === '42P01') {
        // Table doesn't exist
        setFacebookConnected(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('facebook_configs')
        .select('is_connected')
        .eq('company_id', company.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setFacebookConnected(data?.is_connected || false);
    } catch (error) {
      console.error('Error checking Facebook connection:', error);
      setFacebookConnected(false);
    }
  };
  
  const fetchCampaigns = async () => {
    if (!company) return;
    
    try {
      setLoading(true);
      
      // Check if Facebook is connected
      await checkFacebookConnection();
      
      if (!facebookConnected) {
        // Not connected, so we don't fetch campaigns
        setCampaigns([]);
        return;
      }
      
      // Check if facebook_campaigns table exists
      const { error: tableError } = await supabase
        .from('facebook_campaigns')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      if (tableError && tableError.code === '42P01') {
        // Table doesn't exist
        setCampaigns([]);
        return;
      }
      
      // In a real app, fetch from Facebook API
      // For now, fetch mock data from our database
      const { data: campaignsData, error } = await supabase
        .from('facebook_campaigns')
        .select('*')
        .eq('company_id', company.id);
      
      if (error) throw error;
      
      setCampaigns(campaignsData || []);
    } catch (error) {
      console.error('Error fetching Facebook campaigns:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as campanhas',
        variant: 'destructive',
      });
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshCampaigns = async () => {
    if (!company) return;
    
    toast({
      title: 'Atualizando campanhas',
      description: 'Buscando dados mais recentes do Facebook...',
    });
    
    await fetchCampaigns();
  };
  
  return {
    campaigns,
    loading,
    facebookConnected,
    refreshCampaigns
  };
};
