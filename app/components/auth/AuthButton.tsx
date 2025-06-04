'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Button from '@/components/ui/Button' // Ubah ini - hapus kurung kurawal
import { User } from '@supabase/supabase-js'

export interface AuthButtonProps {
    onLoginClick?: () => void
    showUserMenu?: boolean
    className?: string
}

const AuthButton: React.FC<AuthButtonProps> = ({
    onLoginClick,
    showUserMenu = true,
    className
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDropdown, setShowDropdown] = useState(false)

    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
        setShowDropdown(false)
    }

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick()
        } else {
            router.push('/auth/login')
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoginClick}
                >
                    Masuk
                </Button>
                <Button
                    size="sm"
                    onClick={() => router.push('/auth/register')}
                >
                    Daftar
                </Button>
            </div>
        )
    }

    if (!showUserMenu) {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={className}
            >
                Keluar
            </Button>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                    </span>
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                                {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={() => {
                                    router.push('/profile')
                                    setShowDropdown(false)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profil
                            </button>
                            <button
                                onClick={() => {
                                    router.push('/settings')
                                    setShowDropdown(false)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Pengaturan
                            </button>
                            <hr className="my-1" />
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export { AuthButton }