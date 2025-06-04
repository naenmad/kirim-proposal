import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'secondary' | 'link' | 'success' | 'warning'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const getVariantClass = () => {
      switch (variant) {
        case 'ghost':
          return 'hover:bg-gray-100 text-gray-700'
        case 'outline':
          return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        case 'destructive':
          return 'bg-red-600 text-white hover:bg-red-700'
        case 'secondary':
          return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        case 'link':
          return 'underline-offset-4 hover:underline text-blue-600'
        case 'success':
          return 'bg-green-600 text-white hover:bg-green-700'
        case 'warning':
          return 'bg-yellow-600 text-white hover:bg-yellow-700'
        default:
          return 'bg-blue-600 text-white hover:bg-blue-700'
      }
    }

    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return 'h-9 px-3 text-sm'
        case 'lg':
          return 'h-11 px-8 text-base'
        case 'icon':
          return 'h-10 w-10'
        case 'xs':
          return 'h-8 px-2 text-xs'
        default:
          return 'h-10 px-4 py-2 text-sm'
      }
    }

    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50'
    const variantClass = getVariantClass()
    const sizeClass = getSizeClass()
    const finalClassName = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim()

    return (
      <button
        className={finalClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
export { Button }
export type { ButtonProps }