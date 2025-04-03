
import React from 'react';
import { BarChart as RechartsBarChart, XAxis, YAxis, Bar, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const ConversionChart: React.FC<ConversionChartProps> = ({ data }) => {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
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
