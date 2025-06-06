'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

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
    createdBy?: string
    createdByName?: string
}

export default function HistoriPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
    const [filter, setFilter] = useState<'all' | 'sent' | 'pending'>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [userFilter, setUserFilter] = useState<'all' | 'me' | 'specific'>('all')
    const [userProfile, setUserProfile] = useState<any>(null)
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>('')

    // Load companies from Supabase
    useEffect(() => {
        const loadCompaniesFromSupabase = async () => {
            try {
                const { data, error } = await supabase
                    .from('companies')
                    .select(`
                        id,
                        nama_perusahaan,
                        email_perusahaan,
                        nomor_whatsapp,
                        date_added,
                        created_by,
                        created_by_name,
                        whatsapp_sent,
                        whatsapp_date_sent,
                        whatsapp_sent_by,
                        whatsapp_sent_by_name,
                        whatsapp_sent_by_phone,
                        email_sent,
                        email_date_sent,
                        email_sent_by,
                        email_sent_by_name,
                        email_sent_by_phone
                    `)
                    .order('date_added', { ascending: false })

                if (error) throw error

                const mapped = (data || []).map((item: any) => ({
                    id: item.id,
                    namaPerusahaan: item.nama_perusahaan,
                    emailPerusahaan: item.email_perusahaan,
                    nomorWhatsapp: item.nomor_whatsapp,
                    dateAdded: item.date_added,
                    createdBy: item.created_by,
                    createdByName: item.created_by_name ?? '-',
                    status: {
                        whatsapp: {
                            sent: item.whatsapp_sent,
                            dateSent: item.whatsapp_date_sent || undefined,
                        },
                        email: {
                            sent: item.email_sent,
                            dateSent: item.email_date_sent || undefined,
                        }
                    }
                }))
                setCompanies(mapped)
                setFilteredCompanies(mapped)
            } catch (error) {
                console.error('Error loading companies from Supabase:', error)
                setCompanies([])
                setFilteredCompanies([])
            } finally {
                setIsLoaded(true)
            }
        }

        loadCompaniesFromSupabase()
    }, [])

    // Get user ID from Supabase
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUserId(data?.user?.id ?? null)
        }
        getUser()
    }, [])

    // Load user profile and all users for koordinator
    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) return

            try {
                // Load current user profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (profileError) {
                    console.error('Error loading profile:', profileError)
                    return
                }

                setUserProfile(profileData)

                // If user is Koordinator Sponsorship, load all users
                if (profileData?.jabatan === 'Koordinator Sponsorship') {
                    const { data: allUsersData, error: usersError } = await supabase
                        .from('profiles')
                        .select('id, full_name, jabatan')
                        .order('full_name')

                    if (usersError) {
                        console.error('Error loading users:', usersError)
                        return
                    }

                    setAllUsers(allUsersData || [])
                }
            } catch (error) {
                console.error('Error loading user data:', error)
            }
        }

        loadUserData()
    }, [userId])

    // Filter companies based on user selection, status, and search term
    useEffect(() => {
        let filtered = companies

        // Filter by user - enhanced for koordinator role
        if (userFilter === 'me' && userId) {
            filtered = filtered.filter(c => c.createdBy === userId)
        } else if (userFilter === 'specific' && selectedUserId) {
            filtered = filtered.filter(c => c.createdBy === selectedUserId)
        }

        // Filter by status
        if (filter === 'sent') {
            filtered = filtered.filter(c => c.status.whatsapp.sent || c.status.email.sent)
        } else if (filter === 'pending') {
            filtered = filtered.filter(c => !c.status.whatsapp.sent && !c.status.email.sent)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.emailPerusahaan.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredCompanies(filtered)
    }, [companies, filter, searchTerm, userFilter, userId, selectedUserId])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (sent: boolean, hasContact: boolean) => {
        if (!hasContact) {
            return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Tidak Ada</span>
        }
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

                    {/* Filter User - Enhanced for Koordinator */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
                        <label className="text-sm font-medium text-gray-700">Lihat data dari:</label>
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <select
                                value={userFilter}
                                onChange={e => {
                                    const value = e.target.value as 'all' | 'me' | 'specific'
                                    setUserFilter(value)
                                    if (value !== 'specific') {
                                        setSelectedUserId('')
                                    }
                                }}
                                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                            >
                                <option value="all" className="text-gray-800 font-medium">Semua user</option>
                                <option value="me" className="text-gray-800 font-medium">Saya saja</option>
                                {userProfile?.jabatan === 'Koordinator Sponsorship' && (
                                    <option value="specific" className="text-gray-800 font-medium">User tertentu</option>
                                )}
                            </select>

                            {/* User Selection Dropdown for Koordinator */}
                            {userFilter === 'specific' && userProfile?.jabatan === 'Koordinator Sponsorship' && (
                                <select
                                    value={selectedUserId}
                                    onChange={e => setSelectedUserId(e.target.value)}
                                    className="px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-medium text-gray-800 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                                >
                                    <option value="" className="text-gray-600">Pilih user...</option>
                                    {allUsers.map(user => (
                                        <option key={user.id} value={user.id} className="text-gray-800">
                                            {user.full_name} ({user.jabatan})
                                        </option>
                                    ))}
                                </select>
                            )}
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
                                <div className="space-y-2 mt-4">
                                    <p className="text-sm text-gray-400">
                                        Silakan tambahkan perusahaan di halaman "Kirim Proposal" terlebih dahulu
                                    </p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
                                        <p className="text-sm text-blue-700">
                                            💡 <strong>Info:</strong> Data akan tersinkronisasi otomatis
                                        </p>
                                    </div>
                                </div>
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
                                        {userFilter === 'all' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ditambahkan Oleh
                                            </th>
                                        )}
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
                                                    {getStatusBadge(company.status.whatsapp.sent, !!company.nomorWhatsapp)}
                                                    {company.status.whatsapp.sent && company.status.whatsapp.dateSent && (
                                                        <div className="text-xs text-gray-500">
                                                            {formatDate(company.status.whatsapp.dateSent)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    {getStatusBadge(company.status.email.sent, !!company.emailPerusahaan)}
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
                                            {userFilter === 'all' && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {company.createdByName}
                                                </td>
                                            )}
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
