'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { getAuthRedirectUrl } from '@/utils/url'
import NotificationModal from '../../components/ui/NotificationModal'

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)

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
    const searchParams = useSearchParams()
    const supabase = createClient()

    // Check for existing session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const nextUrl = searchParams.get('next') || '/kirim-proposal'
                router.push(nextUrl)
            }
        }
        checkSession()
    }, [supabase.auth, router, searchParams])

    // Handle URL error messages
    useEffect(() => {
        const urlError = searchParams.get('error')
        const urlMessage = searchParams.get('message')

        if (urlError) {
            let errorMessage = ''
            switch (urlError) {
                case 'callback_error':
                    errorMessage = 'Terjadi kesalahan saat proses login. Silakan coba lagi.'
                    break
                case 'unexpected_error':
                    errorMessage = 'Terjadi kesalahan tak terduga. Silakan coba lagi.'
                    break
                case 'missing_code':
                    errorMessage = 'Kode autentikasi tidak ditemukan. Silakan coba lagi.'
                    break
                default:
                    errorMessage = urlError
            }

            setModalConfig({
                title: '❌ Error Login',
                message: `Terjadi kesalahan saat login:

${errorMessage}

Silakan coba lagi atau hubungi administrator jika masalah berlanjut.`,
                type: 'error',
                autoClose: false,
                autoCloseDelay: 0
            })
            setShowModal(true)
        }

        if (urlMessage) {
            setModalConfig({
                title: '📧 Informasi',
                message: urlMessage,
                type: 'info',
                autoClose: false,
                autoCloseDelay: 0
            })
            setShowModal(true)
        }
    }, [searchParams])

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            console.log('Login attempt with:', {
                emailProvided: !!email,
                passwordProvided: !!password,
                supabaseInitialized: !!supabase,
                envVarsPresent: {
                    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                    key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                }
            });

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            }); if (error) {
                console.error('Login error details:', error);
                if (error.message.includes('Invalid API key')) {
                    console.error('API Key Error - Check .env.local configuration');
                    console.error('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
                    console.error('Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0);

                    setModalConfig({
                        title: '⚙️ Error Konfigurasi',
                        message: `Terjadi kesalahan konfigurasi sistem:

Error konfigurasi API Supabase. Hubungi administrator.

Pastikan file .env.local sudah dikonfigurasi dengan benar.`,
                        type: 'error',
                        autoClose: false,
                        autoCloseDelay: 0
                    })
                    setShowModal(true)
                } else {
                    throw error;
                }
            }

            if (data.user) {
                const nextUrl = searchParams.get('next') || '/kirim-proposal'
                router.push(nextUrl)
                router.refresh()
            }
        } catch (error: any) {
            console.error('Login error:', error)

            let errorMessage = 'Terjadi kesalahan saat login'
            let errorTitle = '❌ Login Gagal'

            if (error.message?.includes('Invalid login credentials')) {
                errorTitle = '🔐 Email atau Password Salah'
                errorMessage = `Email atau password yang Anda masukkan salah.

📧 Email: ${email}

Pastikan:
• Email sudah benar
• Password sudah benar
• Caps Lock tidak aktif
• Akun sudah terdaftar dan terverifikasi

Jika lupa password, gunakan fitur "Lupa Password".`
            } else if (error.message?.includes('Email not confirmed')) {
                errorTitle = '📧 Email Belum Dikonfirmasi'
                errorMessage = `Akun Anda belum dikonfirmasi.

📧 Email: ${email}

Silakan cek email Anda dan klik link konfirmasi yang telah dikirim.

Jika tidak menemukan email konfirmasi:
• Cek folder Spam/Junk
• Cek folder Promosi (Gmail)
• Tunggu beberapa menit dan coba lagi

Hubungi administrator jika masalah berlanjut.`
            } else if (error.message?.includes('Too many requests')) {
                errorTitle = '⏱️ Terlalu Banyak Percobaan'
                errorMessage = `Anda telah melakukan terlalu banyak percobaan login.

Silakan tunggu beberapa menit sebelum mencoba lagi.

Tips:
• Pastikan email dan password sudah benar
• Gunakan fitur "Lupa Password" jika perlu
• Hubungi administrator jika masalah berlanjut`
            } else if (error.message?.includes('Invalid email')) {
                errorTitle = '📧 Format Email Tidak Valid'
                errorMessage = `Format email yang Anda masukkan tidak valid.

📧 Email: ${email}

Pastikan email menggunakan format yang benar:
• contoh@email.com
• nama.lengkap@domain.co.id
• user123@gmail.com`
            } else {
                errorMessage = error.message || errorMessage
            }

            setModalConfig({
                title: errorTitle,
                message: errorMessage,
                type: 'error',
                autoClose: false,
                autoCloseDelay: 0
            })
            setShowModal(true)
        } finally {
            setLoading(false)
        }
    }; const handleForgotPassword = async () => {
        if (!email) {
            setModalConfig({
                title: '📧 Email Diperlukan',
                message: `Silakan masukkan email terlebih dahulu untuk reset password.

Langkah-langkah:
1. Masukkan email Anda di kolom email
2. Klik tombol "Lupa password?"
3. Cek email untuk link reset password`,
                type: 'warning',
                autoClose: false,
                autoCloseDelay: 0
            })
            setShowModal(true)
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: getAuthRedirectUrl('/auth/reset-password'),
            })

            if (error) {
                throw error
            }

            setModalConfig({
                title: '📧 Email Reset Password Terkirim',
                message: `Link reset password telah berhasil dikirim!

📧 Email tujuan: ${email}

Langkah selanjutnya:
1. Cek inbox email Anda
2. Cek folder Spam/Junk jika tidak ada di inbox
3. Klik link reset password dalam email
4. Buat password baru
5. Login dengan password baru

⚠️ Link reset password akan expired dalam 1 jam.

Jika email tidak diterima dalam 5 menit, coba kirim ulang atau hubungi administrator.`,
                type: 'success',
                autoClose: false,
                autoCloseDelay: 0
            })
            setShowModal(true)
        } catch (error: any) {
            let errorMessage = 'Terjadi kesalahan saat mengirim email reset'

            if (error.message?.includes('User not found')) {
                errorMessage = `Email tidak ditemukan dalam sistem.

📧 Email: ${email}

Kemungkinan:
• Email belum terdaftar
• Email salah ketik
• Gunakan email lain yang sudah terdaftar

Silakan daftar akun baru jika belum memiliki akun.`
            } else if (error.message?.includes('Email rate limit exceeded')) {
                errorMessage = `Terlalu banyak permintaan reset password.

📧 Email: ${email}

Silakan tunggu beberapa menit sebelum mencoba lagi.

Jika sudah menerima email reset sebelumnya, gunakan link tersebut.`
            } else {
                errorMessage = error.message || errorMessage
            }

            setModalConfig({
                title: '❌ Gagal Mengirim Email Reset',
                message: errorMessage,
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
        setMessage(`Login dengan ${provider} akan segera tersedia!`)
        setTimeout(() => setMessage(''), 3000)
    }

    // SVG icons as separate components to avoid syntax errors
    const EyeIcon = () => (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    )

    const EyeOffIcon = () => (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-2xl">H</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Masuk ke HIMTIKA
                    </h2>
                    <p className="text-gray-600">
                        Sistem Manajemen Proposal Sponsorship
                    </p>
                </div>

                {/* Error/Success Messages */}
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

                {/* OAuth Login Buttons - Coming Soon */}
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
                        <span className="flex-1">Masuk dengan Google</span>
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
                        <span className="flex-1">Masuk dengan GitHub</span>
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Coming Soon
                        </span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">Masuk dengan email</span>
                    </div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                            placeholder="nama@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Masukkan password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Ingat saya
                            </label>
                        </div>                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Kirim Reset Email
                            </button>
                            <span className="text-gray-300">|</span>
                            <Link
                                href="/auth/reset-password"
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Reset Password
                            </Link>
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
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                </svg>
                                Memproses...
                            </div>
                        ) : (
                            'Masuk'
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link
                            href="/auth/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>                </div>
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

// Loading component for Suspense fallback
function LoginLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-2xl">H</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Memuat...
                    </h2>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginContent />
        </Suspense>
    )
}