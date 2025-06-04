## Konfigurasi Email Supabase

Untuk memastikan email konfirmasi dikirim dengan benar, ikuti langkah-langkah berikut:

### 1. Setup URL Konfigurasi

1. Buka Supabase Dashboard -> Authentication -> URL Configuration
2. Pastikan **Site URL** diatur dengan benar:
   - Development: `http://localhost:3000`
   - Production: `https://himtika-proposal-system.vercel.app`
3. Pastikan **Redirect URLs** termasuk:
   - `http://localhost:3000/auth/callback`
   - `https://himtika-proposal-system.vercel.app/auth/callback`

### 2. Setup Email Provider

1. Buka Supabase Dashboard -> Authentication -> Email Templates
2. Pilih salah satu opsi:
   
   **A. Gunakan Email Provider Supabase (Simple)**
   - Ini adalah opsi default, tapi memiliki batasan jumlah email
   - Pastikan "**Enable email confirmations**" diaktifkan

   **B. Gunakan Custom SMTP (Direkomendasikan)**
   - Klik tab "SMTP Settings"
   - Masukkan informasi SMTP:
     - **Sender Name**: HIMTIKA Proposal
     - **SMTP Host**: (server SMTP Anda, misal smtp.gmail.com)
     - **SMTP Port**: 587 (biasanya)
     - **SMTP Username**: (alamat email Anda)
     - **SMTP Password**: (password atau app password)
     - **Sender Email**: (alamat email pengirim)
   - Klik "Save" dan "Send test email" untuk verifikasi

### 3. Kostumisasi Email Template

1. Buka Supabase Dashboard -> Authentication -> Email Templates
2. Edit template "Confirmation" untuk menyesuaikan pesan email konfirmasi
3. Pastikan link konfirmasi masih berisi `{{ .ConfirmationURL }}`

### 4. Tentang Uji Coba Development

1. Untuk testing cepat di development, Anda bisa menonaktifkan "Enable email confirmations"
2. Dengan menonaktifkan ini, user akan otomatis terverifikasi tanpa klik link konfirmasi
3. Jangan lupa aktifkan kembali untuk production!

## Masalah Umum & Solusi

### Email Tidak Terkirim
- Periksa folder spam/junk
- Pastikan SMTP setting benar
- Pastikan "Enable email confirmations" aktif
- Pastikan email provider tidak memblokir

### Profile Tidak Dibuat
- Jalankan SQL trigger di file `sql/auto_create_profile_trigger.sql`
- Verifikasi bahwa trigger sudah terpasang dengan query:
  ```sql
  SELECT * FROM information_schema.triggers 
  WHERE event_object_table = 'users' 
    AND event_object_schema = 'auth';
  ```

### Link Konfirmasi Error
- Pastikan Site URL dan Redirect URLs benar
- Cek apakah domain vercel sudah terdaftar di Supabase dashboard