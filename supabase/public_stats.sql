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

-- Atau sebagai alternatif, buat stored function yang mengembalikan statistik
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
