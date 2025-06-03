'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

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

    const router = useRouter()
    const supabase = createClient()

    const jabatanOptions = [
        { value: 'Ketua Sponsorship', label: 'Ketua Sponsorship' },
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
            console.log('Starting registration with data:', {
                email: formData.email,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                jabatan: formData.jabatan
            })

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: formData.fullName,
                        display_name: formData.fullName,
                        phone_number: formData.phoneNumber,
                        jabatan: formData.jabatan
                    }
                }
            })

            console.log('Registration response:', { data, error })

            if (error) {
                throw error
            }

            if (data.user) {
                console.log('User created:', data.user.id)
                console.log('User metadata sent:', data.user.user_metadata)

                if (data.user.email_confirmed_at) {
                    setMessage('Akun berhasil dibuat! Anda akan dialihkan...')
                    setTimeout(() => {
                        router.push('/kirim-proposal')
                    }, 2000)
                } else {
                    setMessage(`Email konfirmasi telah dikirim ke ${formData.email}. Silakan cek inbox dan spam folder Anda untuk mengaktifkan akun.`)
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

            if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
                setError('Email sudah terdaftar. Silakan gunakan email lain atau login.')
            } else if (error.message?.includes('Invalid email')) {
                setError('Format email tidak valid.')
            } else if (error.message?.includes('Password should be at least 6 characters')) {
                setError('Password minimal 6 karakter.')
            } else {
                setError(error.message || 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleComingSoonClick = (provider: string) => {
        setMessage(`Daftar dengan ${provider} akan segera tersedia!`)
        setTimeout(() => setMessage(''), 3000)
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
                        Daftar ke HIMTIKA
                    </h2>
                    <p className="text-gray-600">
                        Bergabung dengan Sistem Manajemen Proposal Sponsorship
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-green-700 text-sm">{message}</p>
                        </div>
                    </div>
                )}

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
                                <option value="">Pilih Jabatan</option>
                                {jabatanOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
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
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Minimal 8 karakter dengan kombinasi yang kuat"
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
                                    <span className="text-xs text-gray-500">Kekuatan Password:</span>
                                    <span className={`text-xs font-medium ${passwordStrength === 'weak' ? 'text-red-500' :
                                            passwordStrength === 'medium' ? 'text-yellow-500' :
                                                passwordStrength === 'strong' ? 'text-green-500' : 'text-gray-400'
                                        }`}>
                                        {passwordStrength === 'weak' ? 'Lemah ❌' :
                                            passwordStrength === 'medium' ? 'Sedang ⚠️' :
                                                passwordStrength === 'strong' ? 'Kuat ✅' : ''}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                                </div>

                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-600 font-medium">Persyaratan Password:</p>
                                    <div className="space-y-1">
                                        <div className={`flex items-center text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className="mr-1">{formData.password.length >= 8 ? '✅' : '❌'}</span>
                                            Minimal 8 karakter
                                        </div>
                                        <div className={`flex items-center text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className="mr-1">{/[A-Z]/.test(formData.password) ? '✅' : '❌'}</span>
                                            Mengandung huruf besar (A-Z)
                                        </div>
                                        <div className={`flex items-center text-xs ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className="mr-1">{/[a-z]/.test(formData.password) ? '✅' : '❌'}</span>
                                            Mengandung huruf kecil (a-z)
                                        </div>
                                        <div className={`flex items-center text-xs ${/\d/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className="mr-1">{/\d/.test(formData.password) ? '✅' : '❌'}</span>
                                            Mengandung angka (0-9)
                                        </div>
                                        <div className={`flex items-center text-xs ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className="mr-1">{/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✅' : '❌'}</span>
                                            Mengandung simbol (!@#$%^&*)
                                        </div>
                                    </div>

                                    {passwordStrength === 'weak' && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-xs text-red-700">
                                                <strong>⚠️ Password terlalu lemah!</strong> Penuhi semua persyaratan di atas untuk melanjutkan registrasi.
                                            </p>
                                        </div>
                                    )}
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
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-white text-gray-900 placeholder-gray-500"
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
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">Password tidak cocok</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            Saya setuju dengan{' '}
                            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                                Syarat & Ketentuan
                            </Link>
                            {' '}dan{' '}
                            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                                Kebijakan Privasi
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || passwordStrength === 'weak' || passwordStrength === ''}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading || passwordStrength === 'weak' || passwordStrength === ''
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                </svg>
                                Memproses...
                            </div>
                        ) : passwordStrength === 'weak' || passwordStrength === '' ? (
                            'Password Terlalu Lemah'
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
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    )
}