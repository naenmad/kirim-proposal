-- Add missing columns to companies table for user tracking and message tracking
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS whatsapp_sent_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS whatsapp_sent_by_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_sent_by_phone TEXT,
ADD COLUMN IF NOT EXISTS email_sent_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS email_sent_by_name TEXT,
ADD COLUMN IF NOT EXISTS email_sent_by_phone TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS created_by_name TEXT;

-- Create indexes for better performance on filtering
CREATE INDEX IF NOT EXISTS companies_created_by_idx ON public.companies(created_by);
CREATE INDEX IF NOT EXISTS companies_whatsapp_sent_by_idx ON public.companies(whatsapp_sent_by);
CREATE INDEX IF NOT EXISTS companies_email_sent_by_idx ON public.companies(email_sent_by);

-- Update RLS policies if needed
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see all companies (as per current behavior)
DROP POLICY IF EXISTS "Users can view all companies" ON public.companies;
CREATE POLICY "Users can view all companies" ON public.companies
    FOR SELECT USING (true);

-- Policy to allow users to insert companies
DROP POLICY IF EXISTS "Users can insert companies" ON public.companies;
CREATE POLICY "Users can insert companies" ON public.companies
    FOR INSERT WITH CHECK (true);

-- Policy to allow users to update companies
DROP POLICY IF EXISTS "Users can update companies" ON public.companies;
CREATE POLICY "Users can update companies" ON public.companies
    FOR UPDATE USING (true);

-- Policy to allow users to delete companies
DROP POLICY IF EXISTS "Users can delete companies" ON public.companies;
CREATE POLICY "Users can delete companies" ON public.companies
    FOR DELETE USING (true);
