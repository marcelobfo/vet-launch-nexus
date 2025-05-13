
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
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Server configuration error: Missing Supabase credentials" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid request body" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    const { action, email, code, phoneNumber } = body;
    console.log("Requested action:", action, "for email:", email);

    if (action === "request_code") {
      // Ensure required parameters are provided
      if (!email) {
        return new Response(
          JSON.stringify({ success: false, message: "Email is required" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
      }

      // First, create tables directly if they don't exist
      try {
        // Create super_admins table if doesn't exist
        await supabase.sql(`
          CREATE TABLE IF NOT EXISTS public.super_admins (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL, 
            password_hash TEXT NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            last_login TIMESTAMP WITH TIME ZONE
          );
          
          -- Enable RLS
          ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'super_admins' AND policyname = 'Super admins can select super_admins'
            ) THEN
              CREATE POLICY "Super admins can select super_admins" 
              ON public.super_admins FOR SELECT USING (true);
            END IF;
            
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'super_admins' AND policyname = 'Service role can manage super_admins'
            ) THEN
              CREATE POLICY "Service role can manage super_admins" 
              ON public.super_admins FOR ALL TO service_role USING (true);
            END IF;
          END
          $$;
          
          -- Create super_admin_access_codes table
          CREATE TABLE IF NOT EXISTS public.super_admin_access_codes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL,
            code TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            is_used BOOLEAN DEFAULT FALSE
          );
          
          -- Enable RLS
          ALTER TABLE public.super_admin_access_codes ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'super_admin_access_codes' AND policyname = 'Super admins can select access_codes'
            ) THEN
              CREATE POLICY "Super admins can select access_codes" 
              ON public.super_admin_access_codes FOR SELECT USING (true);
            END IF;
            
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'super_admin_access_codes' AND policyname = 'Service role can manage access_codes'
            ) THEN
              CREATE POLICY "Service role can manage access_codes" 
              ON public.super_admin_access_codes FOR ALL TO service_role USING (true);
            END IF;
          END
          $$;
        `);
        console.log("Tables verified/created");
      } catch (tableError) {
        console.error("Error verifying tables:", tableError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Database setup error: ${tableError.message}` 
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        );
      }

      // Check if the email is registered as a super admin
      const { data: superAdmin, error: queryError } = await supabase
        .from("super_admins")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .maybeSingle();
      
      // If the super admin doesn't exist, create it (for specific emails only)
      if (!superAdmin) {
        if (email === "marcelobfo@outlook.com" || email === "contato@technedigial.com.br") {
          const { error: insertError } = await supabase
            .from("super_admins")
            .insert([
              { 
                email: email,
                password_hash: "placeholder_for_first_login",
                is_active: true
              }
            ])
            .select()
            .single();
          
          if (insertError) {
            console.error("Error creating super admin:", insertError);
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Error creating super admin: ${insertError.message}` 
              }),
              { 
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500 
              }
            );
          } else {
            console.log("Created super admin for:", email);
          }
        } else {
          return new Response(
            JSON.stringify({ success: false, message: "Email not registered as Super Admin." }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 404 
            }
          );
        }
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
        console.error("Error storing code:", insertError);
        return new Response(
          JSON.stringify({ success: false, message: `Error storing code: ${insertError.message}` }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        );
      }
      
      // Send the code via WhatsApp if phoneNumber is provided
      if (phoneNumber) {
        try {
          console.log("Sending access code via webhook to", phoneNumber);
          // Use the configured webhook URL for super admin codes
          const webhookUrl = "https://atendimento-creditar-n8n.stpanz.easypanel.host/webhook-test/superadmin";
          
          if (webhookUrl) {
            const response = await fetch(webhookUrl, {
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
              console.log("Access code sent successfully via WhatsApp webhook");
            }
          }
        } catch (webhookError) {
          console.error("Error sending WhatsApp message:", webhookError);
        }
      }
      
      // Always return the code in the response (for simplicity)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Access code generated successfully.",
          devCode: accessCode  // Always include the code for easier testing
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
          JSON.stringify({ success: false, message: "Email and code are required." }),
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
        .maybeSingle();
      
      if (!accessCodeData) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid or expired access code." }),
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
        .maybeSingle();
      
      if (!superAdmin) {
        return new Response(
          JSON.stringify({ success: false, message: "Super Admin not found." }),
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
          message: "Authentication successful.",
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
        JSON.stringify({ success: false, message: "Invalid action." }),
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
        message: `Server error: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
