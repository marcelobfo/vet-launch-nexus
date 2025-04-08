
// This file is deprecated. Please use the official client at @/integrations/supabase/client
import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client from the official location
export { supabase };

// Types for Supabase tables
export type Company = {
  id: string;
  name: string;
  code: string;
  created_at: string;
  is_active: boolean;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_from?: string;
  webhook_url?: string;
  allow_signup?: boolean;
};

export type User = {
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

export type Project = {
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

export type AccessCode = {
  id: string;
  email: string;
  company_id: string;
  code: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
};
