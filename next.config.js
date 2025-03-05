const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "v0.blob.com",
      "your-supabase-project-ref.supabase.co",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
  },
  // Add this to suppress warnings about missing environment variables during development
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig

