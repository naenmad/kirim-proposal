-- AUTO CREATE PROFILE TRIGGER
-- Jalankan ini di Supabase SQL Editor untuk membuat profile otomatis

-- 1. Function untuk membuat profile otomatis
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
EXCEPTION
    WHEN unique_violation THEN
        -- Profile sudah ada, update saja
        UPDATE public.profiles SET
            full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', full_name),
            email = NEW.email,
            phone_number = COALESCE(NEW.raw_user_meta_data->>'phone_number', phone_number),
            jabatan = COALESCE(NEW.raw_user_meta_data->>'jabatan', jabatan),
            updated_at = NOW()
        WHERE id = NEW.id;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger yang dijalankan ketika user dikonfirmasi (email confirmed)
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_new_user();

-- 3. UNTUK DEVELOPMENT: Trigger yang langsung jalan saat user dibuat (bypass email confirmation)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Buat profile untuk user yang sudah ada tapi belum punya profile
INSERT INTO public.profiles (id, full_name, email, phone_number, jabatan, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'display_name', '') as full_name,
    u.email,
    COALESCE(u.raw_user_meta_data->>'phone_number', '') as phone_number,
    COALESCE(u.raw_user_meta_data->>'jabatan', '') as jabatan,
    u.created_at,
    NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
