/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds untuk Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds jika diperlukan
    // ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  output: 'standalone'
}

module.exports = nextConfig