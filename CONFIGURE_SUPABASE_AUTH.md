# Configure Supabase Authentication Settings

## Problem Solved
✅ **Fixed callback URL from localhost:3001 to localhost:3000**

The email confirmation was failing because the redirect URL was pointing to the wrong port.

## Required Supabase Dashboard Configuration

### 1. Fix Redirect URLs
Go to your Supabase Dashboard → Authentication → URL Configuration

**Site URL:** `http://localhost:3000`

**Redirect URLs:** Add these URLs:
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/register
http://localhost:3000/auth/login
```

### 2. Email Confirmation Settings
Go to Authentication → Settings → Email

**For Development (Quick Fix):**
- ✅ **Disable** "Enable email confirmations" 
- This allows immediate login without email confirmation during development

**For Production (Recommended):**
- ✅ **Enable** "Enable email confirmations"
- Configure SMTP settings with a proper email service

### 3. Email Templates (Optional but Recommended)
Go to Authentication → Email Templates

**Confirm signup template:**
```html
<h2>Konfirmasi Email Anda</h2>
<p>Terima kasih telah mendaftar! Klik tombol di bawah untuk mengkonfirmasi email Anda:</p>
<p><a href="{{ .ConfirmationURL }}">Konfirmasi Email</a></p>
<p>Atau copy dan paste URL ini di browser Anda:</p>
<p>{{ .ConfirmationURL }}</p>
```

## Testing Steps

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Verify the URL:**
   - Should be running on `http://localhost:3000`
   - NOT on `http://localhost:3001`

3. **Test registration:**
   - Try registering a new user
   - Check console logs for debugging info
   - If email confirmation is disabled, you should be logged in immediately

4. **Test email confirmation (if enabled):**
   - Register with a real email
   - Check your email for confirmation link
   - Click the link - should redirect to `http://localhost:3000/auth/callback`

## Quick Development Setup

Run this command to temporarily disable email confirmation for testing:

```sql
-- Run in Supabase SQL Editor
UPDATE auth.config 
SET email_confirm_type = 'optional' 
WHERE id = 'default';
```

## Environment Variables Updated

✅ Added `NEXT_PUBLIC_APP_URL="http://localhost:3000"` to `.env.local`
✅ Fixed URL utility to use correct port

## Next Steps

1. Apply Supabase dashboard settings above
2. Test registration flow
3. Check if profiles table gets populated
4. If profiles still not created, run the database trigger setup
