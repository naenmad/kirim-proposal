export function testEnvironmentUrls() {
    console.log('🧪 TESTING ENVIRONMENT URLS')
    console.log('------------------------')
    console.log('window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A (server)')
    console.log('VERCEL_URL:', process.env.VERCEL_URL || 'Not set')
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'Not set')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('------------------------')

    const { getBaseUrl, getCallbackUrl } = require('./url')
    console.log('✅ Base URL:', getBaseUrl())
    console.log('✅ Callback URL:', getCallbackUrl())
}