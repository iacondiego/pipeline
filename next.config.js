/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Silenciar warning de múltiples lockfiles
  outputFileTracingRoot: require('path').join(__dirname),
}

module.exports = nextConfig
