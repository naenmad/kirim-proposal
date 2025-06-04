import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/kirim-proposal'
  if (code) {
    const supabase = await createClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data.user) {
        console.log('User confirmed email:', data.user.id)        // Create profile with retry mechanism
        try {
          const userMetadata = data.user.user_metadata || {}

          const profileData: ProfileInsert = {
            id: data.user.id,
            full_name: userMetadata.full_name || userMetadata.display_name || '',
            email: data.user.email || '',
            phone_number: userMetadata.phone_number || '',
            jabatan: userMetadata.jabatan || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          console.log('=== PROFILE CREATION DEBUG ===')
          console.log('User ID:', data.user.id)
          console.log('User email:', data.user.email)
          console.log('User metadata:', userMetadata)
          console.log('Profile data to insert:', profileData)

          // Try to insert profile directly (simpler approach for development)
          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single()

          if (insertError) {
            console.error('=== PROFILE INSERT ERROR ===')
            console.error('Error code:', insertError.code)
            console.error('Error message:', insertError.message)
            console.error('Error details:', JSON.stringify(insertError, null, 2))

            // If profile already exists, try to update it
            if (insertError.code === '23505') { // Unique constraint violation
              console.log('Profile already exists, trying to update...')
              const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update({
                  full_name: profileData.full_name,
                  email: profileData.email,
                  phone_number: profileData.phone_number,
                  jabatan: profileData.jabatan,
                  updated_at: new Date().toISOString()
                })
                .eq('id', data.user.id)
                .select()
                .single()

              if (updateError) {
                console.error('Profile update error:', updateError)
              } else {
                console.log('Profile updated successfully:', updatedProfile)
              }
            }
          } else {
            console.log('=== PROFILE CREATED SUCCESSFULLY ===')
            console.log('Created profile:', insertedProfile)
          }
        } catch (profileError) {
          console.error('=== PROFILE HANDLING CRITICAL ERROR ===')
          console.error('Error:', profileError)
          // Don't block the redirect, just log the error
        }// Successful email confirmation - redirect to success page
        const forwardedHost = request.headers.get('x-forwarded-host')
        const forwardedProto = request.headers.get('x-forwarded-proto')
        const host = request.headers.get('host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        let redirectUrl: string

        if (isLocalEnv) {
          // Development environment
          redirectUrl = `${origin}${next}`
        } else if (forwardedHost) {
          // Production with forwarded host (Vercel)
          const protocol = forwardedProto || 'https'
          redirectUrl = `${protocol}://${forwardedHost}${next}`
        } else if (host) {
          // Fallback to host header
          redirectUrl = `https://${host}${next}`
        } else {
          // Final fallback
          redirectUrl = `${origin}${next}`
        }

        console.log('Redirecting to:', redirectUrl)
        return NextResponse.redirect(redirectUrl)
      } else {
        console.error('Auth exchange error:', error)
        throw error
      }
    } catch (error) {
      console.error('Auth callback error:', error)

      // Get proper redirect URL for error page
      const forwardedHost = request.headers.get('x-forwarded-host')
      const forwardedProto = request.headers.get('x-forwarded-proto')
      const host = request.headers.get('host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      let errorRedirectUrl: string

      if (isLocalEnv) {
        errorRedirectUrl = `${origin}/auth/auth-code-error?error=exchange_failed`
      } else if (forwardedHost) {
        const protocol = forwardedProto || 'https'
        errorRedirectUrl = `${protocol}://${forwardedHost}/auth/auth-code-error?error=exchange_failed`
      } else if (host) {
        errorRedirectUrl = `https://${host}/auth/auth-code-error?error=exchange_failed`
      } else {
        errorRedirectUrl = `${origin}/auth/auth-code-error?error=exchange_failed`
      }

      return NextResponse.redirect(errorRedirectUrl)
    }
  }
  // No code provided
  console.error('No auth code provided in callback')

  // Get proper redirect URL for error page
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  let errorRedirectUrl: string

  if (isLocalEnv) {
    errorRedirectUrl = `${origin}/auth/auth-code-error?error=no_code`
  } else if (forwardedHost) {
    const protocol = forwardedProto || 'https'
    errorRedirectUrl = `${protocol}://${forwardedHost}/auth/auth-code-error?error=no_code`
  } else if (host) {
    errorRedirectUrl = `https://${host}/auth/auth-code-error?error=no_code`
  } else {
    errorRedirectUrl = `${origin}/auth/auth-code-error?error=no_code`
  }

  return NextResponse.redirect(errorRedirectUrl)
}