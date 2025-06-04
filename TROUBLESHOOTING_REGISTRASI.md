# 🚨 PANDUAN PERBAIKAN REGISTRASI - DEVELOPMENT

## Masalah Utama:
1. ❌ Email konfirmasi tidak terkirim
2. ❌ Data profile tidak tersimpan di database
3. ❌ Migrations terlalu kompleks untuk development

## 🔧 SOLUSI CEPAT - Ikuti Langkah Ini:

### Langkah 1: Setup Database Sederhana
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy paste SQL berikut dan jalankan:

```sql
-- Setup sederhana untuk development
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone_number TEXT DEFAULT '',
    jabatan TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tambah kolom ke companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS created_by_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_sent_by UUID,
ADD COLUMN IF NOT EXISTS whatsapp_sent_by_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_sent_by_phone TEXT,
ADD COLUMN IF NOT EXISTS email_sent_by UUID,
ADD COLUMN IF NOT EXISTS email_sent_by_name TEXT,
ADD COLUMN IF NOT EXISTS email_sent_by_phone TEXT;

-- Set RLS policies (permisif untuk development)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for profiles" ON public.profiles;
CREATE POLICY "Enable all for profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for companies" ON public.companies;
CREATE POLICY "Enable all for companies" ON public.companies FOR ALL USING (true);
```

### Langkah 2: Cek Konfigurasi Email di Supabase
1. Buka **Supabase Dashboard** → **Authentication** → **Settings**
2. Pastikan:
   - ✅ **Enable email confirmations** = ON
   - ✅ **Site URL** = `http://localhost:3000` (untuk development)
   - ✅ **Redirect URLs** termasuk `http://localhost:3000/auth/callback`

### Langkah 3: Test Registrasi
1. Jalankan aplikasi: `npm run dev`
2. Buka browser console (F12) untuk melihat logs
3. Coba registrasi dengan email yang valid
4. Cek logs di console untuk debug informasi

### Langkah 4: Cek Email
Email konfirmasi mungkin masuk ke:
- 📧 Inbox
- 🗑️ Spam/Junk folder
- 📁 Folder Promosi (Gmail)
- 🔒 Folder Social/Updates (Gmail)

## 🐛 Debugging Tips:

### Jika Email Tidak Terkirim:
1. Cek Supabase Dashboard → Authentication → Users
2. User baru harus muncul dengan status "Waiting for confirmation"
3. Cek browser console untuk error messages

### Jika Profile Tidak Tersimpan:
1. Cek browser console saat klik link konfirmasi
2. Lihat logs dengan prefix "=== PROFILE CREATION DEBUG ==="
3. Cek Supabase Table Editor → profiles table

### Environment Variables:
Pastikan file `.env.local` ada dan berisi:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ⚠️ Kenapa Tidak Pakai Migrations?

Migrations itu untuk:
- ✅ Production environment
- ✅ Team development dengan database yang sudah ada data penting
- ✅ Versioning schema changes

Untuk development solo:
- ❌ Tidak perlu migrations yang kompleks
- ✅ Cukup CREATE TABLE IF NOT EXISTS
- ✅ Bisa drop/recreate table kapan saja
- ✅ Fokus pada development, bukan database management

## 🎯 Next Steps After This Works:
1. Test registrasi beberapa user
2. Test login
3. Test fitur kirim proposal dengan filter per user
4. Baru nanti di production pakai migrations proper

---
**Note**: File ini hanya untuk development. Di production nanti baru setup migrations yang proper.
