
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

    // Get company's info
    const { data: company, error: companyError } = await supabase
      .from('company_with_users')  // Use the view that includes users
      .select('*')
      .eq('id', companyId)
      .single();
      
    if (companyError || !company) {
      return new Response(JSON.stringify({ 
        error: 'Empresa não encontrada'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 404
      });
    }

    let emailSent = false;
    
    // Attempt to send email via SMTP if configured
    if (company.smtp_host) {
      try {
        // Configure SMTP client
        const client = new SmtpClient();
        
        await client.connectTLS({
          hostname: company.smtp_host,
          port: company.smtp_port || 465,
          username: company.smtp_user,
          password: company.smtp_pass,
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
        emailSent = true;
        console.log("Email enviado com sucesso via SMTP");
      } catch (smtpError) {
        console.error("SMTP Error:", smtpError);
        // Continue with webhook if SMTP fails
      }
    }

    // Sempre tenta enviar para o webhook do WhatsApp, independente do SMTP ter funcionado
    let whatsappSent = false;
    try {
      // Usar o URL correto do webhook para códigos de acesso
      const webhookUrl = 'https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook/vetplataformalog';
      
      if (webhookUrl && whatsapp && code) {
        console.log(`Enviando código de acesso via webhook para ${whatsapp}`);
        
        const webhookResponse = await fetch(webhookUrl, {
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

        if (!webhookResponse.ok) {
          throw new Error(`Status: ${webhookResponse.status} ${webhookResponse.statusText}`);
        } else {
          whatsappSent = true;
          console.log('Código de acesso enviado com sucesso via webhook WhatsApp');
        }
      }
    } catch (whatsappError) {
      console.error("WhatsApp webhook error:", whatsappError);
      // We don't fail the whole request if WhatsApp webhook fails
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      email_sent: emailSent,
      whatsapp_sent: whatsappSent,
      message: 'Operação concluída'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: `Erro ao processar operação: ${error.message}`
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
})
