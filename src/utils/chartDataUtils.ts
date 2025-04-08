
/**
 * Utility functions for generating chart data
 */

// Generate ROI chart data from revenue and cost arrays
export const generateROIChartData = (revenue: number[], cost: number[], months: string[]) => {
  return months.map((month, i) => {
    const monthlyRevenue = revenue[i] || 0;
    const monthlyCost = cost[i] || 0;
    const profit = monthlyRevenue - monthlyCost;
    const roi = monthlyCost > 0 ? ((profit / monthlyCost) * 100) : 0;
    
    return {
      name: month,
      ROI: Math.round(roi),
      Lucro: Math.round(profit / 1000), // Convert to thousands for display
    };
  });
};

// Generate conversion rate chart data from leads and conversions
export const generateConversionChartData = (leads: number[], conversions: number[], months: string[]) => {
  return months.map((month, i) => {
    const monthlyLeads = leads[i] || 0;
    const monthlyConversions = conversions[i] || 0;
    const conversionRate = monthlyLeads > 0 ? (monthlyConversions / monthlyLeads) * 100 : 0;
    
    return {
      name: month,
      value: parseFloat(conversionRate.toFixed(1)),
    };
  });
};

// Calculate performance metrics from time series data
export const calculatePerformanceMetrics = (
  monthlyLeads: number[], 
  monthlyConversions: number[],
  revenue: number[],
  marketingCost: number[]
) => {
  const totalLeads = monthlyLeads.reduce((sum, val) => sum + val, 0);
  const totalConversions = monthlyConversions.reduce((sum, val) => sum + val, 0);
  const grossRevenue = revenue.reduce((sum, val) => sum + val, 0);
  const totalCost = marketingCost.reduce((sum, val) => sum + val, 0);
  
  return {
    totalLeads,
    hotLeads: Math.floor(totalLeads * 0.4), // Assuming 40% hot leads
    coldLeads: Math.floor(totalLeads * 0.6), // Assuming 60% cold leads
    hotConversions: Math.floor(totalConversions * 0.7), // Assuming 70% from hot leads
    coldConversions: Math.floor(totalConversions * 0.3), // Assuming 30% from cold leads
    totalConversions,
    grossRevenue,
    roi: totalCost > 0 ? ((grossRevenue - totalCost) / totalCost) * 100 : 0,
    conversionRate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
  };
};
