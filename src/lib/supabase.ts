
import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase com as chaves de ambiente
// Essas variáveis devem ser configuradas nas configurações do projeto Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltam variáveis de ambiente do Supabase. Certifique-se de conectar o projeto ao Supabase.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
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
