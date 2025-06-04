/**
 * URL utility functions for authentication and redirects
 */

/**
 * Gets the base URL for the application
 * Automatically detects environment (development/production)
 */
export function getBaseUrl() {
    // Check for Vercel deployment
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Check for custom app URL from env
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    // Default to localhost for development
    return 'http://localhost:3000';
}

/**
 * Gets the auth callback URL
 */
export function getCallbackUrl() {
    return `${getBaseUrl()}/auth/callback`;
}

/**
 * Gets a redirect URL with the base URL prepended
 */
export function getAuthRedirectUrl(path: string) {
    return `${getBaseUrl()}${path}`;
}

/**
 * Gets the register redirect URL
 */
export function getRegisterRedirectUrl() {
    return `${getBaseUrl()}/kirim-proposal`;
}

/**
 * For debugging - logs all URL configurations
 */
export function logUrls() {
    console.log('🌐 Environment URLs:');
    console.log('Base URL:', getBaseUrl());
    console.log('Callback URL:', getCallbackUrl());
    console.log('VERCEL_URL:', process.env.VERCEL_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
}
