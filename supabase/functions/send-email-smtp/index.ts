
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  companyId: string;
  whatsapp?: string;
  code?: string;
  companyCode?: string;
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
    console.log("Received email request");
    const { to, subject, body, companyId, whatsapp, code, companyCode } = await req.json() as EmailRequest;
    
    if (!to || !subject || !body || !companyId) {
      console.error("Missing required parameters:", { to, subject, body: body ? "exists" : "missing", companyId });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Get company SMTP settings and WhatsApp webhook from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    console.log("Creating Supabase client");
    // Create a Supabase client
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    // Get company SMTP settings
    console.log("Getting company SMTP settings for company ID:", companyId);
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, whatsapp_webhook_url")
      .eq("id", companyId)
      .single();
    
    if (companyError || !company || !company.smtp_host) {
      console.error("Error getting company SMTP settings:", companyError);
      console.log("Company data:", company);
      return new Response(
        JSON.stringify({ error: "Invalid company or SMTP settings not configured" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404 
        }
      );
    }
    
    // Send WhatsApp message if webhook and phone number are provided
    if (company.whatsapp_webhook_url && whatsapp && (code || companyCode)) {
      try {
        console.log("Sending WhatsApp notification to:", whatsapp);
        
        // Send access code via WhatsApp webhook
        const whatsappResponse = await fetch(company.whatsapp_webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: whatsapp,
            message: code 
              ? `Seu código de acesso para Vet Pro 360: ${code}` 
              : `Código da sua empresa no Vet Pro 360: ${companyCode}`,
            type: code ? "access_code" : "company_code",
            timestamp: new Date().toISOString()
          }),
        });
        
        if (!whatsappResponse.ok) {
          console.error("WhatsApp webhook error:", await whatsappResponse.text());
        } else {
          console.log("WhatsApp notification sent successfully");
        }
      } catch (whatsappError) {
        console.error("Error sending WhatsApp notification:", whatsappError);
        // Don't fail if WhatsApp fails, still try to send email
      }
    }
    
    // Setup SMTP client with company settings
    const client = new SmtpClient();
    
    try {
      console.log("Connecting to SMTP server:", company.smtp_host, "port:", company.smtp_port || 587);
      await client.connectTLS({
        hostname: company.smtp_host,
        port: company.smtp_port || 587,
        username: company.smtp_user,
        password: company.smtp_pass,
      });
      
      console.log("Connected to SMTP server, sending email to:", to, "from:", company.smtp_from);
      
      // Send email
      await client.send({
        from: company.smtp_from,
        to: [to],
        subject: subject,
        content: "text/html", // Explicitly set HTML format
        html: body,
      });
      
      await client.close();
      
      console.log("Email sent successfully to:", to);
      
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } catch (smtpError) {
      console.error("SMTP error:", smtpError);
      return new Response(
        JSON.stringify({ error: `SMTP error: ${smtpError.message}` }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
  } catch (error) {
    console.error("Error in send-email-smtp function:", error);
    return new Response(
      JSON.stringify({ error: `Error sending email: ${error.message}` }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
