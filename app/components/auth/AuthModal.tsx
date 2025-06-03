'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { Button } from '@/components/ui/Button'

export interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'login' | 'register'
    redirectTo?: string
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    defaultTab = 'login',
    redirectTo
}) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)

    const handleSuccess = () => {
        onClose()
    }

    const handleSwitchTab = (tab: 'login' | 'register') => {
        setActiveTab(tab)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            showCloseButton={true}
        >
            <div className="w-full max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {activeTab === 'login' ? 'Masuk ke HIMTIKA' : 'Bergabung dengan HIMTIKA'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {activeTab === 'login'
                            ? 'Akses semua fitur sistem proposal'
                            : 'Daftar untuk menggunakan sistem proposal'
                        }
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => handleSwitchTab('login')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'login'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Masuk
                    </button>
                    <button
                        onClick={() => handleSwitchTab('register')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'register'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Daftar
                    </button>
                </div>

                {/* Form Content */}
                <div className="space-y-4">
                    {activeTab === 'login' ? (
                        <LoginForm
                            onSuccess={handleSuccess}
                            redirectTo={redirectTo}
                            compact={true}
                        />
                    ) : (
                        <RegisterForm
                            onSuccess={handleSuccess}
                            redirectTo={redirectTo}
                            compact={true}
                        />
                    )}
                </div>

                {/* Switch Form Link */}
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        {activeTab === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                        <button
                            onClick={() => handleSwitchTab(activeTab === 'login' ? 'register' : 'login')}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            {activeTab === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
                        </button>
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export { AuthModal }'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { Button } from '@/components/ui/Button'

export interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'login' | 'register'
    redirectTo?: string
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    defaultTab = 'login',
    redirectTo
}) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)

    const handleSuccess = () => {
        onClose()
    }

    const handleSwitchTab = (tab: 'login' | 'register') => {
        setActiveTab(tab)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            showCloseButton={true}
        >
            <div className="w-full max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {activeTab === 'login' ? 'Masuk ke HIMTIKA' : 'Bergabung dengan HIMTIKA'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {activeTab === 'login'
                            ? 'Akses semua fitur sistem proposal'
                            : 'Daftar untuk menggunakan sistem proposal'
                        }
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => handleSwitchTab('login')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'login'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Masuk
                    </button>
                    <button
                        onClick={() => handleSwitchTab('register')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'register'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Daftar
                    </button>
                </div>

                {/* Form Content */}
                <div className="space-y-4">
                    {activeTab === 'login' ? (
                        <LoginForm
                            onSuccess={handleSuccess}
                            redirectTo={redirectTo}
                            compact={true}
                        />
                    ) : (
                        <RegisterForm
                            onSuccess={handleSuccess}
                            redirectTo={redirectTo}
                            compact={true}
                        />
                    )}
                </div>

                {/* Switch Form Link */}
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        {activeTab === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                        <button
                            onClick={() => handleSwitchTab(activeTab === 'login' ? 'register' : 'login')}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            {activeTab === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
                        </button>
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export { AuthModal }