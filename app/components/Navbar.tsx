'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Kirim Proposal', href: '/kirim-proposal', protected: true },
    { name: 'Histori', href: '/histori', protected: true },
    { name: 'Tentang', href: '/tentang' },
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        if (event === 'SIGNED_IN') router.refresh()
        else if (event === 'SIGNED_OUT') {
          router.push('/')
          router.refresh()
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [supabase, router])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const isActive = (href: string) => pathname === href

  const filteredNavigation = navigation.filter(item => !item.protected || user)

  // Avatar color generator (based on user id/email)
  const getAvatarColor = (str: string) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600', 'bg-yellow-500', 'bg-indigo-600']
    let sum = 0
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i)
    return colors[sum % colors.length]
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow group-hover:scale-105 transition">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">HIMTIKA</span>
              <span className="text-xs text-gray-400 font-medium">Proposal System</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                  ${isActive(item.href)
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 focus:outline-none"
                  onClick={() => setShowDropdown(v => !v)}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(user.email ?? 'U')}`}>
                    {user.user_metadata?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{user.user_metadata?.display_name || user.email}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-sm"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mb-4">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-150
                    ${isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              {!loading && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(user.email ?? 'U')}`}>
                          {user.user_metadata?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-800">{user.user_metadata?.display_name || user.email}</span>
                      </div>
                      {/* Tambahkan ini */}
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
                      >
                        Profil Saya
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
                      >
                        Masuk
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-center"
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}