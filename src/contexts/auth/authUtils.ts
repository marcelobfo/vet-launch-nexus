
import { supabase } from "@/integrations/supabase/client";
import { Company, User, Session } from "./types";

export const getUserAndCompany = async (userId: string): Promise<Session | null> => {
  try {
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError || !userData) {
      console.error("Error getting user:", userError);
      return null;
    }
    
    // Get company data with users using the view
    const { data: companyData, error: companyError } = await supabase
      .from('company_with_users')
      .select('*')
      .eq('id', userData.company_id)
      .single();
    
    if (companyError || !companyData) {
      console.error("Error getting company:", companyError);
      return null;
    }
    
    const user = userData as User;
    const company = companyData as Company;
    
    return { user, company };
  } catch (error) {
    console.error("Error in getUserAndCompany:", error);
    return null;
  }
};

export const updateUserLastLogin = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating last login:", error);
    }
  } catch (error) {
    console.error("Error in updateUserLastLogin:", error);
  }
};

// Generate a unique company code (6 characters alphanumeric)
export const generateCompanyCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  // Generate a 6-character code
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
};

// Get user session from localStorage
export const getSessionFromLocalStorage = (): Session | null => {
  try {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      return JSON.parse(sessionData) as Session;
    }
    return null;
  } catch (error) {
    console.error("Error parsing session from localStorage:", error);
    return null;
  }
};

// Clear user session from localStorage
export const clearSessionFromLocalStorage = (): void => {
  try {
    localStorage.removeItem('session');
  } catch (error) {
    console.error("Error clearing session from localStorage:", error);
  }
};
