'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface Stats {
  totalCompanies: number
  whatsappSent: number
  emailSent: number
  totalSent: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalCompanies: 0,
    whatsappSent: 0,
    emailSent: 0,
    totalSent: 0
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  // Load statistics from Supabase
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)

        // Cek apakah pengguna sudah login
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          // Pengguna sudah login, gunakan query normal
          const { data: companies, error } = await supabase
            .from('companies')
            .select('whatsapp_sent, email_sent')

          if (error) {
            console.error('Error loading stats:', error)
            return
          }

          if (companies) {
            const totalCompanies = companies.length
            const whatsappSent = companies.filter(c => c.whatsapp_sent).length
            const emailSent = companies.filter(c => c.email_sent).length
            const totalSent = companies.filter(c => c.whatsapp_sent || c.email_sent).length

            setStats({
              totalCompanies,
              whatsappSent,
              emailSent,
              totalSent
            })
          }
        } else {
          // Pengguna belum login, gunakan function khusus untuk statistik publik
          const { data, error } = await supabase
            .rpc('get_public_stats')
            .single()

          if (error) {
            // Jika function RPC belum ada, gunakan query publik dengan agregasi
            console.log('RPC not available, trying public aggregation query')

            // Alternatif: Gunakan public view
            const { data: publicStats, error: viewError } = await supabase
              .from('public_stats')
              .select('*')
              .single()

            if (viewError) {
              console.error('Error loading public stats view:', viewError)
              return
            }

            if (publicStats) {
              setStats({
                totalCompanies: publicStats.total_companies || 0,
                whatsappSent: publicStats.whatsapp_sent || 0,
                emailSent: publicStats.email_sent || 0,
                totalSent: publicStats.total_sent || 0
              })
            }
          } else if (data) {            // Add type assertion to inform TypeScript about the shape of the data
            const typedData = data as {
              total_companies: number;
              whatsapp_sent: number;
              email_sent: number;
              total_sent: number;
            };

            setStats({
              totalCompanies: typedData.total_companies || 0,
              whatsappSent: typedData.whatsapp_sent || 0,
              emailSent: typedData.email_sent || 0,
              totalSent: typedData.total_sent || 0
            })
          }
        }
      } catch (error) {
        console.error('Error loading statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('companies-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'companies'
      }, () => {
        loadStats() // Reload stats when data changes
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Database Real-time",
      description: "Data perusahaan tersimpan aman di cloud database dengan sinkronisasi real-time antar pengguna."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Multi Channel",
      description: "Kirim proposal melalui WhatsApp dan Email dengan sekali klik untuk jangkauan maksimal."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics Dashboard",
      description: "Dashboard analytics lengkap dengan statistik pengiriman dan tingkat respons perusahaan."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Histori Lengkap",
      description: "Riwayat pengiriman proposal dengan detail waktu, pengirim, dan status untuk evaluasi tim."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: "Multi User Access",
      description: "Sistem multi-user dengan autentikasi aman untuk kolaborasi tim HIMTIKA yang efektif."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Responsive Design",
      description: "Akses sistem dari perangkat apapun dengan tampilan yang optimal dan user-friendly."
    },
  ]

  const displayStats = [
    {
      name: "Total Perusahaan",
      value: loading ? "..." : stats.totalCompanies.toString(),
      color: "text-blue-600"
    },
    {
      name: "WhatsApp Terkirim",
      value: loading ? "..." : stats.whatsappSent.toString(),
      color: "text-green-600"
    },
    {
      name: "Email Terkirim",
      value: loading ? "..." : stats.emailSent.toString(),
      color: "text-purple-600"
    },
    {
      name: "Total Pengiriman",
      value: loading ? "..." : stats.totalSent.toString(),
      color: "text-orange-600"
    },
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Sistem Manajemen{' '}
            <span className="text-blue-600">Proposal Sponsorship</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform terintegrasi untuk mengelola dan mengirim proposal sponsorship
            HIMTIKA UNSIKA kepada perusahaan mitra dengan efisien dan profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kirim-proposal"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Mulai Kirim Proposal
            </Link>
            <Link
              href="/histori"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all border border-blue-600"
            >
              Lihat Histori
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Statistik Pengiriman Real-time
            </h2>
            <p className="text-gray-600">Data terkini aktivitas pengiriman proposal sponsorship</p>
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2 ${loading ? 'animate-pulse' : ''}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.name}</div>
              </div>
            ))}
          </div>

          {/* Progress Bars */}
          {!loading && stats.totalCompanies > 0 && (
            <div className="mt-12 max-w-2xl mx-auto space-y-4">
              <div className="text-center text-sm text-gray-500 mb-6">
                Tingkat Pengiriman Proposal
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">WhatsApp</span>
                    <span className="text-green-600 font-medium">
                      {Math.round((stats.whatsappSent / stats.totalCompanies) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(stats.whatsappSent / stats.totalCompanies) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Email</span>
                    <span className="text-purple-600 font-medium">
                      {Math.round((stats.emailSent / stats.totalCompanies) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(stats.emailSent / stats.totalCompanies) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Solusi lengkap berbasis cloud untuk kebutuhan manajemen proposal sponsorship yang modern dan efektif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap untuk Memulai?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan sistem manajemen proposal yang telah dipercaya
            oleh HIMTIKA UNSIKA untuk menjalin kemitraan strategis.
          </p>
          <Link
            href="/kirim-proposal"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-block"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}