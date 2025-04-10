
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Company } from '@/lib/supabase';
import { AuthState, AuthContextType } from './types';
import { sendMagicLink } from './magicLinkAuth';
import { sendLoginCode, verifyLoginCode as verifyCode } from './accessCodeAuth';
import { register as registerUser } from './registration';
import { getSessionFromLocalStorage, clearSessionFromLocalStorage } from './authUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    company: null,
    isLoading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already authenticated in localStorage
    const checkAuth = async () => {
      const session = getSessionFromLocalStorage();
      
      if (session) {
        try {
          const { user, company } = session;
          
          // Verify if the token is valid by making a quick query to Supabase
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .eq('is_active', true)
            .single();
            
          if (error || !data) {
            // Invalid token or deactivated user, logout
            await signOut();
          } else {
            // Update user data from the session
            setAuthState({
              user: data as User,
              company,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          await signOut();
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();

    // Set up listener for authentication changes in Supabase
    const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        await signOut();
      }
    });

    return () => {
      // Clean up listener when component unmounts
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, companyCode: string) => {
    // Now uses the access code flow by default
    return await sendLoginCode(email, companyCode);
  };

  const signOut = async () => {
    clearSessionFromLocalStorage();
    // Also logout from Supabase Auth
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      company: null,
      isLoading: false
    });
    navigate('/login');
  };

  const verifyLoginCode = async (email: string, code: string, companyCode: string) => {
    const result = await verifyCode(email, code, companyCode);
    
    if (result.success && result.user && result.company) {
      // Save session data
      localStorage.setItem('session', JSON.stringify({
        user: result.user,
        company: result.company
      }));

      // Update authentication state
      setAuthState({
        user: result.user,
        company: result.company as Company,
        isLoading: false
      });
    }
    
    return {
      success: result.success,
      message: result.message
    };
  };

  const register = async (userData: { name: string; email: string; whatsapp: string; companyName: string }) => {
    return await registerUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        sendLoginCode,
        verifyLoginCode,
        sendMagicLink,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
