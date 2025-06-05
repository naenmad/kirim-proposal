// Gunakan fungsi formatContactInfo di dalam komponen perusahaan
// Cari bagian yang menampilkan card perusahaan dan ganti tampilan kontak dengan:
// {formatContactInfo(company)}

// Pastikan juga pesan error di history page konsisten:
if (!company.nomorWhatsapp.trim()) {
    showNotification('error', 'WhatsApp Tidak Tersedia', 'Nomor WhatsApp tidak dimasukkan untuk perusahaan ini!');
    return;
}

if (!company.emailPerusahaan.trim()) {
    showNotification('error', 'Email Tidak Tersedia', 'Email tidak dimasukkan untuk perusahaan ini!');
    return;
}