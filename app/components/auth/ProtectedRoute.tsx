'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'

export interface ProtectedRouteProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    requireAuth?: boolean
    redirectTo?: string
    allowedRoles?: string[]
    className?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback,
    requireAuth = true,
    redirectTo = '/auth/login',
    allowedRoles,
    className
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                const currentUser = session?.user || null

                setUser(currentUser)

                if (!requireAuth) {
                    setAuthorized(true)
                    setLoading(false)
                    return
                }

                if (!currentUser) {
                    setAuthorized(false)
                    setLoading(false)
                    return
                }

                // Check roles if specified
                if (allowedRoles && allowedRoles.length > 0) {
                    const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role || 'user'
                    const hasValidRole = allowedRoles.includes(userRole)

                    setAuthorized(hasValidRole)
                } else {
                    setAuthorized(true)
                }

                setLoading(false)
            } catch (error) {
                console.error('Auth check error:', error)
                setAuthorized(false)
                setLoading(false)
            }
        }

        checkAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user || null
                setUser(currentUser)

                if (!requireAuth) {
                    setAuthorized(true)
                    return
                }

                if (!currentUser) {
                    setAuthorized(false)
                    return
                }

                // Check roles if specified
                if (allowedRoles && allowedRoles.length > 0) {
                    const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role || 'user'
                    const hasValidRole = allowedRoles.includes(userRole)

                    setAuthorized(hasValidRole)
                } else {
                    setAuthorized(true)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [requireAuth, allowedRoles, supabase.auth])

    // Redirect if not authorized
    useEffect(() => {
        if (!loading && !authorized && requireAuth) {
            const currentPath = window.location.pathname
            const redirectUrl = `${redirectTo}?next=${encodeURIComponent(currentPath)}`
            router.push(redirectUrl)
        }
    }, [loading, authorized, requireAuth, redirectTo, router])

    // Loading state
    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat...</p>
                </div>
            </div>
        )
    }

    // Not authorized
    if (requireAuth && !authorized) {
        if (fallback) {
            return <div className={className}>{fallback}</div>
        }

        return (
            <div className={`flex items-center justify-center min-h-screen ${className}`}>
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Akses Ditolak
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {!user
                            ? 'Anda perlu login untuk mengakses halaman ini.'
                            : 'Anda tidak memiliki izin untuk mengakses halaman ini.'
                        }
                    </p>
                    <div className="space-y-3">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => router.push('/auth/login')}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Kembali ke Beranda
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => router.back()}
                                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Kembali
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Authorized - render children
    return <div className={className}>{children}</div>
}

export { ProtectedRoute }