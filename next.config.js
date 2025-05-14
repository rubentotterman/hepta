const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "v0.blob.com",
      "your-supabase-project-ref.supabase.co",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
  },
  // Add environment variables to the client
  env: {
    // Use a test key for development
    STRIPE_SECRET_KEY:
      "sk_test_51NTj6ECBZbubqLlTavZEEYr8YqLtMwVYfzIY8EyT3kXY2yuSv6z7hsiQ2omjZnQ1TMIFee3emq7HIcMAe4rWdAoc00CZhpLtEf",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      "pk_test_51NTj6ECBZbubqLlTkG0te9lkV8yeJ2oICi7xozoKXI6iftnjKhBLOhI28HgOEd4UIk8UGzqsMhXx8A5MQFTEJnXm009dnJfaPI",
    STRIPE_WEBHOOK_SECRET: "whsec_81bb8c2505b7b8af2511740588e6f59407c04246bbd196ad7fce2b43367fbe69",
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

