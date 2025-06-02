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

interface NotificationProps {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    isVisible: boolean
    onClose: () => void
}

// PERBAIKAN: Ubah interface ConfirmDialogProps
interface ConfirmDialogProps {
    isVisible: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info' // Tetap sama
}

// Custom Notification Component
const CustomNotification = ({ type, title, message, isVisible, onClose }: NotificationProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 5000) // Auto close after 5 seconds
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!isVisible) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 'error':
                return (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            case 'warning':
                return (
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                )
            case 'info':
                return (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
        }
    }

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200'
            case 'error':
                return 'bg-red-50 border-red-200'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200'
            case 'info':
                return 'bg-blue-50 border-blue-200'
        }
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div className={`${getColors()} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}`}>
                            {title}
                        </h3>
                        <div className={`mt-1 text-sm ${type === 'success' ? 'text-green-700' : type === 'error' ? 'text-red-700' : type === 'warning' ? 'text-yellow-700' : 'text-blue-700'}`}>
                            <p className="whitespace-pre-line">{message}</p>
                        </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                                type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' :
                                    type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                                        'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Custom Confirm Dialog Component
const CustomConfirmDialog = ({ isVisible, title, message, onConfirm, onCancel, confirmText = 'Ya', cancelText = 'Batal', type = 'warning' }: ConfirmDialogProps) => {
    if (!isVisible) return null

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                )
            case 'warning':
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                )
            case 'info':
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
                <div className="p-6">
                    <div className="flex items-center">
                        {getIcon()}
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 whitespace-pre-line">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                            type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' :
                                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function KirimProposalPage() {
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
    const [isLoaded, setIsLoaded] = useState(false)

    // PERBAIKAN: Custom notification states dengan tipe yang benar
    const [notification, setNotification] = useState<{
        isVisible: boolean
        type: 'success' | 'error' | 'warning' | 'info'  // Explicit union type
        title: string
        message: string
    }>({
        isVisible: false,
        type: 'info',
        title: '',
        message: ''
    })

    // PERBAIKAN: Update confirm dialog state dengan type yang benar
    const [confirmDialog, setConfirmDialog] = useState<{
        isVisible: boolean
        title: string
        message: string
        onConfirm: () => void
        type: 'danger' | 'warning' | 'info'  // Explicit union type
    }>({
        isVisible: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'warning'
    })

    // Custom notification functions
    const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setNotification({
            isVisible: true,
            type,
            title,
            message
        })
    }

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }))
    }

    // PERBAIKAN: Update showConfirm function
    const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'warning') => {
        setConfirmDialog({
            isVisible: true,
            title,
            message,
            onConfirm: () => {
                onConfirm()
                setConfirmDialog(prev => ({ ...prev, isVisible: false }))
            },
            type
        })
    }

    const hideConfirm = () => {
        setConfirmDialog(prev => ({ ...prev, isVisible: false }))
    }

    // Load data from localStorage on component mount
    useEffect(() => {
        try {
            const savedFormData = localStorage.getItem('himtika-proposal-sender')
            const savedCompanies = localStorage.getItem('himtika-proposal-companies')

            console.log('Loading data from localStorage...')
            console.log('Saved form data:', savedFormData)
            console.log('Saved companies:', savedCompanies)

            if (savedFormData) {
                const parsedFormData = JSON.parse(savedFormData)
                setFormData(parsedFormData)
                console.log('Form data loaded:', parsedFormData)
            }

            if (savedCompanies) {
                const parsedCompanies = JSON.parse(savedCompanies)
                setCompanies(parsedCompanies)
                console.log('Companies loaded:', parsedCompanies)
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error)
            showNotification('error', 'Error Loading Data', 'Gagal memuat data dari penyimpanan lokal')
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('himtika-proposal-sender', JSON.stringify(formData))
                console.log('Form data saved to localStorage:', formData)
            } catch (error) {
                console.error('Error saving form data to localStorage:', error)
                showNotification('error', 'Error Saving Data', 'Gagal menyimpan data pengirim')
            }
        }
    }, [formData, isLoaded])

    // Save companies to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('himtika-proposal-companies', JSON.stringify(companies))
                console.log('Companies saved to localStorage:', companies)
            } catch (error) {
                console.error('Error saving companies to localStorage:', error)
                showNotification('error', 'Error Saving Data', 'Gagal menyimpan data perusahaan')
            }
        }
    }, [companies, isLoaded])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleNewCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewCompany(prev => ({ ...prev, [name]: value }))
    }

    const addCompany = () => {
        // Validasi: nama perusahaan wajib dan minimal salah satu kontak
        if (!newCompany.namaPerusahaan.trim()) {
            showNotification('error', 'Data Tidak Lengkap', 'Nama perusahaan harus diisi!')
            return
        }

        if (!newCompany.emailPerusahaan.trim() && !newCompany.nomorWhatsapp.trim()) {
            showNotification('warning', 'Kontak Diperlukan', 'Minimal salah satu kontak (Email atau WhatsApp) harus diisi!')
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
        showNotification('success', 'Perusahaan Ditambahkan', `${company.namaPerusahaan} berhasil ditambahkan ke daftar`)
    }

    const removeCompany = (id: string) => {
        const company = companies.find(c => c.id === id)
        if (company) {
            showConfirm(
                'Hapus Perusahaan',
                `Yakin ingin menghapus "${company.namaPerusahaan}" dari daftar?\n\nData ini tidak dapat dikembalikan.`,
                () => {
                    setCompanies(prev => prev.filter(c => c.id !== id))
                    showNotification('success', 'Perusahaan Dihapus', `${company.namaPerusahaan} berhasil dihapus dari daftar`)
                },
                'danger'
            )
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
        const company = companies.find(c => c.id === companyId)
        if (company) {
            showConfirm(
                'Reset Status',
                `Reset status ${type === 'whatsapp' ? 'WhatsApp' : 'Email'} untuk "${company.namaPerusahaan}"?\n\nAnda dapat mengirim proposal lagi setelah reset.`,
                () => {
                    setCompanies(prev => prev.map(comp =>
                        comp.id === companyId
                            ? {
                                ...comp,
                                status: {
                                    ...comp.status,
                                    [type]: {
                                        sent: false,
                                        dateSent: undefined
                                    }
                                }
                            }
                            : comp
                    ))
                    showNotification('info', 'Status Direset', `Status ${type === 'whatsapp' ? 'WhatsApp' : 'Email'} berhasil direset`)
                }
            )
        }
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
            showNotification('warning', 'Data Pengirim Diperlukan', 'Data pengirim harus diisi terlebih dahulu!')
            return
        }

        if (!company.nomorWhatsapp.trim()) {
            showNotification('error', 'WhatsApp Tidak Tersedia', 'Nomor WhatsApp tidak tersedia untuk perusahaan ini!')
            return
        }

        const message = generateMessage(company.namaPerusahaan)
        const normalizedNumber = normalizeWhatsAppNumber(company.nomorWhatsapp)
        const whatsappUrl = `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`

        try {
            window.open(whatsappUrl, '_blank')
            markAsSent(company.id, 'whatsapp')
            showNotification('success', 'WhatsApp Dibuka', `WhatsApp terbuka untuk ${company.namaPerusahaan}.\nJangan lupa lampirkan file proposal!`)
        } catch (error) {
            console.error('Error opening WhatsApp:', error)
            showNotification('error', 'Error WhatsApp', `Gagal membuka WhatsApp: ${error}`)
        }
    }

    const handleEmailSend = (company: Company) => {
        if (!formData.namaPengirim.trim() || !formData.jabatanPengirim.trim()) {
            showNotification('warning', 'Data Pengirim Diperlukan', 'Data pengirim harus diisi terlebih dahulu!')
            return
        }

        if (!company.emailPerusahaan.trim()) {
            showNotification('error', 'Email Tidak Tersedia', 'Email tidak tersedia untuk perusahaan ini!')
            return
        }

        const message = generateMessage(company.namaPerusahaan)
        const subject = `Permohonan Kerja Sama Sponsorship - HIMTIKA UNSIKA`
        const emailUrl = `mailto:${company.emailPerusahaan}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

        try {
            window.location.href = emailUrl
            markAsSent(company.id, 'email')
            showNotification('success', 'Email Client Dibuka', `Email client terbuka untuk ${company.namaPerusahaan}.\nJangan lupa lampirkan file proposal!`)
        } catch (error) {
            console.error('Error opening email client:', error)
            showNotification('error', 'Error Email', `Gagal membuka email client: ${error}`)
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

    // Show loading state until data is loaded
    if (!isLoaded) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat data...</p>
                    </div>
                </div>
            </div>
        )
    }

    const exportData = () => {
        try {
            const dataToExport = {
                formData,
                companies,
                exportDate: new Date().toISOString(),
                version: '1.0'
            }

            const dataStr = JSON.stringify(dataToExport, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)

            const link = document.createElement('a')
            link.href = url
            link.download = `himtika-proposal-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            showNotification('success', 'Data Berhasil Diekspor', `Backup data tersimpan dengan nama:\n${link.download}`)
        } catch (error) {
            console.error('Error exporting data:', error)
            showNotification('error', 'Gagal Export Data', 'Terjadi kesalahan saat mengekspor data')
        }
    }

    const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Reset input value untuk bisa import file yang sama
        event.target.value = ''

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string)

                // Validasi struktur data
                if (!importedData || typeof importedData !== 'object') {
                    throw new Error('Format file tidak valid')
                }

                // Validasi field yang diperlukan
                const hasValidFormData = importedData.formData &&
                    typeof importedData.formData === 'object'

                const hasValidCompanies = Array.isArray(importedData.companies)

                if (!hasValidFormData && !hasValidCompanies) {
                    throw new Error('File tidak mengandung data yang valid')
                }

                // Konfirmasi import
                const confirmMessage = `Data yang akan diimpor:
• Data Pengirim: ${hasValidFormData ? 'Ada' : 'Tidak ada'}
• Perusahaan: ${hasValidCompanies ? importedData.companies.length + ' perusahaan' : 'Tidak ada'}
• Tanggal Export: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleString('id-ID') : 'Tidak diketahui'}

Apakah Anda yakin ingin mengimpor data ini? Data yang ada sekarang akan ditimpa.`

                // PERBAIKAN: Pastikan menggunakan tipe yang benar
                showConfirm(
                    'Konfirmasi Import Data',
                    confirmMessage,
                    () => {
                        // Import form data
                        if (hasValidFormData) {
                            setFormData({
                                namaPengirim: importedData.formData.namaPengirim || '',
                                jabatanPengirim: importedData.formData.jabatanPengirim || ''
                            })
                        }

                        // Import companies
                        if (hasValidCompanies) {
                            // Validasi setiap company
                            const validCompanies = importedData.companies.filter((company: any) => {
                                return company.id &&
                                    company.namaPerusahaan &&
                                    company.dateAdded &&
                                    company.status
                            })
                            setCompanies(validCompanies)
                        }

                        // Close add form if open
                        setShowAddForm(false)

                        showNotification('success', 'Data Berhasil Diimpor', `• ${hasValidFormData ? 'Data pengirim diperbarui' : 'Data pengirim tidak berubah'}\n• ${hasValidCompanies ? `${importedData.companies.length} perusahaan diimpor` : 'Tidak ada perusahaan yang diimpor'}`)
                    },
                    'info' // Menggunakan tipe yang valid
                )
            } catch (error) {
                console.error('Error importing data:', error)
                showNotification('error', 'Gagal Import Data', `${error instanceof Error ? error.message : 'File tidak valid atau rusak'}\n\nPastikan:\n• File adalah hasil export dari aplikasi ini\n• File tidak rusak atau dimodifikasi\n• Format JSON valid`)
            }
        }

        reader.onerror = () => {
            showNotification('error', 'Error Membaca File', 'Gagal membaca file yang dipilih')
        }

        reader.readAsText(file)
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            {/* Custom Notification */}
            <CustomNotification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={hideNotification}
            />

            {/* Custom Confirm Dialog */}
            <CustomConfirmDialog
                isVisible={confirmDialog.isVisible}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={hideConfirm}
                type={confirmDialog.type}
            />

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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                                placeholder="Masukkan jabatan pengirim"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Backup & Restore Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Backup & Restore</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={exportData}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Data
                            </button>
                            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm flex items-center gap-2 cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                Import Data
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={importData}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Ekspor data untuk backup atau impor data yang sudah ada. Data akan disimpan dalam format JSON.
                    </p>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                        placeholder="Masukkan nama perusahaan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Perusahaan
                                        {newCompany.nomorWhatsapp.trim() && !newCompany.emailPerusahaan.trim() && (
                                            <span className="text-gray-500 text-xs ml-1">(opsional)</span>
                                        )}
                                        {!newCompany.nomorWhatsapp.trim() && !newCompany.emailPerusahaan.trim() && (
                                            <span className="text-red-500 text-xs ml-1">*</span>
                                        )}
                                    </label>
                                    <input
                                        type="email"
                                        name="emailPerusahaan"
                                        value={newCompany.emailPerusahaan}
                                        onChange={handleNewCompanyChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                        placeholder="Masukkan email perusahaan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor WhatsApp
                                        {newCompany.emailPerusahaan.trim() && !newCompany.nomorWhatsapp.trim() && (
                                            <span className="text-gray-500 text-xs ml-1">(opsional)</span>
                                        )}
                                        {!newCompany.emailPerusahaan.trim() && !newCompany.nomorWhatsapp.trim() && (
                                            <span className="text-red-500 text-xs ml-1">*</span>
                                        )}
                                    </label>
                                    <input
                                        type="tel"
                                        name="nomorWhatsapp"
                                        value={newCompany.nomorWhatsapp}
                                        onChange={handleNewCompanyChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-700">
                                    <strong>Catatan:</strong> Minimal salah satu kontak (Email atau WhatsApp) harus diisi
                                </p>
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
                                        {company.emailPerusahaan ? (
                                            <p>📧 {company.emailPerusahaan}</p>
                                        ) : (
                                            <p className="text-gray-400">📧 Email tidak tersedia</p>
                                        )}
                                        {company.nomorWhatsapp ? (
                                            <p>📱 {company.nomorWhatsapp}</p>
                                        ) : (
                                            <p className="text-gray-400">📱 WhatsApp tidak tersedia</p>
                                        )}
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
                                                disabled={!isFormValid() || !company.nomorWhatsapp.trim()}
                                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097" />
                                                </svg>
                                                WhatsApp
                                            </button>
                                            <button
                                                onClick={() => handleEmailSend(company)}
                                                disabled={!isFormValid() || !company.emailPerusahaan.trim()}
                                                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 01-2 2z" />
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
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-8 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                📝 Petunjuk Penggunaan
                            </h3>
                            <ul className="text-yellow-700 space-y-1 text-sm">
                                <li>• Isi data pengirim terlebih dahulu</li>
                                <li>• Tambahkan perusahaan target dengan menekan tombol "Tambah Perusahaan"</li>
                                <li>• <strong>Minimal salah satu kontak (Email atau WhatsApp) harus diisi</strong></li>
                                <li>• Klik tombol WhatsApp/Email pada card perusahaan untuk mengirim proposal</li>
                                <li>• Status pengiriman akan otomatis terupdate dan tersimpan di device</li>
                                <li>• File proposal harus dilampirkan secara manual setelah pesan terkirim</li>
                                <li>• Gunakan tombol "Reset" jika ingin mengirim ulang ke perusahaan yang sama</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Warning Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-700">
                            <p><strong>Catatan Penting:</strong></p>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                                <li>Data disimpan di browser lokal Anda</li>
                                <li>Data akan hilang jika cache browser dibersihkan</li>
                                <li>Gunakan fitur "Export Data" untuk backup manual</li>
                                <li>Jangan gunakan mode incognito untuk data penting</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}