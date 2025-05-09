
// Import Json type - no need to import from supabase anymore since we define it below
// Define Json type locally to fix import issues
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

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

// Specific type for database operations with landing pages
export interface LandingPageDB {
  id?: string;
  title: string;
  slug: string;
  content: any; // Change to any to avoid Json type issues
  company_id: string;
  published?: boolean;
  template_id?: string;
  webhook_url?: string | null;
  created_at?: string;
  updated_at?: string;
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

// Specific type for database operations with leads
export interface LeadDB {
  id?: string;
  company_id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  source?: string | null;
  landing_page_id?: string | null;
  tags?: string[] | null;
  custom_fields?: any | null; // Change to any to avoid Json type issues
  created_at?: string;
  updated_at?: string;
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

// Props for admin components
export interface WebhookSettingsProps {
  webhookSettings: {
    url: string;
    autoSend: boolean;
    frequency: "daily" | "weekly" | "monthly";
    registrationWebhookUrl: string;
    whatsappWebhookUrl: string;
    smtpSettings: {
      host: string;
      port: number;
      user: string;
      password: string;
      fromEmail: string;
      fromName: string;
    };
  };
  companyInfo: Record<string, any>;
  metrics: Record<string, any>;
  setWebhookSettings: (settings: any) => void;
}

export interface SecuritySettingsProps {
  securitySettings: {
    passwordProtection: boolean;
    adminPassword: string;
  };
  setSecuritySettings: (settings: any) => void;
}

export interface Company {
  id: string;
  name: string;
  code: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}
