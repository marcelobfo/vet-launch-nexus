
import React from 'react';

interface PerformanceProps {
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

const PerformanceMetrics: React.FC<PerformanceProps> = ({ performance }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">Total de Leads</p>
        <p className="text-2xl font-semibold">{performance.totalLeads}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">Conversões</p>
        <p className="text-2xl font-semibold">{performance.totalConversions}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">Receita Bruta</p>
        <p className="text-2xl font-semibold">R$ {performance.grossRevenue.toLocaleString()}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-gray-400 text-sm mb-1">ROI</p>
        <p className="text-2xl font-semibold">{performance.roi.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
