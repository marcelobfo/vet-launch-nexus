
import React from 'react';
import { BarChart as RechartsBarChart, XAxis, YAxis, Bar, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

// For backward compatibility
interface LegacyConversionChartProps {
  leads: number[];
  conversions: number[];
  months: string[];
}

const ConversionChart: React.FC<ConversionChartProps | LegacyConversionChartProps> = (props) => {
  // Check if we're using the new data prop or legacy props
  const isLegacyProps = 'leads' in props;
  
  // If using legacy props, convert to the format expected by the chart
  const chartData = isLegacyProps 
    ? (props as LegacyConversionChartProps).months.map((month, i) => {
        const leads = (props as LegacyConversionChartProps).leads[i];
        const conversions = (props as LegacyConversionChartProps).conversions[i];
        const conversionRate = leads > 0 ? (conversions / leads) * 100 : 0;
        
        return {
          name: month,
          value: parseFloat(conversionRate.toFixed(1))
        };
      })
    : (props as ConversionChartProps).data;

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
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
          <Bar dataKey="value" name="Taxa de Conversão (%)" fill="#22c55e" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionChart;
