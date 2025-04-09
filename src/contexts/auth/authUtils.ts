
import { supabase } from '@/integrations/supabase/client';

export const generateCompanyCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getSessionFromLocalStorage = () => {
  const session = localStorage.getItem('session');
  if (session) {
    try {
      return JSON.parse(session);
    } catch (error) {
      console.error('Error parsing session from localStorage:', error);
      return null;
    }
  }
  return null;
};

export const setSessionInLocalStorage = (session: any) => {
  localStorage.setItem('session', JSON.stringify(session));
};

export const clearSessionFromLocalStorage = () => {
  localStorage.removeItem('session');
};
