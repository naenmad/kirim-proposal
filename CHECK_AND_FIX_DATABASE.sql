-- LANGKAH DEBUGGING DAN PERBAIKAN DATABASE
-- Jalankan di Supabase SQL Editor satu per satu

-- ===== 1. CEK APAKAH TABLE PROFILES ADA =====
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ===== 2. CEK USER YANG SUDAH TERDAFTAR =====
SELECT 
    id, 
    email, 
    email_confirmed_at, 
    created_at, 
    raw_user_meta_data,
    confirmation_sent_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ===== 3. CEK DATA DI TABLE PROFILES =====
SELECT * FROM public.profiles ORDER BY created_at DESC;

-- ===== 4. CEK TRIGGER YANG ADA =====
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- ===== 5. BUAT TRIGGER AUTO CREATE PROFILE =====
-- Function untuk auto create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone_number, 
    jabatan,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'jabatan', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===== 6. PERBAIKI RLS POLICIES UNTUK DEVELOPMENT =====
-- Hapus policy lama yang ketat
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Buat policy development yang lebih bebas
CREATE POLICY "Enable all operations for development" ON public.profiles
  FOR ALL USING (true)
  WITH CHECK (true);

-- ===== 7. UNTUK DEVELOPMENT: DISABLE EMAIL CONFIRMATION =====
-- Jalankan ini jika ingin disable konfirmasi email untuk development
-- UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_signup';

-- ===== 8. CEK COMPANIES TABLE =====
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'companies'
ORDER BY ordinal_position;

-- ===== 9. BUAT PROFILE MANUAL UNTUK USER YANG SUDAH ADA =====
-- Ganti USER_ID dengan ID user yang sudah terdaftar
/*
INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone_number, 
    jabatan,
    created_at,
    updated_at
)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', email),
    email,
    COALESCE(raw_user_meta_data->>'phone_number', ''),
    COALESCE(raw_user_meta_data->>'jabatan', ''),
    NOW(),
    NOW()
FROM auth.users 
WHERE id = 'USER_ID_DISINI'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.users.id);
*/

-- ===== 10. CEK HASIL AKHIR =====
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.full_name,
    p.jabatan,
    p.phone_number
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;
