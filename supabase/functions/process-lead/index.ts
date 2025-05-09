
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { email, name, phone, companyCode, landingPageId, source, customFields } = await req.json();

    if (!email || !companyCode) {
      return new Response(
        JSON.stringify({ error: "Dados incompletos. Email e código da empresa são obrigatórios." }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get company info
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("code", companyCode)
      .single();

    if (companyError || !company) {
      return new Response(
        JSON.stringify({ error: "Empresa não encontrada" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 404,
        }
      );
    }

    // Check if landing page exists
    let landingPage = null;
    if (landingPageId) {
      const { data: page, error: pageError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", landingPageId)
        .eq("company_id", company.id)
        .single();

      if (!pageError) {
        landingPage = page;
      }
    }

    // Store lead in database
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .upsert(
        {
          company_id: company.id,
          email: email,
          name: name || null,
          phone: phone || null,
          landing_page_id: landingPageId || null,
          source: source || "direct",
          custom_fields: customFields || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "company_id,email" }
      )
      .select()
      .single();

    if (leadError) {
      console.error("Error storing lead:", leadError);
      return new Response(
        JSON.stringify({ error: "Erro ao armazenar lead" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
        }
      );
    }

    // Send lead to webhook if configured
    let webhookSent = false;
    try {
      // Use company webhook or landing page specific webhook
      const webhookUrl = (landingPage && landingPage.webhook_url) || 
                         company.webhook_url || 
                         'https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook/vetplataforma';
      
      if (webhookUrl) {
        console.log(`Enviando lead para webhook: ${webhookUrl}`);
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "lead_capture",
            data: {
              lead: {
                email,
                name,
                phone,
                source,
                customFields,
                created_at: new Date().toISOString(),
              },
              company: {
                name: company.name,
                code: company.code,
                id: company.id,
              },
              landing_page: landingPage ? {
                id: landingPage.id,
                title: landingPage.title,
                slug: landingPage.slug,
              } : null,
            },
          }),
        });

        webhookSent = response.ok;
        if (!response.ok) {
          console.error(`Webhook error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (webhookError) {
      console.error("Error sending to webhook:", webhookError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: lead.id,
        webhook_sent: webhookSent,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: `Erro ao processar lead: ${error.message}` }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
