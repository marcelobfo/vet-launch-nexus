
import React from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';

interface ROIChartProps {
  data: Array<{
    name: string;
    ROI: number;
    Lucro: number;
  }>;
}

// For backward compatibility
interface LegacyROIChartProps {
  revenue: number[];
  cost: number[];
  months: string[];
}

const ROIChart: React.FC<ROIChartProps | LegacyROIChartProps> = (props) => {
  // Check if we're using the new data prop or legacy props
  const isLegacyProps = 'revenue' in props;
  
  // If using legacy props, convert to the format expected by the chart
  const chartData = isLegacyProps 
    ? (props as LegacyROIChartProps).months.map((month, i) => {
        const revenue = (props as LegacyROIChartProps).revenue[i];
        const cost = (props as LegacyROIChartProps).cost[i];
        const profit = revenue - cost;
        const roi = ((profit / cost) * 100).toFixed(1);
        
        return {
          name: month,
          ROI: parseFloat(roi),
          Lucro: Math.round(profit / 1000) // Convert to thousands for display
        };
      })
    : (props as ROIChartProps).data;

  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
              border: '1px solid #374151',
              color: '#fff'
            }} 
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="ROI" stroke="#22c55e" name="ROI (%)" />
          <Line type="monotone" dataKey="Lucro" stroke="#4169e1" name="Lucro (R$ mil)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ROIChart;
