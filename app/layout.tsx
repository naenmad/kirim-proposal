import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kirim Proposal - HIMTIKA UNSIKA",
  description: "Website untuk membantu mempermudah pengiriman proposal sponsorship HIMTIKA UNSIKA kepada perusahaan mitra dengan format yang profesional dan terstruktur.",
  keywords: "HIMTIKA, UNSIKA, proposal, sponsorship, himpunan mahasiswa informatika",
  authors: [{ name: "Zul Ganteng" }],
  creator: "HIMTIKA UNSIKA",
  openGraph: {
    title: "Kirim Proposal - HIMTIKA UNSIKA",
    description: "Website untuk membantu mempermudah pengiriman proposal sponsorship HIMTIKA UNSIKA kepada perusahaan mitra",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}
      >
        {children}
      </body>
    </html>
  );
}