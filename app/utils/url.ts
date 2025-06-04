// Helper function to get the correct base URL for redirects
export function getBaseUrl(): string {
    // In production (Vercel)
    if (process.env.NODE_ENV === 'production') {
        // Use NEXT_PUBLIC_SITE_URL if set, otherwise construct from Vercel environment
        return process.env.NEXT_PUBLIC_SITE_URL ||
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
            'https://himtika-proposal-system.vercel.app' // fallback - replace with your actual domain
    }

    // In development
    return 'http://localhost:3000'
}

// Get redirect URL for auth callbacks
export function getAuthRedirectUrl(path: string): string {
    return `${getBaseUrl()}${path}`
}
