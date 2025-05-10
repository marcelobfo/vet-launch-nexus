
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChartLine, 
  AlertOctagon, 
  Facebook, 
  Instagram, 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users 
} from "lucide-react";
import LoadingSpinner from '../landing-page/LoadingSpinner';

interface FacebookCampaign {
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

const FacebookCampaigns = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<FacebookCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
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
      // In a real application, this would fetch campaigns from Facebook API
      // using the company's Facebook configuration
      
      setLoading(true);
      
      // Check if Facebook is connected
      const { data: fbConfig, error: fbError } = await supabase
        .from('facebook_configs')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();
      
      if (fbError) throw fbError;
      
      if (!fbConfig || !fbConfig.is_connected) {
        // Not connected, so we don't fetch campaigns
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
    
    // In a real application, this would call an edge function
    // that communicates with the Facebook API and updates the database
    
    // For now, just re-fetch the campaigns
    await fetchCampaigns();
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  };
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };
  
  const getCampaignIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'both':
        return (
          <div className="flex -space-x-1">
            <Facebook className="h-4 w-4 text-blue-500" />
            <Instagram className="h-4 w-4 text-pink-500" />
          </div>
        );
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-600">Ativa</Badge>;
      case 'paused':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-500">Pausada</Badge>;
      case 'completed':
        return <Badge variant="secondary">Concluída</Badge>;
      case 'archived':
        return <Badge variant="destructive">Arquivada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'active') {
      return ['active', 'paused'].includes(campaign.status.toLowerCase());
    } else {
      return ['completed', 'archived'].includes(campaign.status.toLowerCase());
    }
  });

  if (!facebookConnected) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Campanhas do Facebook/Instagram</CardTitle>
          <CardDescription>
            Visualize e gerencie suas campanhas publicitárias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-900/20 border border-amber-700/30 text-amber-400 p-4 rounded-md flex items-center gap-3">
            <AlertOctagon className="h-5 w-5 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">Conexão com Facebook necessária</h4>
              <p className="text-sm">
                Para visualizar suas campanhas, configure primeiro a integração com o Facebook na aba Configurações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" />
              Campanhas do Facebook/Instagram
            </CardTitle>
            <CardDescription>
              Visualize e gerencie suas campanhas publicitárias
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            onClick={refreshCampaigns}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-[400px] mb-6">
            <TabsTrigger value="active" className="flex-1">Campanhas Ativas</TabsTrigger>
            <TabsTrigger value="inactive" className="flex-1">Campanhas Inativas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner />
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-8 px-4 border border-gray-800 rounded-md bg-gray-900/50">
                <Facebook className="h-10 w-10 mx-auto mb-3 text-gray-500" />
                <h3 className="text-lg font-medium mb-1">Nenhuma campanha ativa encontrada</h3>
                <p className="text-gray-400 mb-4">
                  Não há campanhas ativas ou pausadas no momento.
                </p>
                <Button variant="outline" onClick={refreshCampaigns}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar novamente
                </Button>
              </div>
            ) : (
              <CampaignsTable 
                campaigns={filteredCampaigns}
                getStatusBadge={getStatusBadge}
                getCampaignIcon={getCampaignIcon}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                formatNumber={formatNumber}
              />
            )}
          </TabsContent>
          
          <TabsContent value="inactive">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner />
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-8 px-4 border border-gray-800 rounded-md bg-gray-900/50">
                <Facebook className="h-10 w-10 mx-auto mb-3 text-gray-500" />
                <h3 className="text-lg font-medium mb-1">Nenhuma campanha inativa encontrada</h3>
                <p className="text-gray-400 mb-4">
                  Não há campanhas concluídas ou arquivadas no momento.
                </p>
                <Button variant="outline" onClick={refreshCampaigns}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar novamente
                </Button>
              </div>
            ) : (
              <CampaignsTable 
                campaigns={filteredCampaigns}
                getStatusBadge={getStatusBadge}
                getCampaignIcon={getCampaignIcon}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                formatNumber={formatNumber}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Investido"
            value={formatCurrency(campaigns.reduce((acc, camp) => acc + camp.spent, 0))}
            icon={<DollarSign className="h-5 w-5 text-green-500" />}
          />
          <StatCard 
            title="Alcance Total"
            value={formatNumber(campaigns.reduce((acc, camp) => acc + camp.reach, 0))}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
          <StatCard 
            title="Conversões"
            value={formatNumber(campaigns.reduce((acc, camp) => acc + camp.conversions, 0))}
            icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          />
          <StatCard 
            title="Campanhas Ativas"
            value={campaigns.filter(c => c.status.toLowerCase() === 'active').length.toString()}
            icon={<Facebook className="h-5 w-5 text-blue-500" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface CampaignsTableProps {
  campaigns: FacebookCampaign[];
  getStatusBadge: (status: string) => React.ReactNode;
  getCampaignIcon: (platform: string) => React.ReactNode;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (value: number) => string;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  campaigns,
  getStatusBadge,
  getCampaignIcon,
  formatCurrency,
  formatDate,
  formatNumber
}) => {
  return (
    <Table>
      <TableCaption>Lista de campanhas do Facebook/Instagram</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plataforma</TableHead>
          <TableHead>Período</TableHead>
          <TableHead>Investimento</TableHead>
          <TableHead>Alcance</TableHead>
          <TableHead>Conversões</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
            <TableCell className="whitespace-nowrap">
              <div className="flex items-center gap-1">
                {getCampaignIcon(campaign.platform)}
                <span className="text-xs text-gray-400 ml-1">
                  {campaign.platform === 'both' 
                    ? 'FB/IG' 
                    : campaign.platform === 'facebook' 
                      ? 'Facebook' 
                      : 'Instagram'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs">
                  {formatDate(campaign.start_date)}
                  {campaign.end_date ? ` - ${formatDate(campaign.end_date)}` : ''}
                </span>
              </div>
            </TableCell>
            <TableCell>{formatCurrency(campaign.spent)}</TableCell>
            <TableCell>{formatNumber(campaign.reach)}</TableCell>
            <TableCell>{formatNumber(campaign.conversions)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm text-gray-400">{title}</h4>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
};

export default FacebookCampaigns;
