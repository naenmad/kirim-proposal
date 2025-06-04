# Checklist Pengaturan Supabase untuk Development

## 1. Authentication Settings
Buka **Supabase Dashboard** → **Authentication** → **Settings**

### Email Settings:
- ✅ **Enable email confirmations** = **ON** (atau OFF untuk development)
- ✅ **Enable email change confirmations** = OFF (untuk development)
- ✅ **Enable secure email change** = OFF (untuk development)

### URL Configuration:
- ✅ **Site URL** = `http://localhost:3001` (sesuai port aplikasi Anda)
- ✅ **Redirect URLs** = `http://localhost:3001/auth/callback`

### Email Templates:
- Cek template "Confirm signup" - pastikan ada dan tidak kosong
- URL dalam template harus mengarah ke: `{{ .ConfirmationURL }}`

## 2. Database Tables
Pastikan table `profiles` sudah ada:

```sql
-- Jalankan query ini di SQL Editor untuk mengecek:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';
```

## 3. RLS Policies
Untuk development, gunakan policy yang lebih permisif:

```sql
-- Hapus policy yang terlalu ketat
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Buat policy development yang lebih bebas
CREATE POLICY "Enable all for profiles development" ON public.profiles
FOR ALL USING (true) WITH CHECK (true);
```

## 4. Environment Variables
Pastikan `.env.local` berisi:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 5. Email Provider (untuk Production)
Jika tidak menerima email:
- Untuk development: **Disable email confirmation** (langkah 6)
- Untuk production: Setup SMTP custom atau gunakan provider seperti SendGrid

## 6. BYPASS EMAIL CONFIRMATION (Development Only)
Untuk mempercepat development, disable email confirmation:

1. Di Supabase Dashboard → Authentication → Settings
2. Set **Enable email confirmations** = **OFF**
3. User langsung bisa login tanpa konfirmasi email
