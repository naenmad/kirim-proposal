-- Simple SQL untuk development - jalankan di Supabase SQL Editor
-- Langkah 1: Buat table profiles jika belum ada
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone_number TEXT DEFAULT '',
    jabatan TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Langkah 2: Tambah kolom yang diperlukan ke table companies (jika belum ada)
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS whatsapp_sent_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS whatsapp_sent_by_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_sent_by_phone TEXT,
ADD COLUMN IF NOT EXISTS email_sent_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS email_sent_by_name TEXT,
ADD COLUMN IF NOT EXISTS email_sent_by_phone TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS created_by_name TEXT;

-- Langkah 3: Set up RLS (Row Level Security) untuk profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies untuk profiles (biarkan semua user bisa akses untuk development)
DROP POLICY IF EXISTS "Enable all for profiles" ON public.profiles;
CREATE POLICY "Enable all for profiles" ON public.profiles FOR ALL USING (true);

-- Policies untuk companies (biarkan semua user bisa akses untuk development)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for companies" ON public.companies;
CREATE POLICY "Enable all for companies" ON public.companies FOR ALL USING (true);

-- Langkah 4: Buat function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update profiles.updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
