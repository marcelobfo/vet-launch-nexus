
-- Create super_admins table
CREATE TABLE IF NOT EXISTS public.super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create super_admin_access_codes table for OTP login
CREATE TABLE IF NOT EXISTS public.super_admin_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT REFERENCES super_admins(email) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE
);

-- Insert the specified user as a super admin (default password hash that will be replaced on first login)
INSERT INTO public.super_admins (email, password_hash, is_active)
VALUES ('marcelobfo@outlook.com', 'placeholder_for_first_login', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Enable RLS on these tables
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_access_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for super_admins table
CREATE POLICY "Super admins can select super_admins" 
ON public.super_admins FOR SELECT USING (true);

CREATE POLICY "Service role can manage super_admins" 
ON public.super_admins FOR ALL TO service_role USING (true);

-- Create policies for super_admin_access_codes table
CREATE POLICY "Super admins can select access_codes" 
ON public.super_admin_access_codes FOR SELECT USING (true);

CREATE POLICY "Service role can manage access_codes" 
ON public.super_admin_access_codes FOR ALL TO service_role USING (true);
