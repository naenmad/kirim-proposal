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
                    whatsapp_sent_by: string | null
                    whatsapp_sent_by_name: string | null
                    whatsapp_sent_by_phone: string | null
                    email_sent: boolean
                    email_date_sent: string | null
                    email_sent_by: string | null
                    email_sent_by_name: string | null
                    email_sent_by_phone: string | null
                    created_by: string | null
                    created_by_name: string | null
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
                    whatsapp_sent_by?: string | null
                    whatsapp_sent_by_name?: string | null
                    whatsapp_sent_by_phone?: string | null
                    email_sent?: boolean
                    email_date_sent?: string | null
                    email_sent_by?: string | null
                    email_sent_by_name?: string | null
                    email_sent_by_phone?: string | null
                    created_by?: string | null
                    created_by_name?: string | null
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
                    whatsapp_sent_by?: string | null
                    whatsapp_sent_by_name?: string | null
                    whatsapp_sent_by_phone?: string | null
                    email_sent?: boolean
                    email_date_sent?: string | null
                    email_sent_by?: string | null
                    email_sent_by_name?: string | null
                    email_sent_by_phone?: string | null
                    created_by?: string | null
                    created_by_name?: string | null
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
            profiles: {
                Row: {
                    id: string
                    full_name: string
                    email: string
                    phone_number: string
                    jabatan: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string
                    email?: string
                    phone_number?: string
                    jabatan?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string
                    phone_number?: string
                    jabatan?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']