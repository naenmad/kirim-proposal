import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface Database {
    public: {
        Tables: {
            companies: {
                Row: {
                    id: string
                    nama_perusahaan: string
                    email_perusahaan: string
                    nomor_whatsapp: string
                    date_added: string
                    whatsapp_sent: boolean
                    whatsapp_date_sent: string | null
                    email_sent: boolean
                    email_date_sent: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nama_perusahaan: string
                    email_perusahaan: string
                    nomor_whatsapp: string
                    date_added?: string
                    whatsapp_sent?: boolean
                    whatsapp_date_sent?: string | null
                    email_sent?: boolean
                    email_date_sent?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nama_perusahaan?: string
                    email_perusahaan?: string
                    nomor_whatsapp?: string
                    date_added?: string
                    whatsapp_sent?: boolean
                    whatsapp_date_sent?: string | null
                    email_sent?: boolean
                    email_date_sent?: string | null
                    updated_at?: string
                }
            }
            form_data: {
                Row: {
                    id: string
                    nama_pengirim: string
                    jabatan_pengirim: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nama_pengirim: string
                    jabatan_pengirim: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nama_pengirim?: string
                    jabatan_pengirim?: string
                    updated_at?: string
                }
            }
        }
    }
}