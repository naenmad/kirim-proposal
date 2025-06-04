'use client'

import { FormEvent, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { RegisterForm } from './RegisterForm'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    initialMode?: 'login' | 'register'
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    initialMode = 'login'
}) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode)

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                {mode === 'login' ? (
                    <LoginForm
                        onSuccess={onClose}
                        onSwitchToRegister={() => setMode('register')}
                    />
                ) : (
                    <RegisterForm
                        onSuccess={onClose}
                        onSwitchToLogin={() => setMode('login')}
                    />
                )}
            </div>
        </Modal>
    )
}

export interface LoginFormProps {
    onSuccess: () => void
    onSwitchToRegister: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        // … proses login …
        onSuccess()
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* input email/password */}
            <button type="submit">Login</button>
            <button
                type="button"
                className="text-sm text-blue-600 mt-2"
                onClick={onSwitchToRegister}
            >
                Belum punya akun? Daftar
            </button>
        </form>
    )
}