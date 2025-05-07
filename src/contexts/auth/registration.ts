
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
        is_active: true,
        // Default SMTP settings are not set here anymore, relying on Supabase Edge Functions
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
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email,
        name,
        whatsapp,
        company_id: newCompany.id,
        role: 'admin', // Admin role
        is_active: true
      })
      .select();

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

    // Send email via Supabase Edge Function
    try {
      await supabase.functions.invoke('send-email-smtp', {
        body: {
          to: email,
          subject: 'Bem-vindo ao Gerenciador de Lançamentos - Seu Código de Acesso',
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #4f46e5; text-align: center;">Gerenciador de Lançamentos</h2>
              <h3 style="text-align: center;">Bem-vindo(a) ao Gerenciador de Lançamentos!</h3>
              <p>Sua empresa "${companyName}" foi registrada com sucesso.</p>
              <p>Código da empresa: <strong>${companyCode}</strong></p>
              <p>Use o código abaixo para fazer seu primeiro acesso:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                <p style="font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 3px; color: #374151;">
                  ${code}
                </p>
              </div>
              <p>Este código é válido por 24 horas. Guarde o código da sua empresa para futuros acessos.</p>
              <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Gerenciador de Lançamentos. Todos os direitos reservados.</p>
              </div>
            </div>
          `,
          companyId: newCompany.id,
          whatsapp: whatsapp,
          code: code,
          companyCode: companyCode
        }
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't fail registration if email fails
    }

    // Send data directly to webhook
    try {
      // URL do webhook para cadastro
      const webhookUrl = 'https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook/vetplataforma';
      
      if (webhookUrl) {
        console.log(`Enviando dados de registro para webhook: ${webhookUrl}`);
        
        const webhookData = {
          type: 'new_company_registration',
          data: {
            company: {
              name: companyName,
              code: companyCode,
              id: newCompany.id,
              created_at: new Date().toISOString()
            },
            user: {
              name,
              email,
              whatsapp,
              role: 'admin'
            },
            access_code: code,
            timestamp: new Date().toISOString()
          }
        };
        
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        if (!webhookResponse.ok) {
          throw new Error(`${webhookResponse.status} ${webhookResponse.statusText}`);
        } else {
          console.log('Dados de registro enviados com sucesso via webhook');
        }
      }
    } catch (webhookError) {
      console.error("Error sending registration to webhook:", webhookError);
      // Don't fail registration if webhook fails
    }

    return { 
      success: true, 
      message: 'Cadastro realizado com sucesso! Um código de acesso foi enviado para seu e-mail e WhatsApp.',
      companyCode: companyCode,
      code: code // Return code for testing when SMTP is not configured
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.'
    };
  }
};
