
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
// These variables must be configured in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client if real credentials aren't available
const isMockClient = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isMockClient) {
  console.warn(
    'Supabase credentials are missing. The application is running with a mock client.\n' +
    'Please connect your project to Supabase by clicking the green Supabase button in the top right corner.\n' +
    'Then set your Supabase URL and anon key in the environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a warning to Supabase client methods if using mock client
if (isMockClient) {
  const mockWarning = () => {
    console.warn('Attempted to use Supabase client without proper configuration. Connect to Supabase first.');
    return Promise.resolve({ data: null, error: { message: 'No Supabase connection' } });
  };
  
  // Override methods to prevent runtime errors but show warnings
  const methods = ['from', 'rpc', 'auth', 'storage', 'functions'];
  methods.forEach(method => {
    if (typeof supabase[method] === 'function') {
      const original = supabase[method];
      supabase[method] = (...args) => {
        console.warn(`Supabase ${method} called without proper configuration`);
        return original.apply(supabase, args);
      };
    }
  });
}

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
