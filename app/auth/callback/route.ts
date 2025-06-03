import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/kirim-proposal'

  if (code) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data.user) {
        console.log('User confirmed email:', data.user.id)

        // Create profile with retry mechanism
        try {
          const userMetadata = data.user.user_metadata || {}

          const profileData = {
            id: data.user.id,
            full_name: userMetadata.full_name || userMetadata.display_name || '',
            email: data.user.email || '',
            phone_number: userMetadata.phone_number || '',
            jabatan: userMetadata.jabatan || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          console.log('Creating profile from callback:', profileData)

          // First check if profile exists
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single()

          if (checkError && checkError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: insertedProfile, error: insertError } = await supabase
              .from('profiles')
              .insert([profileData])
              .select()

            if (insertError) {
              console.error('Failed to insert profile:', insertError)
              console.error('Insert error details:', JSON.stringify(insertError, null, 2))
            } else {
              console.log('Profile created successfully:', insertedProfile)
            }
          } else if (!checkError && existingProfile) {
            // Profile exists, update it
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

            if (updateError) {
              console.error('Failed to update profile:', updateError)
            } else {
              console.log('Profile updated successfully:', updatedProfile)
            }
          } else {
            console.error('Error checking existing profile:', checkError)
          }
        } catch (profileError) {
          console.error('Profile handling error in callback:', profileError)
          // Don't block the redirect
        }

        // Successful email confirmation - redirect to success page
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      } else {
        console.error('Auth exchange error:', error)
        throw error
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed`)
    }
  }

  // No code provided
  console.error('No auth code provided in callback')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}