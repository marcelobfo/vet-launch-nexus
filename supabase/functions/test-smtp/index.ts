
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { config, to, subject, text } = await req.json() as TestSmtpRequestBody;
    
    if (!config || !to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Parâmetros incompletos" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Log the request for debugging
    console.log("SMTP test request:", { host: config.host, port: config.port, to, subject });
    
    try {
      // Configurar cliente SMTP
      const client = new SmtpClient();
      
      await client.connectTLS({
        hostname: config.host,
        port: config.port,
        username: config.user,
        password: config.pass,
        auth: {
          username: config.user,
          password: config.pass,
        },
      });
      
      // Enviar email de teste
      const result = await client.send({
        from: config.from,
        to: to,
        subject: subject,
        content: text,
      });
      
      await client.close();
      
      console.log("Email sent successfully:", result);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Teste de email enviado com sucesso" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } catch (smtpError) {
      console.error("SMTP client error:", smtpError);
      throw new Error(`Erro no cliente SMTP: ${smtpError.message}`);
    }
  } catch (error) {
    console.error("Error in test-smtp function:", error);
    return new Response(
      JSON.stringify({ 
        error: `Erro ao testar SMTP: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
