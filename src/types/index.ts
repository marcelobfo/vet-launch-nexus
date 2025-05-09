
// Tipos para landing pages
export interface LandingPageSection {
  type: string;
  content: Record<string, any>;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  content: {
    sections: LandingPageSection[];
  };
  company_id: string;
  published: boolean;
  template_id?: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

// Tipo para leads
export interface Lead {
  id: string;
  company_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  landing_page_id: string | null;
  tags: string[] | null;
  custom_fields: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// Tipo para campanhas
export interface Campaign {
  id: string;
  company_id: string;
  name: string;
  subject: string;
  content: string;
  status: string;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

// Tipo para campanhas de leads
export interface CampaignLead {
  id: string;
  campaign_id: string;
  lead_id: string;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
  updated_at: string;
}
