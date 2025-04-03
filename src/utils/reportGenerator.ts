
import { calculateCampaignPerformance } from './campaignCalculator';

interface CompanyInfo {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

interface Metrics {
  leadCost: number;
  hotLeadConversion: number;
  coldLeadConversion: number;
  landingPageConversion: number;
  campaignConversion: number;
  campaignBudget: number;
  cpc: number;
  ctr: number;
}

export const generateCampaignReport = (companyInfo: CompanyInfo, metrics: Metrics): string => {
  const performance = calculateCampaignPerformance(metrics);
  
  return `
    RELATÓRIO DE CAMPANHA - ${companyInfo.name}
    
    Métricas da Campanha:
    - Custo por Lead: R$ ${metrics.leadCost}
    - Conversão de Leads Quentes: ${metrics.hotLeadConversion}%
    - Conversão de Leads Frios: ${metrics.coldLeadConversion}%
    - Conversão da Landing Page: ${metrics.landingPageConversion}%
    - Conversão da Campanha: ${metrics.campaignConversion}%
    - CPC: R$ ${metrics.cpc}
    - CTR: ${metrics.ctr}%
    - Orçamento da Campanha: R$ ${metrics.campaignBudget}
    
    Resultados Estimados:
    - Total de Leads: ${performance.totalLeads}
    - Leads Quentes: ${performance.hotLeads}
    - Leads Frios: ${performance.coldLeads}
    - Conversões de Leads Quentes: ${performance.hotConversions}
    - Conversões de Leads Frios: ${performance.coldConversions}
    - Total de Conversões: ${performance.totalConversions}
    - Receita Bruta Estimada: R$ ${performance.grossRevenue}
    - ROI: ${performance.roi.toFixed(2)}%
    - Taxa de Conversão Geral: ${performance.conversionRate.toFixed(2)}%
  `;
};

export const downloadReport = (report: string, companyName: string) => {
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio-campanha-${companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
