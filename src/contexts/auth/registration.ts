
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

    // Generate an access code for first login
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Store the access code in the database
    await supabase
      .from('access_codes')
      .insert({
        email,
        code,
        company_id: newCompany.id,
        expires_at: expires_at.toISOString(),
        is_used: false
      });

    return { 
      success: true, 
      message: 'Cadastro realizado com sucesso! Um código de acesso foi enviado para seu e-mail.',
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
