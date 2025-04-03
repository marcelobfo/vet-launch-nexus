
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

interface PerformanceResult {
  totalLeads: number;
  hotLeads: number;
  coldLeads: number;
  hotConversions: number;
  coldConversions: number;
  totalConversions: number;
  grossRevenue: number;
  roi: number;
  conversionRate: number;
}

export const calculateCampaignPerformance = (metrics: Metrics): PerformanceResult => {
  const { 
    leadCost, 
    hotLeadConversion, 
    coldLeadConversion, 
    campaignBudget,
    productValue
  } = metrics;
  
  const totalLeads = Math.floor(campaignBudget / leadCost);
  const hotLeads = Math.floor(totalLeads * 0.4); // Assuming 40% of leads are hot leads
  const coldLeads = totalLeads - hotLeads;
  
  const hotConversions = Math.floor(hotLeads * (hotLeadConversion / 100));
  const coldConversions = Math.floor(coldLeads * (coldLeadConversion / 100));
  const totalConversions = hotConversions + coldConversions;
  
  // Use the configurable product value instead of fixed value
  const grossRevenue = totalConversions * productValue;
  const roi = ((grossRevenue - campaignBudget) / campaignBudget) * 100;
  
  return {
    totalLeads,
    hotLeads,
    coldLeads,
    hotConversions,
    coldConversions,
    totalConversions,
    grossRevenue,
    roi,
    conversionRate: (totalConversions / totalLeads) * 100
  };
};

// Generate ROI projection data for different budget levels
export const generateROIProjectionData = (metrics: Metrics) => {
  return Array.from({ length: 10 }, (_, i) => {
    const budgetMultiplier = 0.5 + (i * 0.5);
    const budget = metrics.campaignBudget * budgetMultiplier;
    
    // Calculate with adjusted budget
    const adjustedMetrics = { ...metrics, campaignBudget: budget };
    const performance = calculateCampaignPerformance(adjustedMetrics);
    
    const leads = Math.floor(budget / metrics.leadCost);
    const conversions = Math.floor(leads * (performance.conversionRate / 100));
    const revenue = conversions * metrics.productValue;
    const profit = revenue - budget;
    const roi = (profit / budget) * 100;
    
    return {
      name: `R$ ${Math.round(budget / 1000)}k`,
      ROI: Math.round(roi),
      Lucro: Math.round(profit / 1000),
    };
  });
};
