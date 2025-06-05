# Panduan Setup Supabase untuk Aplikasi Kirim Proposal

## Masalah: Invalid API Key

Jika Anda melihat error "AuthApiError: Invalid API key", berikut adalah langkah-langkah untuk memperbaikinya:

## Langkah 1: Dapatkan Kredensial dari Dashboard Supabase

1. Login ke [Supabase Dashboard](https://app.supabase.io)
2. Pilih project yang Anda gunakan
3. Klik "Settings" di sidebar kiri
4. Pilih "API" di menu

Di halaman ini, Anda akan menemukan:
- **Project URL**: Ini adalah nilai untuk `NEXT_PUBLIC_SUPABASE_URL`
- **Project API Keys**: Gunakan "anon public" untuk nilai `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Langkah 2: Buat File `.env.local`

1. Buat file bernama `.env.local` di root project
2. Tambahkan baris berikut dengan nilai yang benar:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...pasti-sangat-panjang...
```

## Langkah 3: Restart Development Server

```bash
# Hentikan server yang sedang berjalan dengan CTRL+C
# Kemudian jalankan kembali
npm run dev
```

## Troubleshooting Tambahan

1. **Pastikan nilai tidak ada tanda kutip**: Environment variables tidak perlu tanda kutip.
2. **Periksa token expiry**: Jika token sudah kadaluarsa, buat project API key baru di dashboard Supabase.
3. **Bersihkan cache browser**: Kadang browser menyimpan cache yang menyebabkan masalah. Coba clear cache atau gunakan mode incognito.
4. **Periksa file tsconfig.json**: Pastikan resolusi modul diatur dengan benar.

## Menguji Koneksi Supabase

Setelah mengatur kredensial dengan benar, Anda seharusnya melihat informasi debug di console browser yang menunjukkan bahwa Supabase URL dan Key terdefinisi dengan benar.
