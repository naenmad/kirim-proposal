# Panduan Mengaktifkan Statistik Publik di Beranda

Untuk menampilkan statistik pengiriman proposal di halaman beranda tanpa memerlukan login, Anda perlu menambahkan akses publik ke data statistik melalui view atau function di Supabase.

## Opsi 1: Menggunakan Public View (Disarankan)

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik "SQL Editor" di sidebar kiri
4. Buat query baru dan jalankan SQL berikut:

```sql
-- Membuat view untuk statistik publik yang dapat diakses tanpa login
CREATE OR REPLACE VIEW public_stats AS
SELECT 
  COUNT(*) AS total_companies,
  COUNT(CASE WHEN whatsapp_sent = true THEN 1 END) AS whatsapp_sent,
  COUNT(CASE WHEN email_sent = true THEN 1 END) AS email_sent,
  COUNT(CASE WHEN whatsapp_sent = true OR email_sent = true THEN 1 END) AS total_sent
FROM companies;

-- Memberikan akses pada view untuk anonymous users (pengguna yang belum login)
GRANT SELECT ON public_stats TO anon;
```

5. Klik "Run" untuk mengeksekusi query

## Opsi 2: Menggunakan Database Function

Alternatif lain adalah membuat database function yang dapat diakses secara publik:

```sql
-- Buat stored function yang mengembalikan statistik
CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS TABLE (
  total_companies bigint,
  whatsapp_sent bigint,
  email_sent bigint,
  total_sent bigint
) SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) AS total_companies,
    COUNT(CASE WHEN whatsapp_sent = true THEN 1 END) AS whatsapp_sent,
    COUNT(CASE WHEN email_sent = true THEN 1 END) AS email_sent,
    COUNT(CASE WHEN whatsapp_sent = true OR email_sent = true THEN 1 END) AS total_sent
  FROM companies;
END;
$$ LANGUAGE plpgsql;

-- Memberikan akses pada function untuk anonymous users
GRANT EXECUTE ON FUNCTION get_public_stats() TO anon;
```

## Verifikasi Akses

Untuk memastikan view atau function bekerja dengan benar:

1. Klik "Table Editor" di sidebar Supabase
2. Scroll ke bawah dan cari "Views" atau "Functions" 
3. Pastikan `public_stats` atau `get_public_stats()` muncul di daftar
4. Pastikan Anda dapat melihat data saat mengklik view/function tersebut

## Mengapa Ini Diperlukan?

Row Level Security (RLS) di Supabase membatasi akses ke tabel `companies` hanya untuk pengguna yang sudah login. Dengan membuat view atau function khusus, kita menyediakan cara aman untuk mengakses statistik agregat tanpa membuka akses ke data perusahaan individual.
