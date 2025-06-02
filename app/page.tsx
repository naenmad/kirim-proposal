'use client'

import { useState, useEffect } from 'react'

interface FormData {
  namaPengirim: string
  jabatanPengirim: string
}

interface Company {
  id: string
  namaPerusahaan: string
  emailPerusahaan: string
  nomorWhatsapp: string
  dateAdded: string
  status: {
    whatsapp: {
      sent: boolean
      dateSent?: string
    }
    email: {
      sent: boolean
      dateSent?: string
    }
  }
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    namaPengirim: '',
    jabatanPengirim: ''
  })

  const [companies, setCompanies] = useState<Company[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompany, setNewCompany] = useState({
    namaPerusahaan: '',
    emailPerusahaan: '',
    nomorWhatsapp: ''
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('kirim-proposal-sender')
    const savedCompanies = localStorage.getItem('kirim-proposal-companies')

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('kirim-proposal-sender', JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    localStorage.setItem('kirim-proposal-companies', JSON.stringify(companies))
  }, [companies])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNewCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCompany(prev => ({ ...prev, [name]: value }))
  }

  const addCompany = () => {
    if (!newCompany.namaPerusahaan.trim() || !newCompany.emailPerusahaan.trim() || !newCompany.nomorWhatsapp.trim()) {
      alert('Semua field perusahaan harus diisi!')
      return
    }

    const company: Company = {
      id: Date.now().toString(),
      ...newCompany,
      dateAdded: new Date().toISOString(),
      status: {
        whatsapp: { sent: false },
        email: { sent: false }
      }
    }

    setCompanies(prev => [...prev, company])
    setNewCompany({ namaPerusahaan: '', emailPerusahaan: '', nomorWhatsapp: '' })
    setShowAddForm(false)
  }

  const removeCompany = (id: string) => {
    if (confirm('Yakin ingin menghapus perusahaan ini?')) {
      setCompanies(prev => prev.filter(c => c.id !== id))
    }
  }

  const markAsSent = (companyId: string, type: 'whatsapp' | 'email') => {
    setCompanies(prev => prev.map(company =>
      company.id === companyId
        ? {
          ...company,
          status: {
            ...company.status,
            [type]: {
              sent: true,
              dateSent: new Date().toISOString()
            }
          }
        }
        : company
    ))
  }

  const resetStatus = (companyId: string, type: 'whatsapp' | 'email') => {
    setCompanies(prev => prev.map(company =>
      company.id === companyId
        ? {
          ...company,
          status: {
            ...company.status,
            [type]: {
              sent: false,
              dateSent: undefined
            }
          }
        }
        : company
    ))
  }

  const normalizeWhatsAppNumber = (phoneNumber: string): string => {
    let cleanNumber = phoneNumber.replace(/\D/g, '')

    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.substring(1)
    }

    if (!cleanNumber.startsWith('62')) {
      cleanNumber = '62' + cleanNumber
    }

    return cleanNumber
  }

  const generateMessage = (companyName: string) => {
    return `Kepada Yth.
Tim Public Relations / Kemitraan
${companyName}
di Tempat

Dengan hormat,
Perkenalkan, kami dari Himpunan Mahasiswa Informatika Universitas Singaperbangsa Karawang (HIMTIKA UNSIKA). Kami merupakan organisasi kemahasiswaan di bawah Program Studi Informatika yang aktif dalam pengembangan teknologi, inovasi digital, serta kegiatan kemahasiswaan yang bersifat edukatif dan sosial.

Dalam rangka menyukseskan kegiatan-kegiatan kami yang tertera didalam proposal, kami bermaksud mengajukan permohonan kerja sama kepada ${companyName} sebagai salah satu mitra sponsor dalam kegiatan-kegiatan kami.

Kami melihat ${companyName} sebagai brand besar yang tidak hanya memiliki nilai komersial tinggi, tetapi juga sangat dekat dengan semangat produktivitas dan kreativitas generasi muda — nilai yang sejalan dengan visi kami.

Sebagai bentuk kerja sama, kami siap memberikan berbagai bentuk branding dan publikasi untuk perusahaan Bapak/Ibu, yang tercantum lengkap dalam proposal terlampir.

Besar harapan kami untuk dapat menjalin komunikasi lebih lanjut dan berkolaborasi bersama ${companyName} dalam kegiatan ini. Kami siap menjelaskan lebih detail melalui pertemuan daring maupun offline sesuai dengan waktu yang Bapak/Ibu luangkan.

Atas perhatian dan waktunya, kami ucapkan terima kasih.

Hormat kami,
${formData.namaPengirim}
${formData.jabatanPengirim}
HIMTIKA UNSIKA
📞 089652540065
✉️ 2410631170123@student.unsika.ac.id
🌐 https://himtika.cs.unsika.ac.id/`
  }

  const handleWhatsappSend = (company: Company) => {
    if (!formData.namaPengirim.trim() || !formData.jabatanPengirim.trim()) {
      alert('Data pengirim harus diisi terlebih dahulu!')
      return
    }

    const message = generateMessage(company.namaPerusahaan)
    const normalizedNumber = normalizeWhatsAppNumber(company.nomorWhatsapp)
    const whatsappUrl = `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`

    try {
      window.open(whatsappUrl, '_blank')
      markAsSent(company.id, 'whatsapp')
    } catch (error) {
      console.error('Error opening WhatsApp:', error)
      alert('Gagal membuka WhatsApp. Error: ' + error)
    }
  }

  const handleEmailSend = (company: Company) => {
    if (!formData.namaPengirim.trim() || !formData.jabatanPengirim.trim()) {
      alert('Data pengirim harus diisi terlebih dahulu!')
      return
    }

    const message = generateMessage(company.namaPerusahaan)
    const subject = `Permohonan Kerja Sama Sponsorship - HIMTIKA UNSIKA`
    const emailUrl = `mailto:${company.emailPerusahaan}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

    try {
      window.location.href = emailUrl
      markAsSent(company.id, 'email')
    } catch (error) {
      console.error('Error opening email client:', error)
      alert('Gagal membuka email client. Error: ' + error)
    }
  }

  const isFormValid = () => {
    return formData.namaPengirim.trim() !== '' && formData.jabatanPengirim.trim() !== ''
  }

  const getStatusColor = (sent: boolean) => {
    return sent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStats = () => {
    const total = companies.length
    const sentWhatsapp = companies.filter(c => c.status.whatsapp.sent).length
    const sentEmail = companies.filter(c => c.status.email.sent).length
    const bothSent = companies.filter(c => c.status.whatsapp.sent && c.status.email.sent).length

    return { total, sentWhatsapp, sentEmail, bothSent }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Kirim Proposal Sponsorship
          </h1>
          <p className="text-xl text-gray-600 mb-2">HIMTIKA UNSIKA</p>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Sistem manajemen pengiriman proposal sponsorship dengan tracking status per perusahaan
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Perusahaan</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.sentWhatsapp}</div>
            <div className="text-sm text-gray-600">WhatsApp Terkirim</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.sentEmail}</div>
            <div className="text-sm text-gray-600">Email Terkirim</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.bothSent}</div>
            <div className="text-sm text-gray-600">Keduanya Terkirim</div>
          </div>
        </div>

        {/* Sender Info Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Pengirim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="namaPengirim" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Pengirim *
              </label>
              <input
                type="text"
                id="namaPengirim"
                name="namaPengirim"
                value={formData.namaPengirim}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Masukkan nama pengirim"
                required
              />
            </div>
            <div>
              <label htmlFor="jabatanPengirim" className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan Pengirim *
              </label>
              <input
                type="text"
                id="jabatanPengirim"
                name="jabatanPengirim"
                value={formData.jabatanPengirim}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Masukkan jabatan pengirim"
                required
              />
            </div>
          </div>
        </div>

        {/* Companies Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Daftar Perusahaan</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Perusahaan
            </button>
          </div>

          {/* Add Company Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Perusahaan Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perusahaan *
                  </label>
                  <input
                    type="text"
                    name="namaPerusahaan"
                    value={newCompany.namaPerusahaan}
                    onChange={handleNewCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama perusahaan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Perusahaan *
                  </label>
                  <input
                    type="email"
                    name="emailPerusahaan"
                    value={newCompany.emailPerusahaan}
                    onChange={handleNewCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan email perusahaan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="nomorWhatsapp"
                    value={newCompany.nomorWhatsapp}
                    onChange={handleNewCompanyChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={addCompany}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Companies Grid */}
          {companies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg">Belum ada perusahaan yang ditambahkan</p>
              <p className="text-sm">Klik tombol "Tambah Perusahaan" untuk memulai</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{company.namaPerusahaan}</h3>
                    <button
                      onClick={() => removeCompany(company.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>📧 {company.emailPerusahaan}</p>
                    <p>📱 {company.nomorWhatsapp}</p>
                    <p className="text-xs">Ditambahkan: {formatDate(company.dateAdded)}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status.whatsapp.sent)}`}>
                      WhatsApp: {company.status.whatsapp.sent ? 'Terkirim' : 'Belum'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status.email.sent)}`}>
                      Email: {company.status.email.sent ? 'Terkirim' : 'Belum'}
                    </span>
                  </div>

                  {/* Send Dates */}
                  {(company.status.whatsapp.sent || company.status.email.sent) && (
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      {company.status.whatsapp.sent && company.status.whatsapp.dateSent && (
                        <p>WA: {formatDate(company.status.whatsapp.dateSent)}</p>
                      )}
                      {company.status.email.sent && company.status.email.dateSent && (
                        <p>Email: {formatDate(company.status.email.dateSent)}</p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWhatsappSend(company)}
                        disabled={!isFormValid()}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097" />
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleEmailSend(company)}
                        disabled={!isFormValid()}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                    </div>

                    {/* Reset buttons */}
                    {(company.status.whatsapp.sent || company.status.email.sent) && (
                      <div className="flex gap-1">
                        {company.status.whatsapp.sent && (
                          <button
                            onClick={() => resetStatus(company.id, 'whatsapp')}
                            className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 transition-all"
                          >
                            Reset WA
                          </button>
                        )}
                        {company.status.email.sent && (
                          <button
                            onClick={() => resetStatus(company.id, 'email')}
                            className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 transition-all"
                          >
                            Reset Email
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                📝 Petunjuk Penggunaan
              </h3>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Isi data pengirim terlebih dahulu</li>
                <li>• Tambahkan perusahaan target dengan menekan tombol "Tambah Perusahaan"</li>
                <li>• Klik tombol WhatsApp/Email pada card perusahaan untuk mengirim proposal</li>
                <li>• Status pengiriman akan otomatis terupdate dan tersimpan di device</li>
                <li>• File proposal harus dilampirkan secara manual setelah pesan terkirim</li>
                <li>• Gunakan tombol "Reset" jika ingin mengirim ulang ke perusahaan yang sama</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            © 2025 HIMTIKA UNSIKA - Sistem Manajemen Proposal Sponsorship
          </p>
        </div>
      </div>
    </div>
  )
}