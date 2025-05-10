
import { Json } from '@/types';

// Define the tables that exist in our Supabase database
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
          is_active: boolean;
          smtp_port?: number;
          allow_signup: boolean;
          smtp_host?: string;
          smtp_user?: string;
          smtp_pass?: string;
          smtp_from?: string;
          webhook_url?: string;
          whatsapp_webhook_url?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          whatsapp?: string;
          company_id: string;
          role: string;
          created_at: string;
          is_active: boolean;
          last_login?: string;
          department?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          name?: string;
          phone?: string;
          source?: string;
          landing_page_id?: string;
          tags?: string[];
          custom_fields?: Json;
          created_at: string;
          updated_at: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          subject: string;
          content: string;
          status: string;
          scheduled_for?: string;
          sent_at?: string;
          created_at: string;
          updated_at: string;
        };
      };
      landing_pages: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          slug: string;
          content: Json;
          published: boolean;
          template_id?: string;
          webhook_url?: string;
          created_at: string;
          updated_at: string;
        };
      };
      campaign_leads: {
        Row: {
          id: string;
          campaign_id: string;
          lead_id: string;
          status: string;
          sent_at?: string;
          opened_at?: string;
          clicked_at?: string;
          created_at: string;
          updated_at: string;
        };
      };
      facebook_configs: {
        Row: {
          id: string;
          company_id: string;
          app_id: string;
          app_secret: string;
          access_token: string;
          pixel_id: string;
          ad_account_id: string;
          enable_tracking: boolean;
          advanced_matching: boolean;
          campaign_id?: string;
          is_connected: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      facebook_campaigns: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          status: string;
          objective: string;
          platform: 'facebook' | 'instagram' | 'both';
          start_date: string;
          end_date?: string;
          budget: number;
          spent: number;
          reach: number;
          impressions: number;
          clicks: number;
          conversions: number;
          created_at: string;
        };
      };
      super_admins: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          is_active: boolean;
          created_at: string;
          last_login?: string;
        };
      };
      access_codes: {
        Row: {
          id: string;
          email: string;
          company_id: string;
          code: string;
          created_at: string;
          expires_at: string;
          is_used: boolean;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description?: string;
          company_id: string;
          status: string;
          created_at: string;
          start_date?: string;
          end_date?: string;
          owner_id?: string;
        };
      };
    };
    Views: {
      company_with_users: {
        Row: {
          id?: string;
          name?: string;
          code?: string;
          created_at?: string;
          is_active?: boolean;
          smtp_port?: number;
          allow_signup?: boolean;
          smtp_host?: string;
          smtp_user?: string;
          smtp_pass?: string;
          smtp_from?: string;
          webhook_url?: string;
          whatsapp_webhook_url?: string;
          users?: Json;
        };
      };
    };
  };
}
