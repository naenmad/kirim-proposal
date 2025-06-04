// Helper function to get the correct base URL for redirects
export function getBaseUrl(): string {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    // Check for Vercel deployment
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    // Check for custom app URL
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL
    }

    // Default to localhost for development
    return 'http://localhost:3000'
}

export function getCallbackUrl(): string {
    return `${getBaseUrl()}/auth/callback`
}

export function getAuthRedirectUrl(path: string = '/auth/callback'): string {
    return `${getBaseUrl()}${path}`
}

export function getRegisterRedirectUrl(): string {
    return `${getBaseUrl()}/kirim-proposal`
}

// For debugging
export function logUrls() {
    console.log('🌐 Environment URLs:')
    console.log('Base URL:', getBaseUrl())
    console.log('Callback URL:', getCallbackUrl())
    console.log('Auth Redirect URL:', getAuthRedirectUrl())
    console.log('Redirect URL:', getRegisterRedirectUrl())
    console.log('VERCEL_URL:', process.env.VERCEL_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
}
