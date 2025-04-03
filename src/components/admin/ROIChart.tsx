
import React from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';

interface ROIChartProps {
  data: Array<{
    name: string;
    ROI: number;
    Lucro: number;
  }>;
}

const ROIChart: React.FC<ROIChartProps> = ({ data }) => {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
