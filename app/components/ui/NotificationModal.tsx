'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface NotificationModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    autoClose?: boolean
    autoCloseDelay?: number
}

function NotificationModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    autoClose = false,
    autoCloseDelay = 5000
}: NotificationModalProps) {
    const [countdown, setCountdown] = useState(autoCloseDelay / 1000)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        onClose()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isOpen, autoClose, onClose])

    useEffect(() => {
        if (isOpen) {
            setCountdown(autoCloseDelay / 1000)
        }
    }, [isOpen, autoCloseDelay])

    if (!isOpen) {
        return null
    }

    if (!mounted) {
        return null
    }

    const modalContent = (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="pr-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {title || 'Default Title'}
                    </h3>
                    <div className="text-gray-700 whitespace-pre-line mb-6">
                        {message || 'Default message'}
                    </div>

                    {autoClose && countdown > 0 && (
                        <div className="text-sm text-gray-500 mb-4">
                            Popup akan tertutup otomatis dalam {countdown} detik
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            onClick={onClose}
                        >
                            Tutup
                        </button>
                        {type === 'error' && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                onClick={onClose}
                            >
                                OK, Mengerti
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}

export default NotificationModal
