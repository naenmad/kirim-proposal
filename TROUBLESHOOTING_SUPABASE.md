# 🔧 CHECKLIST PENGATURAN SUPABASE

## 1. 📧 PENGATURAN EMAIL KONFIRMASI

### Buka Supabase Dashboard:
1. **Authentication** → **Settings**
2. **Email Templates** → **Confirm signup**

### Cek Pengaturan:
- ✅ **Enable email confirmations**: 
  - **UNTUK DEVELOPMENT**: Set ke **OFF** (untuk testing tanpa email)
  - **UNTUK PRODUCTION**: Set ke **ON**

### Site URL & Redirect URLs:
- **Site URL**: `http://localhost:3001` (sesuaikan dengan port Anda)
- **Redirect URLs**: `http://localhost:3001/auth/callback`

### SMTP Configuration:
- Jika menggunakan custom SMTP, pastikan sudah diatur
- Jika menggunakan Supabase default, ada limit email per hari

---

## 2. 🗄️ PENGATURAN DATABASE

### Cek Table Profiles:
```sql
-- Jalankan di SQL Editor Supabase
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';
```

### Cek RLS (Row Level Security):
```sql
-- Cek apakah RLS aktif
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

---

## 3. 🔨 SOLUSI CEPAT UNTUK DEVELOPMENT

### A. Disable Email Confirmation (Development Only):
1. Supabase Dashboard → **Authentication** → **Settings**
2. Set **Enable email confirmations** = **OFF**
3. User akan langsung confirmed tanpa perlu klik email

### B. Auto Create Profile dengan Trigger:
Jalankan SQL dari file `CHECK_AND_FIX_DATABASE.sql`

---

## 4. 🐛 DEBUGGING STEPS

### Step 1: Cek Environment Variables
```bash
# Di browser console atau terminal
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### Step 2: Cek Koneksi Database
```javascript
// Test di browser console
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  'YOUR_SUPABASE_URL', 
  'YOUR_ANON_KEY'
)
supabase.from('profiles').select('*').then(console.log)
```

### Step 3: Cek User Registration
```sql
-- Di Supabase SQL Editor
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

---

## 5. 🚨 TROUBLESHOOTING

### Email Tidak Terkirim:
- Cek folder Spam/Junk
- Cek quota email Supabase (default: 30 email/jam)
- Pastikan email domain tidak di-blacklist
- Coba gunakan email domain berbeda (Gmail, Yahoo)

### Profile Tidak Terbuat:
- Pastikan trigger `handle_new_user()` sudah aktif
- Cek RLS policies tidak terlalu ketat
- Manual insert profile untuk user yang sudah ada

### Error "Failed to fetch":
- Cek environment variables
- Cek koneksi internet
- Cek Supabase service status
- Restart development server

---

## 6. ✅ CHECKLIST FINAL

- [ ] Environment variables benar dan terbaca
- [ ] Supabase URL dan Anon Key valid
- [ ] Table `profiles` sudah ada
- [ ] Trigger auto create profile aktif
- [ ] RLS policies tidak terlalu ketat
- [ ] Email confirmation setting sesuai kebutuhan
- [ ] Site URL dan Redirect URLs benar
- [ ] Test registrasi dengan email baru

---

## 7. 📝 LANGKAH SELANJUTNYA

1. **Jalankan SQL dari `CHECK_AND_FIX_DATABASE.sql`**
2. **Disable email confirmation untuk development**
3. **Test registrasi dengan user baru**
4. **Cek apakah profile otomatis terbuat**
5. **Enable email confirmation saat production**
