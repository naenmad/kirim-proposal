'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthCodeError() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const getErrorMessage = () => {
        switch (error) {
            case 'exchange_failed':
                return 'Gagal memverifikasi email. Link konfirmasi mungkin sudah expired.'
            case 'no_code':
                return 'Link konfirmasi tidak valid. Silakan coba lagi.'
            default:
                return 'Terjadi kesalahan saat konfirmasi email.'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Konfirmasi Email Gagal
                </h1>

                <p className="text-gray-600 mb-6">
                    {getErrorMessage()}
                </p>

                <div className="space-y-3">
                    <Link
                        href="/auth/login"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block"
                    >
                        Coba Login
                    </Link>

                    <Link
                        href="/auth/register"
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors block"
                    >
                        Daftar Ulang
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Masih ada masalah? Hubungi tim support HIMTIKA.
                </p>
            </div>
        </div>
    )
}