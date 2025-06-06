'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
    const router = useRouter()
    const [countdown, setCountdown] = useState(5)
    const [emojiIndex, setEmojiIndex] = useState(0)

    const emojis = ['🤔', '🧐', '🔍', '🗺️', '🧭', '📱', '💻', '🚀']

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        // Emoji rotation timer
        const emojiTimer = setInterval(() => {
            setEmojiIndex((prev) => (prev + 1) % emojis.length)
        }, 500)

        return () => {
            clearInterval(timer)
            clearInterval(emojiTimer)
        }
    }, [emojis.length])

    // Separate effect for handling redirect
    useEffect(() => {
        if (countdown <= 0) {
            router.push('/')
        }
    }, [countdown, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6 flex justify-center items-center">
                    {/* Emoji animation */}
                    <div className="relative">
                        <span className="text-9xl animate-bounce inline-block">
                            {emojis[emojiIndex]}
                        </span>
                        <div className="absolute -top-4 -right-4 bg-red-500 text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center border-4 border-white animate-pulse">
                            404
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                    Waduh! Halaman Tidak Ditemukan
                </h1>

                <div className="text-gray-600 mb-8">
                    <p className="mb-4">
                        Sepertinya Anda tersesat di dunia digital! Halaman yang Anda cari tidak dapat ditemukan.
                    </p>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                        <span className="text-xl">🔎</span>
                        <div className="h-0.5 bg-gray-300 w-24"></div>
                        <span className="text-xl">❓</span>
                        <div className="h-0.5 bg-gray-300 w-24"></div>
                        <span className="text-xl">🏠</span>
                    </div>
                    <p className="text-sm p-2 bg-blue-50 rounded-lg inline-block">
                        Anda akan dialihkan ke beranda dalam <span className="font-bold text-blue-600 text-lg">{countdown}</span> detik...
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Kembali ke Beranda</span>
                        <span className="text-xl">🏠</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Halaman Sebelumnya</span>
                        <span className="text-xl">⬅️</span>
                    </button>
                </div>
            </div>

            <div className="mt-8 flex items-center text-gray-500">
                <p>HIMTIKA UNSIKA © {new Date().getFullYear()}</p>
                <span className="ml-2 text-xl">💙</span>
            </div>
        </div>
    )
}
