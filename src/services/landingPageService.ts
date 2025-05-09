
import { supabase } from "@/integrations/supabase/client";
import { LandingPage, LandingPageDB, LandingPageSection } from '@/types';

export const fetchLandingPages = async (companyId: string): Promise<LandingPage[]> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Process the data to ensure correct format
  const formattedPages: LandingPage[] = (data || []).map(page => {
    // Ensure content is in the correct format
    let parsedContent;
    
    if (typeof page.content === 'string') {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (e) {
        parsedContent = { sections: [] };
      }
    } else {
      parsedContent = page.content || { sections: [] };
    }
      
    // Ensure sections exists
    if (!parsedContent.sections) {
      parsedContent.sections = [];
    }
    
    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      company_id: page.company_id,
      content: {
        sections: parsedContent.sections || []
      },
      published: page.published || false,
      template_id: page.template_id || null,
      webhook_url: page.webhook_url || null,
      created_at: page.created_at || new Date().toISOString(),
      updated_at: page.updated_at || new Date().toISOString(),
    };
  });
  
  return formattedPages;
};

export const saveLandingPage = async (
  pageData: LandingPageDB, 
  id?: string
): Promise<void> => {
  if (id) {
    // Update existing page
    const { error } = await supabase
      .from('landing_pages')
      .update({
        ...pageData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } else {
    // Create new page
    const { error } = await supabase
      .from('landing_pages')
      .insert(pageData);

    if (error) throw error;
  }
};

export const deleteLandingPage = async (pageId: string): Promise<void> => {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', pageId);
    
  if (error) throw error;
};

export const duplicateLandingPage = async (
  page: LandingPage, 
  newTitle: string, 
  newSlug: string
): Promise<void> => {
  // Convert the content object to a format acceptable by the database
  const contentValue = typeof page.content === 'string' ? 
    page.content : 
    JSON.stringify(page.content);
  
  const { error } = await supabase
    .from('landing_pages')
    .insert({
      title: newTitle,
      slug: newSlug,
      company_id: page.company_id,
      template_id: page.template_id,
      content: contentValue,
      published: false,
      webhook_url: page.webhook_url,
    });
    
  if (error) throw error;
};

export const togglePagePublishStatus = async (
  page: LandingPage
): Promise<void> => {
  const { error } = await supabase
    .from('landing_pages')
    .update({
      published: !page.published,
      updated_at: new Date().toISOString()
    })
    .eq('id', page.id);
    
  if (error) throw error;
};

// Helper for generating slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};
