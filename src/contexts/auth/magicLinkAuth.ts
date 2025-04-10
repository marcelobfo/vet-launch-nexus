
import { supabase } from '@/integrations/supabase/client';

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
      console.error("Company not found:", companyError);
      return { 
        success: false, 
        message: 'Empresa não encontrada ou inativa.' 
      };
    }
    
    // Generate an access code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Store the access code in the database
    const { error: codeError } = await supabase
      .from('access_codes')
      .insert({
        email,
        code,
        company_id: companyData.id,
        expires_at: expires_at.toISOString(),
        is_used: false
      });
    
    if (codeError) {
      console.error("Error creating access code:", codeError);
      return { 
        success: false, 
        message: 'Não foi possível gerar o código de acesso. Tente novamente.' 
      };
    }

    // Send the access code via email
    if (companyData.smtp_host) {
      try {
        const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-email-smtp', {
          body: {
            to: email,
            subject: 'Código de Acesso - Vet Pro 360',
            body: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">Vet Pro 360</h2>
                <h3 style="text-align: center;">Seu código de acesso</h3>
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                  <p style="font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 3px; color: #374151;">
                    ${code}
                  </p>
                </div>
                <p>Este código é válido por 24 horas. Utilize-o para acessar a plataforma Vet Pro 360.</p>
                <p>Se você não solicitou este código, por favor, ignore este e-mail.</p>
                <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} Vet Pro 360. Todos os direitos reservados.</p>
                </div>
              </div>
            `,
            companyId: companyData.id
          }
        });

        if (emailError) {
          console.error("Error sending email:", emailError);
          return { 
            success: false, 
            message: 'Não foi possível enviar o código por e-mail. Verifique as configurações SMTP.' 
          };
        }

        return { 
          success: true, 
          message: `Código de acesso enviado para ${email}.`
        };
      } catch (error) {
        console.error("Error invoking email function:", error);
        return { 
          success: false, 
          message: 'Erro ao enviar e-mail. Verifique as configurações SMTP da empresa.' 
        };
      }
    } else {
      // No SMTP configured, can't send email
      return { 
        success: true, 
        message: `Código gerado com sucesso, mas não foi possível enviar por e-mail. Configure o SMTP da empresa.`,
        code: code // Return code for testing purposes when SMTP is not configured
      };
    }
  } catch (error) {
    console.error("Error sending magic link:", error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao processar sua solicitação.' 
    };
  }
};
