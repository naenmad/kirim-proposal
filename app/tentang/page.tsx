export default function TentangPage() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Tentang Sistem
                    </h1>
                    <p className="text-xl text-gray-600">
                        Informasi lengkap tentang Sistem Manajemen Proposal HIMTIKA UNSIKA
                    </p>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Sistem</h2>
                    <p className="text-gray-700 mb-4">
                        Sistem Manajemen Proposal Sponsorship ini dikembangkan untuk mempermudah proses
                        pengajuan proposal kerjasama sponsorship kepada perusahaan-perusahaan mitra.
                        Sistem ini memberikan solusi yang efisien dan terstruktur dalam mengelola komunikasi
                        dengan calon sponsor.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitur Utama:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                        <li>Manajemen database perusahaan target</li>
                        <li>Template proposal yang profesional</li>
                        <li>Pengiriman multi-channel (WhatsApp & Email)</li>
                        <li>Tracking status pengiriman real-time</li>
                        <li>Histori lengkap aktivitas proposal</li>
                        <li>Export & Import data untuk backup</li>
                        <li>Dashboard analitik dan laporan</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Teknologi yang Digunakan:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Next.js 14 dengan App Router</li>
                        <li>TypeScript untuk type safety</li>
                        <li>Tailwind CSS untuk styling</li>
                        <li>Local Storage untuk data persistence</li>
                        <li>Responsive design untuk semua device</li>
                    </ul>
                </div>

                {/* Developer Info */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Developer</h2>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">AZ</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Ahmad Zulkarnaen</h3>
                            <p className="text-gray-600">Full Stack Developer</p>
                            <p className="text-gray-600">HIMTIKA UNSIKA</p>
                        </div>
                    </div>

                    {/* Developer Contact */}
                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a
                                href="https://wa.me/6285183058315"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                +62 851-8305-8315
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            <a
                                href="https://instagram.com/madnaen"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                @madnaen
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <a
                                href="https://linkedin.com/in/naen"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                LinkedIn
                            </a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <a
                                href="https://github.com/naenmad/kirim-proposal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                GitHub Repository
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}