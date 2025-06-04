# Database Setup Instructions

## Setting up the Profiles Table

The registration system requires a `profiles` table in the Supabase database to store user profile information. Follow these steps to set it up:

### 1. SQL Migration

Run the following SQL script in your Supabase SQL Editor (or apply the migration file):

```sql
-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone_number TEXT DEFAULT '',
    jabatan TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create an index on the id column for performance
CREATE INDEX profiles_id_idx ON public.profiles(id);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

### 2. Verify Table Structure

After running the migration, verify that the `profiles` table has been created with the following columns:
- `id` (UUID, Primary Key, References auth.users)
- `full_name` (TEXT)
- `email` (TEXT)
- `phone_number` (TEXT)
- `jabatan` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### 3. Test Registration Flow

1. Try registering a new user through the registration form
2. Check the `profiles` table to verify that user profile data is being created
3. Verify that the profile contains the metadata from the registration form:
   - Full name
   - Email
   - Phone number
   - Jabatan (position)

## What Was Fixed

The registration issue was caused by:

1. **Missing profiles table**: The callback route was trying to insert/update data in a `profiles` table that didn't exist in the database schema.

2. **Schema mismatch**: The TypeScript types in `lib/supabase.ts` and `app/types/database.ts` didn't include the `profiles` table definition.

3. **Silent failures**: The profile creation was failing silently because the table didn't exist, but the registration process continued.

## Files Updated

- `lib/supabase.ts` - Added profiles table to Database interface
- `app/types/database.ts` - Added complete type definitions including profiles table
- `app/auth/callback/route.ts` - Added proper TypeScript typing for profile operations
- `supabase/migrations/001_create_profiles_table.sql` - Database migration script

## Registration Flow

The registration now works as follows:

1. User fills in registration form with metadata (full_name, phone_number, jabatan)
2. Supabase auth creates the user account with metadata
3. User receives email confirmation
4. User clicks confirmation link, which hits the callback route
5. Callback route exchanges code for session and creates/updates profile in profiles table
6. User is redirected to the application with a complete profile

The profile data includes all the metadata passed during registration, ensuring that user information is properly stored and accessible for the application.
