
import React, { useState } from 'react';
import { useFacebookCampaigns } from '@/hooks/useFacebookCampaign';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ChartLine, 
  AlertOctagon, 
  Facebook, 
  Instagram, 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  Users 
} from "lucide-react";
import CampaignsTable from './FacebookCampaignsTable';
import StatCard from './StatCard';
import LoadingSpinner from '../../landing-page/LoadingSpinner';

const FacebookCampaigns = () => {
  const { campaigns, loading, facebookConnected, refreshCampaigns } = useFacebookCampaigns();
  const [activeTab, setActiveTab] = useState('active');
  
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
            {renderCampaignContent(loading, filteredCampaigns, refreshCampaigns, formatCurrency, formatDate, formatNumber)}
          </TabsContent>
          
          <TabsContent value="inactive">
            {renderCampaignContent(loading, filteredCampaigns, refreshCampaigns, formatCurrency, formatDate, formatNumber)}
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

// Helper function to render campaign content
const renderCampaignContent = (
  loading: boolean, 
  filteredCampaigns: any[], 
  refreshCampaigns: () => void,
  formatCurrency: (value: number) => string,
  formatDate: (dateString: string) => string,
  formatNumber: (value: number) => string
) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  } 
  
  if (filteredCampaigns.length === 0) {
    return (
      <div className="text-center py-8 px-4 border border-gray-800 rounded-md bg-gray-900/50">
        <Facebook className="h-10 w-10 mx-auto mb-3 text-gray-500" />
        <h3 className="text-lg font-medium mb-1">Nenhuma campanha encontrada</h3>
        <p className="text-gray-400 mb-4">
          Não há campanhas disponíveis no momento.
        </p>
        <Button variant="outline" onClick={refreshCampaigns}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Verificar novamente
        </Button>
      </div>
    );
  }
  
  return (
    <CampaignsTable 
      campaigns={filteredCampaigns}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      formatNumber={formatNumber}
    />
  );
};

export default FacebookCampaigns;
