
import React from 'react';
import { Input } from "@/components/ui/input";

interface MetricsFormProps {
  metrics: {
    leadCost: number;
    hotLeadConversion: number;
    coldLeadConversion: number;
    landingPageConversion: number;
    campaignConversion: number;
    cpc: number;
    ctr: number;
    campaignBudget: number;
  };
  handleMetricsChange: (field: string, value: string) => void;
  handleExportReport: () => void;
}

const MetricsForm: React.FC<MetricsFormProps> = ({ 
  metrics, 
  handleMetricsChange,
  handleExportReport 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Custo por Lead (R$)</label>
        <Input 
          type="number" 
          step="0.01" 
          min="0"
          value={metrics.leadCost} 
          onChange={(e) => handleMetricsChange('leadCost', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Orçamento da Campanha (R$)</label>
        <Input 
          type="number"
          step="100" 
          min="0"
          value={metrics.campaignBudget} 
          onChange={(e) => handleMetricsChange('campaignBudget', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Conversão Leads Quentes (%)</label>
        <Input 
          type="number" 
          min="0" 
          max="100"
          value={metrics.hotLeadConversion} 
          onChange={(e) => handleMetricsChange('hotLeadConversion', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Conversão Leads Frios (%)</label>
        <Input 
          type="number" 
          min="0" 
          max="100"
          value={metrics.coldLeadConversion} 
          onChange={(e) => handleMetricsChange('coldLeadConversion', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Conversão Landing Page (%)</label>
        <Input 
          type="number" 
          min="0" 
          max="100"
          value={metrics.landingPageConversion} 
          onChange={(e) => handleMetricsChange('landingPageConversion', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Conversão Campanha (%)</label>
        <Input 
          type="number" 
          min="0" 
          max="100"
          value={metrics.campaignConversion} 
          onChange={(e) => handleMetricsChange('campaignConversion', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">CPC (R$)</label>
        <Input 
          type="number" 
          step="0.01" 
          min="0"
          value={metrics.cpc} 
          onChange={(e) => handleMetricsChange('cpc', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">CTR (%)</label>
        <Input 
          type="number" 
          step="0.1" 
          min="0" 
          max="100"
          value={metrics.ctr} 
          onChange={(e) => handleMetricsChange('ctr', e.target.value)}
          className="bg-vet-primary/20 border-vet-primary/30"
        />
      </div>
    </div>
  );
};

export default MetricsForm;
