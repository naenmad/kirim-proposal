import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIMTIKA UNSIKA - Kirim Proposal Sponsorship",
  description: "Sistem manajemen pengiriman proposal sponsorship Himpunan Mahasiswa Informatika Universitas Singaperbangsa Karawang",
  authors: [{ name: "HIMTIKA UNSIKA" }],
  keywords: ["HIMTIKA", "UNSIKA", "proposal", "sponsorship", "informatika", "karawang"],

  // Favicon Configuration
  icons: {
    icon: [
      { url: '/favico/favicon.ico' },
      { url: '/favico/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favico/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favico/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { url: '/favico/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favico/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },

  // PWA Configuration
  manifest: '/favico/site.webmanifest',

  // Open Graph
  openGraph: {
    title: "HIMTIKA UNSIKA - Kirim Proposal Sponsorship",
    description: "Sistem manajemen pengiriman proposal sponsorship Himpunan Mahasiswa Informatika Universitas Singaperbangsa Karawang",
    type: "website",
    locale: "id_ID",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "HIMTIKA UNSIKA - Kirim Proposal Sponsorship",
    description: "Sistem manajemen pengiriman proposal sponsorship Himpunan Mahasiswa Informatika Universitas Singaperbangsa Karawang",
  },

  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  // Theme Color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Additional meta tags */}
        <meta name="application-name" content="HIMTIKA Proposal System" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HIMTIKA Proposal" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/favico/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <ScrollToTop />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}