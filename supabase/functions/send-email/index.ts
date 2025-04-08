
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailRequestBody {
  to: string;
  subject: string;
  body: string;
  companyId: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, body, companyId } = await req.json() as EmailRequestBody;
    
    if (!to || !subject || !body || !companyId) {
      return new Response(JSON.stringify({ 
        error: 'Parâmetros incompletos'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log("Fetching SMTP settings for company:", companyId);
    
    // Fetch SMTP settings for the company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from')
      .eq('id', companyId)
      .single();
      
    if (companyError || !company || !company.smtp_host) {
      console.error("Error fetching company SMTP settings:", companyError);
      return new Response(JSON.stringify({ 
        error: 'Configurações SMTP não encontradas'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }
    
    console.log("SMTP settings found, connecting to:", company.smtp_host);
    
    // Configure SMTP client
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: company.smtp_host,
      port: company.smtp_port || 587,
      username: company.smtp_user,
      password: company.smtp_pass,
    });
    
    // Send email
    await client.send({
      from: company.smtp_from,
      to: to,
      subject: subject,
      content: body,
    });
    
    await client.close();
    
    console.log("Email sent successfully to:", to);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email enviado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ 
      error: `Erro ao enviar email: ${error.message}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
