
-- Drop restrictive policies on audits
DROP POLICY IF EXISTS "Users can create their own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can view their own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can delete their own audits" ON public.audits;

-- Create permissive policies for anonymous access
CREATE POLICY "Allow all select on audits" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Allow all insert on audits" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete on audits" ON public.audits FOR DELETE USING (true);

-- Drop restrictive policies on audit_recommendations
DROP POLICY IF EXISTS "Users can create audit recommendations" ON public.audit_recommendations;
DROP POLICY IF EXISTS "Users can view their audit recommendations" ON public.audit_recommendations;

-- Create permissive policies for anonymous access
CREATE POLICY "Allow all select on audit_recommendations" ON public.audit_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow all insert on audit_recommendations" ON public.audit_recommendations FOR INSERT WITH CHECK (true);

-- Make user_id nullable since we no longer have auth
ALTER TABLE public.audits ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.audits ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
