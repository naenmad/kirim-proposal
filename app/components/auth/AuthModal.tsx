'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from './LoginForm'
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