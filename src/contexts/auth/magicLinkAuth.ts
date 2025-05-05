
import { supabase } from '@/integrations/supabase/client';

// Generate a random access code
const generateAccessCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Send a magic link email (now sends an access code)
export const sendMagicLink = async (email: string, companyCode: string) => {
  try {
    // Find the company by code
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('code', companyCode)
      .eq('is_active', true)
      .single();
    
    if (companyError || !companyData) {
      console.error("Company not found:", companyCode, companyError);
      return { 
        success: false, 
        message: 'Empresa não encontrada ou inativa.' 
      };
    }
    
    // Check if user exists in the specified company
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('company_id', companyData.id)
      .eq('is_active', true)
      .single();
    
    // If user doesn't exist and company doesn't allow signup, return error
    if (userError && !companyData.allow_signup) {
      console.error("User not found and signup not allowed:", userError);
      return { 
        success: false, 
        message: 'Usuário não encontrado para esta empresa. Contate o administrador para obter acesso.' 
      };
    }
    
    // Generate an access code
    const code = generateAccessCode();
    const expires_at = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // Store the access code in the database
    const { error: insertError } = await supabase
      .from('access_codes')
      .insert({
        email,
        code,
        company_id: companyData.id,
        expires_at: expires_at.toISOString(),
        is_used: false
      });
    
    if (insertError) {
      console.error("Error creating access code:", insertError);
      return { 
        success: false, 
        message: 'Não foi possível criar um código de acesso.' 
      };
    }
    
    // Get user's whatsapp number if the user exists
    const whatsapp = userData?.whatsapp || '';
    
    // Use Supabase Edge Function to send email
    try {
      await supabase.functions.invoke('send-email-smtp', {
        body: {
          to: email,
          subject: 'Seu Código de Acesso - Vet Pro 360',
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #4f46e5; text-align: center;">Vet Pro 360</h2>
              <h3 style="text-align: center;">Seu Código de Acesso</h3>
              <p>Use o código abaixo para acessar o sistema:</p>
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                <p style="font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 3px; color: #374151;">
                  ${code}
                </p>
              </div>
              <p>Este código é válido por 30 minutos.</p>
              <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Vet Pro 360. Todos os direitos reservados.</p>
              </div>
            </div>
          `,
          companyId: companyData.id,
          whatsapp: whatsapp,
          code: code
        }
      });
    } catch (emailError) {
      console.error("Error sending email via Supabase function:", emailError);
      // Continue even if email fails, we'll try the webhook
    }

    // Send login request directly to webhook
    try {
      // Get webhook URL - use default if company doesn't have one
      const webhookUrl = companyData.webhook_url || 'https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook-test/vetplataforma';
      
      if (webhookUrl) {
        console.log(`Enviando solicitação de login para webhook: ${webhookUrl}`);
        
        const webhookData = {
          type: 'login_code_request',
          data: {
            company: {
              name: companyData.name,
              code: companyData.code,
              id: companyData.id
            },
            user: {
              email,
              whatsapp
            },
            access_code: code,
            timestamp: new Date().toISOString()
          }
        };
        
        // Envio direto via fetch para o webhook
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
          console.log('Solicitação de login enviada com sucesso via webhook');
        }
      }
    } catch (webhookError) {
      console.error("Error sending login request to webhook:", webhookError);
      // Continue even if webhook fails
    }
    
    // Return success with message
    return {
      success: true,
      message: `Um código de acesso foi enviado para ${email}.`,
      code: process.env.NODE_ENV === 'development' ? code : undefined, // Return code only in development
    };
  } catch (error) {
    console.error("Error in sendMagicLink:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.' 
    };
  }
};
