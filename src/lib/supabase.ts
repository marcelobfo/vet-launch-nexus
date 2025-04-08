
// This file is deprecated. Please use the official client at @/integrations/supabase/client
import { createClient } from '@supabase/supabase-js';

// Supabase client instance
export const supabase = createClient(
  "https://opipazvvefdcdyywybpm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waXBhenZ2ZWZkY2R5eXd5YnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzU2OTQsImV4cCI6MjA1OTY1MTY5NH0.VlI8VCi4kIPL1inCSH90RsLNZ1j1IZlEuvOlW869L-8",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'vetpro360-auth-token',
      storage: localStorage
    }
  }
);

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

// Extend the Database interface to include table definitions
declare global {
  type Database = {
    public: {
      Tables: {
        companies: {
          Row: Company;
          Insert: Omit<Company, 'id' | 'created_at'>;
          Update: Partial<Omit<Company, 'id' | 'created_at'>>;
        };
        users: {
          Row: User;
          Insert: Omit<User, 'id' | 'created_at'>;
          Update: Partial<Omit<User, 'id' | 'created_at'>>;
        };
        projects: {
          Row: Project;
          Insert: Omit<Project, 'id' | 'created_at'>;
          Update: Partial<Omit<Project, 'id' | 'created_at'>>;
        };
        access_codes: {
          Row: AccessCode;
          Insert: Omit<AccessCode, 'id' | 'created_at'>;
          Update: Partial<Omit<AccessCode, 'id' | 'created_at'>>;
        };
      };
      Views: {};
      Functions: {};
      Enums: {};
    };
  }
}

// Now we'll update the supabase/config.toml file to configure our edge functions
<lov-write file_path="supabase/config.toml">
project_id = "opipazvvefdcdyywybpm"

[functions.test-smtp]
verify_jwt = false

[functions.send-email]
verify_jwt = false
