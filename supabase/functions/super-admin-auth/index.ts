
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

  // Create a Supabase client with the service role key (necessary to bypass RLS)
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { action, email, code, phoneNumber } = await req.json();

    if (action === "request_code") {
      // Check if the email is registered as a super admin
      const { data: superAdmin, error: queryError } = await supabase
        .from("super_admins")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();
      
      if (queryError || !superAdmin) {
        return new Response(
          JSON.stringify({ success: false, message: "Email não registrado como Super Admin." }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404 
          }
        );
      }

      // Generate a random 8 character access code
      const accessCode = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                         Math.random().toString(36).substring(2, 6).toUpperCase();
      
      // Set expiration to 30 minutes from now
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);
      
      // Store the access code
      const { error: insertError } = await supabase
        .from("super_admin_access_codes")
        .insert([
          { 
            email,
            code: accessCode,
            expires_at: expiresAt.toISOString(),
            is_used: false
          }
        ]);
      
      if (insertError) {
        throw new Error(`Error storing access code: ${insertError.message}`);
      }
      
      // Send the code via WhatsApp if phoneNumber is provided
      if (phoneNumber) {
        try {
          // Get the company for webhook URL
          const { data: company } = await supabase
            .from("companies")
            .select("whatsapp_webhook_url")
            .limit(1)
            .single();
          
          if (company?.whatsapp_webhook_url) {
            const response = await fetch(company.whatsapp_webhook_url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "super_admin_code",
                data: {
                  phone: phoneNumber,
                  code: accessCode,
                  email: email,
                  timestamp: new Date().toISOString()
                }
              }),
            });
            
            if (!response.ok) {
              console.error("Failed to send WhatsApp message:", await response.text());
            } else {
              console.log("WhatsApp message sent successfully");
            }
          }
        } catch (webhookError) {
          console.error("Error sending WhatsApp message:", webhookError);
        }
      }
      
      // For development environment, return the code
      const isDevelopment = Deno.env.get("ENVIRONMENT") !== "production";
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Código de acesso enviado.",
          ...(isDevelopment ? { devCode: accessCode } : {})
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } 
    else if (action === "verify_code") {
      if (!email || !code) {
        return new Response(
          JSON.stringify({ success: false, message: "Email e código são obrigatórios." }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }
      
      // Verify the access code
      const { data: accessCodeData, error: accessCodeError } = await supabase
        .from("super_admin_access_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("is_used", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (accessCodeError || !accessCodeData) {
        return new Response(
          JSON.stringify({ success: false, message: "Código de acesso inválido ou expirado." }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401 
          }
        );
      }
      
      // Mark the access code as used
      await supabase
        .from("super_admin_access_codes")
        .update({ is_used: true })
        .eq("id", accessCodeData.id);
      
      // Get the super admin data
      const { data: superAdmin, error: superAdminError } = await supabase
        .from("super_admins")
        .select("*")
        .eq("email", email)
        .single();
      
      if (superAdminError || !superAdmin) {
        return new Response(
          JSON.stringify({ success: false, message: "Super Admin não encontrado." }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404 
          }
        );
      }
      
      // Update the last login timestamp
      await supabase
        .from("super_admins")
        .update({ last_login: new Date().toISOString() })
        .eq("id", superAdmin.id);
      
      // Generate session data for the client
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 12); // 12-hour session
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Autenticação bem-sucedida.",
          session: {
            id: superAdmin.id,
            email: superAdmin.email,
            isValid: true,
            expiresAt: expiresAt.toISOString()
          }
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }
    else {
      return new Response(
        JSON.stringify({ success: false, message: "Ação inválida." }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
  } catch (error) {
    console.error("Error in super-admin-auth function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: `Erro no servidor: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
