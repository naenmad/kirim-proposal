'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import NotificationModal from '@/components/ui/NotificationModal'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        jabatan: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('')

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'info' | 'warning' | 'error',
        autoClose: false,
        autoCloseDelay: 5000
    })

    const router = useRouter()
    const supabase = createClient()

    // Helper function to get callback URL
    const getCallbackUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/auth/callback`
        }
        // Fallback for server-side rendering
        return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
    }

    const jabatanOptions = [
        { value: 'Koordinator Sponsorship', label: 'Koordinator Sponsorship' },
        { value: 'Anggota Sponsorship', label: 'Anggota Sponsorship' }
    ]

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push('/kirim-proposal')
            }
        }
        checkSession()
    }, [supabase.auth, router])

    useEffect(() => {
        if (formData.password) {
            const hasUpper = /[A-Z]/.test(formData.password)
            const hasLower = /[a-z]/.test(formData.password)
            const hasNumber = /\d/.test(formData.password)
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
            const isLongEnough = formData.password.length >= 8

            if (isLongEnough && hasUpper && hasLower && hasNumber && hasSpecial) {
                setPasswordStrength('strong')
            } else if (isLongEnough && ((hasUpper && hasLower) || (hasNumber && (hasUpper || hasLower)))) {
                setPasswordStrength('medium')
            } else {
                setPasswordStrength('weak')
            }
        } else {
            setPasswordStrength('')
        }
    }, [formData.password])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '')
        if (numbers.startsWith('62')) {
            return numbers
        } else if (numbers.startsWith('0')) {
            return '62' + numbers.substring(1)
        } else if (numbers.startsWith('8')) {
            return '62' + numbers
        }
        return numbers
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        const formattedValue = formatPhoneNumber(value)
        setFormData(prev => ({
            ...prev,
            phoneNumber: formattedValue
        }))
    }

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Nama lengkap harus diisi')
            return false
        }
        if (!formData.email.trim()) {
            setError('Email harus diisi')
            return false
        }
        if (!formData.phoneNumber.trim()) {
            setError('Nomor telepon harus diisi')
            return false
        }
        if (formData.phoneNumber.length < 10) {
            setError('Nomor telepon tidak valid')
            return false
        }
        if (!formData.jabatan) {
            setError('Jabatan harus dipilih')
            return false
        }
        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter')
            return false
        }
        if (passwordStrength === 'weak' || passwordStrength === '') {
            setError('Password terlalu lemah! Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol dengan minimal 8 karakter.')
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Konfirmasi password tidak cocok')
            return false
        }
        return true
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (!validateForm()) return

        setLoading(true)

        try {
            console.log('=== STARTING REGISTRATION ===')
            console.log('Environment check:')
            console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
            console.log('- Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')
            console.log('Form data:', {
                email: formData.email,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                jabatan: formData.jabatan
            })

            // Check if email already exists before attempting registration
            const { data: existingUsers, error: checkError } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', formData.email)
                .limit(1)

            if (checkError) {
                console.error('Error checking existing email:', checkError)
            } else if (existingUsers && existingUsers.length > 0) {
                setError('Email sudah terdaftar. Silakan gunakan email lain atau login.')
                setLoading(false)
                return
            }

            const redirectUrl = getCallbackUrl()
            console.log('Email redirect URL:', redirectUrl)

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: redirectUrl,
                    data: {
                        full_name: formData.fullName,
                        display_name: formData.fullName,
                        phone_number: formData.phoneNumber,
                        jabatan: formData.jabatan
                    }
                }
            })

            console.log('=== REGISTRATION RESPONSE ===')
            console.log('Data:', data)
            console.log('Error:', error)

            if (error) {
                console.error('Registration error:', error)
                throw error
            }

            if (data.user) {
                console.log('=== USER CREATED SUCCESSFULLY ===')
                console.log('User ID:', data.user.id)
                console.log('User email:', data.user.email)
                console.log('Email confirmed at:', data.user.email_confirmed_at)
                console.log('User metadata:', data.user.user_metadata)

                // Check if email confirmation is disabled or user is auto-confirmed
                const isDevelopment = process.env.NODE_ENV === 'development'
                const isEmailConfirmed = !!data.user.email_confirmed_at

                console.log('Development mode:', isDevelopment)
                console.log('Email confirmed:', isEmailConfirmed)

                if (isEmailConfirmed || isDevelopment) {
                    // User is confirmed OR we're in development mode
                    // Profile will be created by the callback handler
                    console.log('=== USER CONFIRMED - PROFILE WILL BE CREATED VIA CALLBACK ===')

                    setModalConfig({
                        title: '🎉 Akun Berhasil Dibuat!',
                        message: `Selamat! Akun Anda telah berhasil dibuat dan dikonfirmasi.

✅ Email: ${formData.email}
👤 Nama: ${formData.fullName}
📋 Jabatan: ${formData.jabatan}

Anda akan dialihkan ke halaman utama dalam beberapa detik...`,
                        type: 'success',
                        autoClose: true,
                        autoCloseDelay: 5000
                    })
                    setShowModal(true)

                    setTimeout(() => {
                        router.push('/kirim-proposal')
                    }, 5000)
                } else {
                    console.log('=== EMAIL CONFIRMATION REQUIRED ===')

                    setModalConfig({
                        title: '📧 Konfirmasi Email Diperlukan',
                        message: `Akun Anda telah dibuat, namun perlu dikonfirmasi terlebih dahulu.

✅ Email konfirmasi telah dikirim ke:
${formData.email}

📧 Silakan cek:
• Inbox email Anda
• Folder Spam/Junk
• Folder Promosi (jika menggunakan Gmail)

🔗 Klik link konfirmasi untuk mengaktifkan akun

⚠️ Jika email tidak diterima dalam 5 menit, hubungi administrator.

Setelah dikonfirmasi, Anda dapat login dengan email dan password yang telah dibuat.`,
                        type: 'info',
                        autoClose: false,
                        autoCloseDelay: 0
                    })
                    setShowModal(true)

                    // Reset form
                    setFormData({
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        password: '',
                        confirmPassword: '',
                        jabatan: ''
                    })
                }
            }
        } catch (error: any) {
            console.error('Registration error:', error)

            let errorMessage = 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.'

            if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
                errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            } else if (error.message?.includes('Invalid email')) {
                errorMessage = 'Format email tidak valid.'
            } else if (error.message?.includes('Password should be at least 6 characters')) {
                errorMessage = 'Password minimal 6 karakter.'
            } else if (error.message) {
                errorMessage = error.message
            }

            setModalConfig({
                title: '❌ Pendaftaran Gagal',
                message: `Maaf, terjadi kesalahan saat mendaftar:

${errorMessage}

Silakan coba lagi atau hubungi administrator jika masalah berlanjut.`,
                type: 'error',
                autoClose: false,
                autoCloseDelay: 0
            })
            setShowModal(true)
        } finally {
            setLoading(false)
        }
    }

    const handleComingSoonClick = (provider: string) => {
        setModalConfig({
            title: '🚧 Fitur Segera Hadir',
            message: `Daftar dengan ${provider} akan segera tersedia!

Saat ini Anda masih bisa mendaftar menggunakan email dan password.

Terima kasih atas kesabarannya! 🙏`,
            type: 'info',
            autoClose: true,
            autoCloseDelay: 3000
        })
        setShowModal(true)
    }

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak': return 'bg-red-500'
            case 'medium': return 'bg-yellow-500'
            case 'strong': return 'bg-green-500'
            default: return 'bg-gray-300'
        }
    }

    const getPasswordStrengthWidth = () => {
        switch (passwordStrength) {
            case 'weak': return 'w-1/3'
            case 'medium': return 'w-2/3'
            case 'strong': return 'w-full'
            default: return 'w-0'
        }
    }

    const formatDisplayPhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber) return ''

        if (phoneNumber.startsWith('62')) {
            const number = phoneNumber.substring(2)
            if (number.length >= 9) {
                return `+62 ${number.substring(0, 3)}-${number.substring(3, 7)}-${number.substring(7)}`
            }
        }
        return phoneNumber
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-2xl">H</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Daftar ke Prosal System
                    </h2>
                    <p className="text-gray-600">
                        Bergabung dengan Sistem Manajemen Proposal Sponsorship
                    </p>                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleComingSoonClick('Google')}
                        disabled={true}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed relative transition-all hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5 mr-3 opacity-50" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="flex-1">Daftar dengan Google</span>
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Coming Soon
                        </span>
                    </button>

                    <button
                        onClick={() => handleComingSoonClick('GitHub')}
                        disabled={true}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed relative transition-all hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5 mr-3 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span className="flex-1">Daftar dengan GitHub</span>
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Coming Soon
                        </span>
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">Atau daftar dengan email</span>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Lengkap
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                            placeholder="nama@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Nomor Telepon
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">🇮🇩</span>
                            </div>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                                required
                                className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                                placeholder="081234567890"
                            />
                        </div>
                        {formData.phoneNumber && (
                            <p className="mt-1 text-sm text-gray-500">
                                Format: {formatDisplayPhoneNumber(formData.phoneNumber)}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                            Nomor akan otomatis diformat ke format Indonesia (+62)
                        </p>
                    </div>

                    <div>
                        <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-2">
                            Jabatan
                        </label>
                        <div className="relative">
                            <select
                                id="jabatan"
                                name="jabatan"
                                value={formData.jabatan}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 appearance-none"
                            >
                                <option value="">Pilih jabatan...</option>
                                {jabatanOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Pilih jabatan Anda di tim sponsorship HIMTIKA
                        </p>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Minimal 6 karakter"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-500">Kekuatan Password</span>
                                    <span className={`text-xs capitalize ${passwordStrength === 'strong' ? 'text-green-600' :
                                        passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {passwordStrength === 'strong' ? 'Kuat' :
                                            passwordStrength === 'medium' ? 'Sedang' : 'Lemah'}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Ulangi password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mendaftar...
                            </div>
                        ) : (
                            'Daftar Sekarang'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
                        >
                            Login di sini
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </p>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Dengan mendaftar, Anda menyetujui{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                            Syarat & Ketentuan
                        </a>{' '}
                        dan{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                            Kebijakan Privasi
                        </a>                    </p>
                </div>
            </div>

            {/* Notification Modal */}
            <NotificationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                autoClose={modalConfig.autoClose}
                autoCloseDelay={modalConfig.autoCloseDelay}
            />
        </div>
    )
}
