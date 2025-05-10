
import React, { useState } from 'react';
import { useFacebookCampaigns } from '@/hooks/useFacebookCampaign';
import { useCampaignFormatters } from '@/hooks/useCampaignFormatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartLine, RefreshCw } from "lucide-react";
import CampaignContent from './campaigns/CampaignContent';
import CampaignStats from './campaigns/CampaignStats';
import DisconnectedState from './campaigns/DisconnectedState';

const FacebookCampaigns = () => {
  const { campaigns, loading, facebookConnected, refreshCampaigns } = useFacebookCampaigns();
  const { formatCurrency, formatDate, formatNumber } = useCampaignFormatters();
  const [activeTab, setActiveTab] = useState('active');
  
  if (!facebookConnected) {
    return <DisconnectedState />;
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'active') {
      return ['active', 'paused'].includes(campaign.status.toLowerCase());
    } else {
      return ['completed', 'archived'].includes(campaign.status.toLowerCase());
    }
  });

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
            <CampaignContent
              loading={loading}
              campaigns={filteredCampaigns}
              refreshCampaigns={refreshCampaigns}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />
          </TabsContent>
          
          <TabsContent value="inactive">
            <CampaignContent
              loading={loading}
              campaigns={filteredCampaigns}
              refreshCampaigns={refreshCampaigns}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              formatNumber={formatNumber}
            />
          </TabsContent>
        </Tabs>

        <CampaignStats 
          campaigns={campaigns}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
      </CardContent>
    </Card>
  );
};

export default FacebookCampaigns;
