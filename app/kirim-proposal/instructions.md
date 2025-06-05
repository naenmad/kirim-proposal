// Fungsi untuk menambahkan pengecekan duplikasi perusahaan ke KirimProposalPage.tsx

// 1. Tambahkan fungsi checkCompanyExists di bawah deklarasi supabase client:
const checkCompanyExists = async (namaPerusahaan: string): Promise<boolean> => {
  try {
    // Gunakan SELECT COUNT untuk performa lebih baik
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .ilike('nama_perusahaan', namaPerusahaan.trim())

    if (error) {
      console.error('Error checking company existence:', error)
      return false
    }

    return count !== null && count > 0
  } catch (error) {
    console.error('Exception checking company existence:', error)
    return false
  }
}

// 2. Modifikasi fungsi addCompany untuk memeriksa duplikasi:
// Di dalam fungsi addCompany, setelah validasi kontak dan sebelum setIsLoading(true):

// Periksa apakah perusahaan sudah ada
const companyExists = await checkCompanyExists(newCompany.namaPerusahaan)
if (companyExists) {
  showNotification(
    'warning', 
    'Perusahaan Sudah Ada', 
    `Perusahaan dengan nama "${newCompany.namaPerusahaan}" sudah terdaftar dalam database.\n\nSilakan periksa daftar perusahaan yang sudah ada atau gunakan nama yang lebih spesifik.`
  )
  return
}

// Setelah baris ini lanjutkan dengan kode yang ada:
// try {
//   setIsLoading(true)
//   const newCompanyData = {
//     ...
//   }
//   ...
// }
