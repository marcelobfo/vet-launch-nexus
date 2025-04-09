
import { User, Company } from '@/lib/supabase';

export interface AuthState {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  sendLoginCode: (email: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  verifyLoginCode: (email: string, code: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  sendMagicLink: (email: string, companyCode: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; email: string; whatsapp: string; companyName: string }) => Promise<{ success: boolean; message?: string; companyCode?: string }>;
}

export interface LoginCodePayload {
  email: string;
  companyCode: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
  companyCode: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  whatsapp: string;
  companyName: string;
}
