import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    onRightIconClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        type,
        label,
        error,
        helperText,
        leftIcon,
        rightIcon,
        onRightIconClick,
        id,
        ...props
    }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 sm:text-sm">{leftIcon}</span>
                        </div>
                    )}

                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            'w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-red-300 focus:ring-red-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {onRightIconClick ? (
                                <button
                                    type="button"
                                    onClick={onRightIconClick}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {rightIcon}
                                </button>
                            ) : (
                                <span className="text-gray-400">{rightIcon}</span>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }