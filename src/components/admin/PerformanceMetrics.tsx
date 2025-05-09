
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversionChart from './ConversionChart';
import ROIChart from './ROIChart';

// Define props to match what the component expects
interface PerformanceMetricsProps {
  // Add any props as needed
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = () => {
  const overviewData = {
    leads: 45,
    conversions: 12,
    revenue: 2500,
    visitors: 240
  };

  const monthlyConversionsData = [
    { month: 'Jan', leads: 20, conversions: 4 },
    { month: 'Fev', leads: 30, conversions: 7 },
    { month: 'Mar', leads: 25, conversions: 5 },
    { month: 'Abr', leads: 40, conversions: 9 },
    { month: 'Mai', leads: 45, conversions: 12 },
    { month: 'Jun', leads: 50, conversions: 15 }
  ];

  const roiData = [
    { month: 'Jan', cost: 500, revenue: 800 },
    { month: 'Fev', cost: 600, revenue: 1200 },
    { month: 'Mar', cost: 700, revenue: 1100 },
    { month: 'Abr', cost: 900, revenue: 1600 },
    { month: 'Mai', cost: 1000, revenue: 2500 },
    { month: 'Jun', cost: 1100, revenue: 3000 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Visão geral da performance das suas campanhas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leads Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overviewData.leads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overviewData.conversions}</div>
            <p className="text-xs text-gray-500">{((overviewData.conversions / overviewData.leads) * 100).toFixed(1)}% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {overviewData.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overviewData.visitors}</div>
            <p className="text-xs text-gray-500">{((overviewData.leads / overviewData.visitors) * 100).toFixed(1)}% de conversão</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversions" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="conversions" className="flex-1">Conversões</TabsTrigger>
          <TabsTrigger value="roi" className="flex-1">ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conversão</CardTitle>
              <CardDescription>
                Acompanhe a evolução das conversões de leads ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ConversionChart data={monthlyConversionsData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle>Retorno sobre Investimento</CardTitle>
              <CardDescription>
                Análise de custos e receitas das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ROIChart data={roiData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetrics;
