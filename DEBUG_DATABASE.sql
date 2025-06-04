-- SQL untuk debugging dan perbaikan database
-- Jalankan ini di Supabase SQL Editor

-- 1. CEK APAKAH TABLE PROFILES ADA
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. CEK USER YANG SUDAH TERDAFTAR
SELECT id, email, email_confirmed_at, created_at, user_metadata
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. CEK DATA DI TABLE PROFILES
SELECT * FROM public.profiles;

-- 4. CEK RLS POLICIES
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. PERBAIKAN UNTUK DEVELOPMENT - HAPUS RLS YANG KETAT
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 6. BUAT POLICY DEVELOPMENT YANG BEBAS
CREATE POLICY "Enable all for profiles development" ON public.profiles
FOR ALL USING (true) WITH CHECK (true);

-- 7. PASTIKAN TABLE PROFILES ADA DENGAN STRUKTUR YANG BENAR
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone_number TEXT DEFAULT '',
    jabatan TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CEK APAKAH ADA USER YANG PERLU DIBUATKAN PROFILE
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.user_metadata,
    p.id as profile_exists
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL
AND p.id IS NULL;
