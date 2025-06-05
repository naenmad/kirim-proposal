import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    // Gunakan string kosong sebagai fallback untuk mencegah error undefined
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    console.log('Supabase URL:', supabaseUrl || 'NOT DEFINED')
    console.log('Supabase Key length:', supabaseKey ? supabaseKey.length : 'NOT DEFINED')
    console.log('Supabase Key first 10 chars:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'NOT DEFINED')

    if (!supabaseUrl || !supabaseKey) {
        console.error('CRITICAL ERROR: Missing Supabase environment variables!')
        console.error('Make sure .env.local file exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}