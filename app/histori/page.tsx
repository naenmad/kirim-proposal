'use client'

import { useState, useEffect } from 'react'

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

export default function HistoriPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
    const [filter, setFilter] = useState<'all' | 'sent' | 'pending'>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        try {
            // Menggunakan key yang sama dengan halaman kirim-proposal
            const savedCompanies = localStorage.getItem('himtika-proposal-companies')
            console.log('Loading companies from localStorage:', savedCompanies)

            if (savedCompanies) {
                const companiesData = JSON.parse(savedCompanies)
                setCompanies(companiesData)
                setFilteredCompanies(companiesData)
                console.log('Companies loaded:', companiesData)
            }
        } catch (error) {
            console.error('Error loading companies from localStorage:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    useEffect(() => {
        let filtered = companies

        // Filter by status
        if (filter === 'sent') {
            filtered = companies.filter(c => c.status.whatsapp.sent || c.status.email.sent)
        } else if (filter === 'pending') {
            filtered = companies.filter(c => !c.status.whatsapp.sent && !c.status.email.sent)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.emailPerusahaan.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredCompanies(filtered)
    }, [companies, filter, searchTerm])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (sent: boolean) => {
        return sent ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Terkirim</span>
        ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Belum</span>
        )
    }

    const stats = {
        total: companies.length,
        sent: companies.filter(c => c.status.whatsapp.sent || c.status.email.sent).length,
        pending: companies.filter(c => !c.status.whatsapp.sent && !c.status.email.sent).length,
        whatsappSent: companies.filter(c => c.status.whatsapp.sent).length,
        emailSent: companies.filter(c => c.status.email.sent).length,
    }

    if (!isLoaded) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat histori...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Histori Pengiriman
                    </h1>
                    <p className="text-xl text-gray-600">
                        Pantau riwayat dan status pengiriman proposal sponsorship
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
                        <div className="text-sm text-gray-600">Terkirim</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{stats.whatsappSent}</div>
                        <div className="text-sm text-gray-600">WhatsApp</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{stats.emailSent}</div>
                        <div className="text-sm text-gray-600">Email</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        {/* Search */}
                        <div className="w-full sm:w-1/3">
                            <input
                                type="text"
                                placeholder="Cari perusahaan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setFilter('sent')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'sent' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Terkirim
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {filteredCompanies.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg">
                                {companies.length === 0
                                    ? 'Belum ada data pengiriman'
                                    : searchTerm
                                        ? 'Tidak ada hasil yang ditemukan'
                                        : 'Tidak ada data sesuai filter'
                                }
                            </p>
                            {companies.length === 0 && (
                                <p className="text-sm text-gray-400 mt-2">
                                    Silakan tambahkan perusahaan di halaman "Kirim Proposal" terlebih dahulu
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Perusahaan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kontak
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status WhatsApp
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ditambahkan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCompanies.map((company) => (
                                        <tr key={company.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{company.namaPerusahaan}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <div className={company.emailPerusahaan ? '' : 'text-gray-400'}>
                                                        📧 {company.emailPerusahaan || 'Tidak tersedia'}
                                                    </div>
                                                    <div className={company.nomorWhatsapp ? '' : 'text-gray-400'}>
                                                        📱 {company.nomorWhatsapp || 'Tidak tersedia'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    {getStatusBadge(company.status.whatsapp.sent)}
                                                    {company.status.whatsapp.sent && company.status.whatsapp.dateSent && (
                                                        <div className="text-xs text-gray-500">
                                                            {formatDate(company.status.whatsapp.dateSent)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    {getStatusBadge(company.status.email.sent)}
                                                    {company.status.email.sent && company.status.email.dateSent && (
                                                        <div className="text-xs text-gray-500">
                                                            {formatDate(company.status.email.dateSent)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(company.dateAdded)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}