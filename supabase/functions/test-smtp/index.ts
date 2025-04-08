
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
}

interface TestSmtpRequestBody {
  config: SmtpConfig;
  to: string;
  subject: string;
  text: string;
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
    const { config, to, subject, text } = await req.json() as TestSmtpRequestBody;
    
    if (!config || !to || !subject || !text) {
      return new Response(JSON.stringify({ 
        error: 'Parâmetros incompletos'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    console.log("Testing SMTP connection to:", config.host);
    
    // Configure and test SMTP client
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: config.host,
      port: config.port,
      username: config.user,
      password: config.pass,
    });
    
    // Send test email
    await client.send({
      from: config.from,
      to: to,
      subject: subject,
      content: text,
    });
    
    await client.close();
    
    console.log("SMTP test successful");
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Teste de email enviado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("SMTP test error:", error);
    return new Response(JSON.stringify({ 
      error: `Erro ao testar SMTP: ${error.message}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
