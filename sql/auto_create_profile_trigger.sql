-- SQL untuk Auto-Create Profile saat User Baru Dibuat
-- Jalankan di SQL Editor Supabase

-- 1. Buat fungsi untuk menangani user baru
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone_number, jabatan, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name',''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number',''),
    COALESCE(NEW.raw_user_meta_data->>'jabatan',''),
    NOW(), NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Hapus trigger yang mungkin sudah ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Populate profile untuk user existing yang belum punya profile
INSERT INTO public.profiles (id, full_name, email, phone_number, jabatan, created_at, updated_at)
SELECT id,
       COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'display_name', email),
       email,
       COALESCE(raw_user_meta_data->>'phone_number',''),
       COALESCE(raw_user_meta_data->>'jabatan',''),
       NOW(), NOW()
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id);

-- 5. Verifikasi bahwa trigger sudah bekerja
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';