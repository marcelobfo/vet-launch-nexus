import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { calculateCampaignPerformance } from '@/utils/campaignCalculator';
import PerformanceMetrics from './PerformanceMetrics';
import ConversionChart from './ConversionChart';
import ROIChart from './ROIChart';
import { FileDown, Printer } from "lucide-react";
import { downloadPdfReport } from '@/utils/reportGenerator';

interface ReportPdfViewProps {
  companyInfo: any;
  metrics: any;
}

const ReportPdfView: React.FC<ReportPdfViewProps> = ({ companyInfo, metrics }) => {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Calcula os dados de desempenho e gráficos
  const performance = calculateCampaignPerformance(metrics);
  
  const conversionData = [
    { name: 'Landing Page', value: metrics.landingPageConversion },
    { name: 'Campanha Leads', value: metrics.campaignConversion },
    { name: 'Leads Quentes', value: metrics.hotLeadConversion },
    { name: 'Leads Frios', value: metrics.coldLeadConversion },
  ];
  
  const roiData = [
    { name: 'Atual', ROI: performance.roi, Lucro: performance.grossRevenue / 1000 },
    { name: '+25%', ROI: performance.roi * 1.1, Lucro: (performance.grossRevenue * 1.25) / 1000 },
    { name: '+50%', ROI: performance.roi * 1.15, Lucro: (performance.grossRevenue * 1.5) / 1000 },
    { name: '+75%', ROI: performance.roi * 1.2, Lucro: (performance.grossRevenue * 1.75) / 1000 },
    { name: '+100%', ROI: performance.roi * 1.25, Lucro: (performance.grossRevenue * 2) / 1000 },
  ];
  
  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    
    toast({
      title: "Exportando PDF",
      description: "Gerando relatório em PDF...",
    });
    
    try {
      await downloadPdfReport('pdf-report-container', companyInfo.name);
      
      toast({
        title: "PDF Exportado",
        description: "O relatório foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Add safe guards for all values that might be undefined
  const companyName = companyInfo?.name || "Empresa";
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const leadCost = metrics?.leadCost || 0;
  const cpc = metrics?.cpc || 0;
  const ctr = metrics?.ctr || 0;
  const campaignBudget = metrics?.campaignBudget || 0;
  const productValue = metrics?.productValue || 0;
  const landingPageConversion = metrics?.landingPageConversion || 0;
  const campaignConversion = metrics?.campaignConversion || 0;
  const hotLeadConversion = metrics?.hotLeadConversion || 0;
  const coldLeadConversion = metrics?.coldLeadConversion || 0;
  
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            <span>Exportar Relatório em PDF</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Visualize e baixe o relatório completo da campanha em formato PDF
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button 
              onClick={handleExportPdf} 
              className="bg-vet-accent hover:bg-vet-accent/90"
            >
              <Printer className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
          
          <div 
            id="pdf-report-container" 
            ref={reportRef} 
            className="bg-vet-dark p-6 rounded-lg border border-gray-700"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Relatório de Campanha - {companyName}
              </h2>
              <p className="text-gray-400">
                Gerado em {currentDate}
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Resumo de métricas */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Resumo de Desempenho
                </h3>
                <PerformanceMetrics />
              </div>
              
              {/* Gráfico de Conversão */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Taxas de Conversão
                </h3>
                <ConversionChart data={conversionData} />
              </div>
              
              {/* Gráfico de ROI */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Projeção de ROI
                </h3>
                <ROIChart data={roiData} />
              </div>
              
              {/* Detalhes de Configuração */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Configurações de Campanha
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><span className="text-gray-400">Custo por Lead:</span> R$ {leadCost}</li>
                    <li><span className="text-gray-400">CPC:</span> R$ {cpc}</li>
                    <li><span className="text-gray-400">CTR:</span> {ctr}%</li>
                    <li><span className="text-gray-400">Orçamento:</span> R$ {Number(campaignBudget).toLocaleString()}</li>
                    <li><span className="text-gray-400">Valor do Produto:</span> R$ {Number(productValue).toFixed(2)}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                    Taxas de Conversão
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><span className="text-gray-400">Landing Page:</span> {landingPageConversion}%</li>
                    <li><span className="text-gray-400">Campanha Leads:</span> {campaignConversion}%</li>
                    <li><span className="text-gray-400">Leads Quentes:</span> {hotLeadConversion}%</li>
                    <li><span className="text-gray-400">Leads Frios:</span> {coldLeadConversion}%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPdfView;
