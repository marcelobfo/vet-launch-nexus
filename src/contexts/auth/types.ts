
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  whatsapp?: string;
  company_id: string;
  is_active?: boolean;
  created_at?: string;
  department?: string;
  last_login?: string;
};

export type Company = {
  id: string;
  name: string;
  code: string;
  is_active?: boolean;
  created_at?: string;
  allow_signup?: boolean;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_from?: string;
  webhook_url?: string;
  whatsapp_webhook_url?: string;
  users?: User[];
};

export type Session = {
  user: User;
  company: Company;
};
