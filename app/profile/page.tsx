'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface UserProfile {
    id: string
    full_name: string
    email: string
    phone_number: string
    jabatan: string
    created_at: string
    updated_at: string
}

interface NotificationProps {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    isVisible: boolean
    onClose: () => void
}

// Custom Notification Component
const CustomNotification = ({ type, title, message, isVisible, onClose }: NotificationProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 5000)
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

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        jabatan: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const [notification, setNotification] = useState<{
        isVisible: boolean
        type: 'success' | 'error' | 'warning' | 'info'
        title: string
        message: string
    }>({
        isVisible: false,
        type: 'info',
        title: '',
        message: ''
    })

    // Check authentication and load profile
    useEffect(() => {
        checkAuthAndLoadProfile()
    }, [])

    const checkAuthAndLoadProfile = async () => {
        try {
            setLoading(true)

            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                console.error('Session error:', sessionError)
                router.push('/auth/login')
                return
            }

            if (!session) {
                router.push('/auth/login')
                return
            }

            setUser(session.user)

            // Load user profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (profileError) {
                console.error('Profile error:', profileError)
                showNotification('error', 'Error Profile', 'Gagal memuat data profile. Silakan logout dan login kembali.')
                return
            }

            if (!profileData) {
                showNotification('error', 'Profile Tidak Ditemukan', 'Profile tidak ditemukan. Silakan hubungi administrator.')
                return
            }

            setProfile(profileData)
            setFormData({
                full_name: profileData.full_name || '',
                phone_number: profileData.phone_number || '',
                jabatan: profileData.jabatan || ''
            })

        } catch (error) {
            console.error('Auth error:', error)
            showNotification('error', 'Error Autentikasi', 'Terjadi kesalahan saat memverifikasi akun.')
            router.push('/auth/login')
        } finally {
            setLoading(false)
        }
    }

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.full_name.trim()) {
            showNotification('error', 'Data Tidak Lengkap', 'Nama lengkap harus diisi!')
            return
        }

        try {
            setSaving(true)

            const updateData = {
                full_name: formData.full_name.trim(),
                phone_number: formData.phone_number.trim(),
                jabatan: formData.jabatan.trim(),
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id)

            if (error) throw error

            // Reload profile data
            await checkAuthAndLoadProfile()
            setIsEditing(false)

            showNotification('success', 'Profile Berhasil Diperbarui', 'Data profile Anda telah berhasil disimpan.')

        } catch (error) {
            console.error('Error updating profile:', error)
            showNotification('error', 'Error Database', 'Gagal menyimpan perubahan profile. Silakan coba lagi.')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone_number: profile.phone_number || '',
                jabatan: profile.jabatan || ''
            })
        }
        setIsEditing(false)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat data profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-20">
                        <div className="text-red-600 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-lg text-gray-600">Profile tidak ditemukan</p>
                    </div>
                </div>
            </div>
        )
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

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow">
                                <span className="text-white font-bold text-xl">
                                    {getInitials(profile.full_name || 'User')}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Profile Saya</h1>
                                <p className="text-gray-600">Kelola informasi akun Anda</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </button>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900">Informasi Profile</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                                >
                                    Batal
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap *
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {profile.full_name || '-'}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                                    {profile.email || '-'}
                                    <span className="block text-xs text-gray-400 mt-1">Email tidak dapat diubah</span>
                                </div>
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor HP / WhatsApp
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {profile.phone_number || '-'}
                                    </div>
                                )}
                            </div>

                            {/* Jabatan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jabatan di HIMTIKA
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="jabatan"
                                        value={formData.jabatan}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                        placeholder="Contoh: Ketua Umum, Sekretaris, dll"
                                    />
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {profile.jabatan || '-'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Informasi Akun</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">ID Akun:</span>
                            <span className="ml-2 text-gray-600 font-mono text-xs">{profile.id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Tanggal Dibuat:</span>
                            <span className="ml-2 text-gray-600">{formatDate(profile.created_at)}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Terakhir Diperbarui:</span>
                            <span className="ml-2 text-gray-600">{formatDate(profile.updated_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                💡 Tips Profile
                            </h3>
                            <ul className="text-blue-700 space-y-1 text-sm">
                                <li>• Pastikan nama lengkap sesuai dengan identitas resmi</li>
                                <li>• Nomor HP akan digunakan untuk data pengirim dalam proposal</li>
                                <li>• Jabatan akan ditampilkan dalam signature proposal</li>
                                <li>• Email tidak dapat diubah, hubungi admin jika perlu perubahan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}