'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export interface RegisterFormProps {
    onSuccess?: () => void
    redirectTo?: string
    compact?: boolean
    className?: string
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSuccess,
    redirectTo = '/kirim-proposal',
    compact = false,
    className
}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('')

    const router = useRouter()
    const supabase = createClientComponentClient()

    // Password strength checker
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter')
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Konfirmasi password tidak cocok')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (!validateForm()) return

        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        display_name: formData.fullName
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
                }
            })

            if (error) {
                throw error
            }

            if (data.user && !data.session) {
                setMessage('Email konfirmasi telah dikirim! Silakan cek email Anda untuk mengaktifkan akun.')
            } else if (data.session) {
                // Auto login successful
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push(redirectTo)
                    router.refresh()
                }
            }
        } catch (error: any) {
            console.error('Registration error:', error)
            if (error.message?.includes('already registered')) {
                setError('Email sudah terdaftar. Silakan gunakan email lain atau login.')
            } else {
                setError(error.message || 'Terjadi kesalahan saat pendaftaran')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthRegister = async (provider: 'google' | 'github') => {
        setLoading(true)
        setError('')

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
                },
            })

            if (error) {
                throw error
            }
        } catch (error: any) {
            console.error('OAuth register error:', error)
            setError(error.message || `Terjadi kesalahan saat daftar dengan ${provider}`)
            setLoading(false)
        }
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

    const EyeIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    )

    const EyeOffIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
    )

    return (
        <div className={`space-y-6 ${className}`}>
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

            {/* OAuth Buttons */}
            {!compact && (
                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOAuthRegister('google')}
                        disabled={loading}
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Daftar dengan Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleOAuthRegister('github')}
                        disabled={loading}
                    >
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Daftar dengan GitHub
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Atau daftar dengan email</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nama Lengkap"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    required
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    required
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    }
                />

                <div>
                    <Input
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Minimal 6 karakter"
                        required
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                        rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                    />

                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Kekuatan Password:</span>
                                <span className={`text-xs font-medium ${passwordStrength === 'weak' ? 'text-red-500' :
                                    passwordStrength === 'medium' ? 'text-yellow-500' :
                                        passwordStrength === 'strong' ? 'text-green-500' : 'text-gray-400'
                                    }`}>
                                    {passwordStrength === 'weak' ? 'Lemah' :
                                        passwordStrength === 'medium' ? 'Sedang' :
                                            passwordStrength === 'strong' ? 'Kuat' : ''}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                            </div>
                        </div>
                    )}
                </div>

                <Input
                    label="Konfirmasi Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Ulangi password"
                    required
                    error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Password tidak cocok' : undefined}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    }
                    rightIcon={showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <Button
                    type="submit"
                    className="w-full"
                    loading={loading}
                    disabled={loading || formData.password !== formData.confirmPassword}
                >
                    Daftar Sekarang
                </Button>
            </form>
        </div>
    )
}

export { RegisterForm }