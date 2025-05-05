
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

export type AuthState = {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
};

export type AuthContextType = AuthState & {
  signIn: (email: string, companyCode: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  sendLoginCode: (email: string, companyCode: string) => Promise<{ success: boolean; message: string }>;
  verifyLoginCode: (email: string, code: string, companyCode: string) => Promise<{ success: boolean; message: string }>;
  sendMagicLink: (email: string, companyCode: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: { name: string; email: string; whatsapp: string; companyName: string }) => Promise<{ success: boolean; message: string; companyCode?: string; code?: string }>;
};
