
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, body, companyId, whatsapp, code } = await req.json();

    if (!to || !subject || !body || !companyId) {
      return new Response(JSON.stringify({ 
        error: 'Parâmetros incompletos'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get company's SMTP settings
    const { data: company, error: companyError } = await supabase
      .from('company_with_users')  // Use the view that includes users
      .select('*')
      .eq('id', companyId)
      .single();
      
    if (companyError || !company || !company.smtp_host) {
      return new Response(JSON.stringify({ 
        error: 'Configurações SMTP não encontradas'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 404
      });
    }

    // Configure SMTP client
    const client = new SmtpClient();
    
    try {
      await client.connectTLS({
        hostname: company.smtp_host,
        port: company.smtp_port || 465,
        username: company.smtp_user,
        password: company.smtp_pass,
        debug: true,
      });
      
      // Send email
      await client.send({
        from: company.smtp_from,
        to: to,
        subject: subject,
        content: body,
        html: body,
      });
      
      await client.close();
    } catch (smtpError) {
      console.error("SMTP Error:", smtpError);
      return new Response(JSON.stringify({ 
        error: `Erro SMTP: ${smtpError.message}`
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      });
    }

    // Se existir uma URL de webhook do WhatsApp e um número de WhatsApp e código, envia o código via webhook do WhatsApp
    // Utilizamos a URL padrão se a empresa não tiver uma configurada
    const whatsappWebhookUrl = company.whatsapp_webhook_url || 'https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook-test/vetplataforma';
    
    if (whatsappWebhookUrl && whatsapp && code) {
      try {
        console.log(`Enviando código de acesso via webhook para ${whatsapp}`);
        const whatsappResponse = await fetch(whatsappWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'access_code',
            data: {
              phone: whatsapp,
              code: code,
              email: to,
              timestamp: new Date().toISOString()
            }
          }),
        });

        if (!whatsappResponse.ok) {
          console.error(`WhatsApp webhook error: ${whatsappResponse.status} ${whatsappResponse.statusText}`);
        } else {
          console.log('Código de acesso enviado com sucesso via webhook WhatsApp');
        }
      } catch (whatsappError) {
        console.error("WhatsApp webhook error:", whatsappError);
        // We don't want to fail the whole request if WhatsApp webhook fails
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email enviado com sucesso'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: `Erro ao enviar email: ${error.message}`
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
})
