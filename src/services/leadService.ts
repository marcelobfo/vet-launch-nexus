
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB } from "@/types";

export const fetchLeadsByCompany = async (companyId: string): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Process the data to ensure the correct format
    const formattedLeads: Lead[] = (data || []).map(lead => {
      // Parse custom_fields if needed
      let customFields: Record<string, any> | null = null;
      
      if (lead.custom_fields) {
        if (typeof lead.custom_fields === 'string') {
          try {
            customFields = JSON.parse(lead.custom_fields);
          } catch (e) {
            customFields = {};
          }
        } else {
          customFields = lead.custom_fields as Record<string, any>;
        }
      }
      
      return {
        id: lead.id,
        company_id: lead.company_id,
        email: lead.email,
        name: lead.name || null,
        phone: lead.phone || null,
        source: lead.source || null,
        landing_page_id: lead.landing_page_id || null,
        tags: lead.tags || null,
        custom_fields: customFields,
        created_at: lead.created_at || new Date().toISOString(),
        updated_at: lead.updated_at || new Date().toISOString(),
      };
    });
    
    return formattedLeads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const fetchLandingPages = async (companyId: string) => {
  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('id, title, slug')
      .eq('company_id', companyId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    throw error;
  }
};

export const addLead = async (leadData: LeadDB) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .upsert({
        ...leadData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'company_id,email' })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding lead:', error);
    throw error;
  }
};

export const deleteLeads = async (leadIds: string[]) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .in('id', leadIds);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting leads:', error);
    throw error;
  }
};
