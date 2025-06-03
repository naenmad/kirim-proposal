import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    {
        variants: {
            variant: {
                default: 'bg-blue-600 text-white hover:bg-blue-700',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
                outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                ghost: 'hover:bg-gray-100 text-gray-700',
                link: 'underline-offset-4 hover:underline text-blue-600',
                success: 'bg-green-600 text-white hover:bg-green-700',
                warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                icon: 'h-10 w-10',
                xs: 'h-8 px-2 text-xs',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

// Tambahkan tipe props Button
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            ref={ref}
            {...props}
        />
    )
)
Button.displayName = 'Button'

    < Button
variant = "ghost" // harus persis salah satu dari: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning"
size = "sm"       // harus persis salah satu dari: "default" | "sm" | "lg" | "icon" | "xs"
onClick = { handleLoginClick }
    >
    Login
</Button >