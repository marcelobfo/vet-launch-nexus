
import { supabase } from '@/integrations/supabase/client';
import { generateCompanyCode } from './authUtils';

export const register = async (userData: { name: string; email: string; whatsapp: string; companyName: string }) => {
  try {
    const { name, email, whatsapp, companyName } = userData;
    
    // Check if the email is already registered in any company
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, company:companies!inner(name, code)')
      .eq('email', email)
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      return {
        success: false,
        message: `Este e-mail já está cadastrado na empresa ${existingUser[0].company.name}.`
      };
    }

    // Generate unique code for the company
    const companyCode = generateCompanyCode();
    
    // Register the company
    const { data: newCompany, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        code: companyCode,
        allow_signup: true,
        is_active: true
      })
      .select()
      .single();

    if (companyError) {
      console.error("Error creating company:", companyError);
      return { 
        success: false, 
        message: 'Não foi possível criar a empresa. Tente novamente ou contate o suporte.'
      };
    }

    // Register the user as company admin
    const { error: createError } = await supabase
      .from('users')
      .insert({
        email,
        name,
        whatsapp,
        company_id: newCompany.id,
        role: 'admin', // Admin role
        is_active: true
      });

    if (createError) {
      console.error("Error creating user:", createError);
      // If creating the user fails, remove the created company
      await supabase
        .from('companies')
        .delete()
        .eq('id', newCompany.id);
        
      return { 
        success: false, 
        message: 'Não foi possível criar seu cadastro. Tente novamente ou contate o suporte.'
      };
    }

    // Send magic link for first access
    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          company_id: newCompany.id,
          company_code: companyCode
        }
      }
    });

    if (magicLinkError) {
      console.error("Error sending magic link:", magicLinkError);
    }

    return { 
      success: true, 
      message: 'Cadastro realizado com sucesso! Verifique seu e-mail para acessar o sistema.',
      companyCode
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.'
    };
  }
};
