
import React from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Facebook 
} from "lucide-react";
import StatCard from '../StatCard';
import { FacebookCampaign } from '@/hooks/useFacebookCampaign';

interface CampaignStatsProps {
  campaigns: FacebookCampaign[];
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
}

const CampaignStats: React.FC<CampaignStatsProps> = ({ 
  campaigns, 
  formatCurrency, 
  formatNumber 
}) => {
  return (
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
  );
};

export default CampaignStats;
