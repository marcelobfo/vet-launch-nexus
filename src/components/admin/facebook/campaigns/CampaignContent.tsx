
import React from 'react';
import LoadingSpinner from '../../../landing-page/LoadingSpinner';
import CampaignsTable from '../FacebookCampaignsTable';
import EmptyCampaignState from './EmptyCampaignState';
import { FacebookCampaign } from '@/hooks/useFacebookCampaign';

interface CampaignContentProps {
  loading: boolean;
  campaigns: FacebookCampaign[];
  refreshCampaigns: () => void;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (value: number) => string;
}

const CampaignContent: React.FC<CampaignContentProps> = ({
  loading,
  campaigns,
  refreshCampaigns,
  formatCurrency,
  formatDate,
  formatNumber
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  } 
  
  if (campaigns.length === 0) {
    return <EmptyCampaignState refreshCampaigns={refreshCampaigns} />;
  }
  
  return (
    <CampaignsTable 
      campaigns={campaigns}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      formatNumber={formatNumber}
    />
  );
};

export default CampaignContent;
