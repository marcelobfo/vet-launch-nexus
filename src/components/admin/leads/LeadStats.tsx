
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from '@/types';

interface LeadStatsProps {
  leads: Lead[];
}

const LeadStats: React.FC<LeadStatsProps> = ({ leads }) => {
  // Calculate the number of leads added this month
  const leadsThisMonth = leads.filter(lead => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return new Date(lead.created_at) >= firstDay;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{leads.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Leads este mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{leadsThisMonth}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">--</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadStats;
