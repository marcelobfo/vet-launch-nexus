
import React from 'react';

interface StandardPerformanceProps {
  performance: {
    totalLeads: number;
    hotLeads: number;
    coldLeads: number;
    hotConversions: number;
    coldConversions: number;
    totalConversions: number;
    grossRevenue: number;
    roi: number;
    conversionRate: number;
  };
}

interface LegacyPerformanceProps {
  performance: {
    monthlyLeads?: number[];
    monthlyConversions?: number[];
    revenue?: number[];
    marketingCost?: number[];
    months?: string[];
  };
}

const PerformanceMetrics: React.FC<StandardPerformanceProps | LegacyPerformanceProps> = ({ performance }) => {
  // Check if we're using the legacy performance data
  const isLegacyData = 'monthlyLeads' in performance || 'revenue' in performance;
  
  let displayData = {
    totalLeads: 0,
    totalConversions: 0,
    grossRevenue: 0,
    roi: 0
  };
  
  if (isLegacyData) {
    // Calculate summary stats from the legacy time series data
    const legacyData = performance as LegacyPerformanceProps['performance'];
    
    if (legacyData.monthlyLeads) {
      displayData.totalLeads = legacyData.monthlyLeads.reduce((sum, val) => sum + val, 0);
    }
    
    if (legacyData.monthlyConversions) {
      displayData.totalConversions = legacyData.monthlyConversions.reduce((sum, val) => sum + val, 0);
    }
    
    if (legacyData.revenue) {
      displayData.grossRevenue = legacyData.revenue.reduce((sum, val) => sum + val, 0);
    }
    
    if (legacyData.revenue && legacyData.marketingCost) {
      const totalRevenue = legacyData.revenue.reduce((sum, val) => sum + val, 0);
      const totalCost = legacyData.marketingCost.reduce((sum, val) => sum + val, 0);
      displayData.roi = ((totalRevenue - totalCost) / totalCost) * 100;
    }
  } else {
    // Use the standard performance data
    const standardData = performance as StandardPerformanceProps['performance'];
    displayData = {
      totalLeads: standardData.totalLeads,
      totalConversions: standardData.totalConversions,
      grossRevenue: standardData.grossRevenue,
      roi: standardData.roi
    };
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">Total de Leads</p>
        <p className="text-2xl font-semibold">{displayData.totalLeads}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">Conversões</p>
        <p className="text-2xl font-semibold">{displayData.totalConversions}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">Receita Bruta</p>
        <p className="text-2xl font-semibold">R$ {displayData.grossRevenue.toLocaleString()}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">ROI</p>
        <p className="text-2xl font-semibold">{displayData.roi.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
