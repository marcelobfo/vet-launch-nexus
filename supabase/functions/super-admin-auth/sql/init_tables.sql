
-- Function to create super_admins table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_super_admins_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'super_admins') THEN
    CREATE TABLE public.super_admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      last_login TIMESTAMP WITH TIME ZONE
    );
    
    -- Enable RLS on these tables
    ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for super_admins table
    CREATE POLICY "Super admins can select super_admins" 
    ON public.super_admins FOR SELECT USING (true);
    
    CREATE POLICY "Service role can manage super_admins" 
    ON public.super_admins FOR ALL TO service_role USING (true);
    
    -- Insert the specified user as a super admin
    INSERT INTO public.super_admins (email, password_hash, is_active)
    VALUES ('marcelobfo@outlook.com', 'placeholder_for_first_login', TRUE)
    ON CONFLICT (email) DO NOTHING;
  END IF;
END;
$$;

-- Function to create super_admin_access_codes table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_super_admin_access_codes_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'super_admin_access_codes') THEN
    CREATE TABLE public.super_admin_access_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      is_used BOOLEAN DEFAULT FALSE
    );
    
    -- Enable RLS on these tables
    ALTER TABLE public.super_admin_access_codes ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for super_admin_access_codes table
    CREATE POLICY "Super admins can select access_codes" 
    ON public.super_admin_access_codes FOR SELECT USING (true);
    
    CREATE POLICY "Service role can manage access_codes" 
    ON public.super_admin_access_codes FOR ALL TO service_role USING (true);
  END IF;
END;
$$;
