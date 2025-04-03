
import { calculateCampaignPerformance } from './campaignCalculator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  productValue: number;
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
    - Valor do Produto/Ticket: R$ ${metrics.productValue.toFixed(2)}
    
    Resultados Estimados:
    - Total de Leads: ${performance.totalLeads}
    - Leads Quentes: ${performance.hotLeads}
    - Leads Frios: ${performance.coldLeads}
    - Conversões de Leads Quentes: ${performance.hotConversions}
    - Conversões de Leads Frios: ${performance.coldConversions}
    - Total de Conversões: ${performance.totalConversions}
    - Receita Bruta Estimada: R$ ${performance.grossRevenue.toFixed(2)}
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

export const downloadPdfReport = async (reportContainerId: string, companyName: string) => {
  // Cria um contenedor temporário para renderizar o relatório
  const reportContainer = document.getElementById(reportContainerId);
  
  if (!reportContainer) {
    console.error('Container do relatório não encontrado');
    return;
  }
  
  try {
    // Cria o PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    // Captura o elemento como imagem
    const canvas = await html2canvas(reportContainer, {
      scale: 2, // Qualidade melhor
      useCORS: true,
      logging: false
    });
    
    // Converte canvas para imagem
    const imgData = canvas.toDataURL('image/png');
    
    // Calcula a proporção para manter o aspecto da imagem
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Se a imagem for maior que a página, divida em várias páginas
    let heightLeft = imgHeight;
    let position = 0;
    
    // Adiciona primeira página
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);
    position = margin - (pageHeight - margin * 2);
    
    // Adiciona páginas adicionais se necessário
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
      position -= (pageHeight - margin * 2);
    }
    
    // Salva o PDF
    pdf.save(`relatorio-campanha-${companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
  }
};

// Função para enviar relatório para webhook
export const sendReportToWebhook = async (
  webhookUrl: string, 
  companyInfo: CompanyInfo, 
  metrics: Metrics,
  includePdf: boolean = false
) => {
  if (!webhookUrl) return false;
  
  try {
    const performance = calculateCampaignPerformance(metrics);
    const reportData = {
      company: companyInfo.name,
      timestamp: new Date().toISOString(),
      metrics: {
        leadCost: metrics.leadCost,
        hotLeadConversion: metrics.hotLeadConversion,
        coldLeadConversion: metrics.coldLeadConversion,
        landingPageConversion: metrics.landingPageConversion,
        campaignConversion: metrics.campaignConversion,
        campaignBudget: metrics.campaignBudget,
        cpc: metrics.cpc,
        ctr: metrics.ctr,
        productValue: metrics.productValue
      },
      results: {
        totalLeads: performance.totalLeads,
        hotLeads: performance.hotLeads,
        coldLeads: performance.coldLeads,
        totalConversions: performance.totalConversions,
        grossRevenue: performance.grossRevenue,
        roi: performance.roi.toFixed(2),
        conversionRate: performance.conversionRate.toFixed(2)
      }
    };
    
    // Se includePdf for true, precisaríamos gerar o PDF e enviá-lo
    // Isso exigiria uma API de backend para processar, o que está fora do escopo atual
    
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar relatório para webhook:", error);
    return false;
  }
};
