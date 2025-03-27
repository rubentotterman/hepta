const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "v0.blob.com",
      "your-supabase-project-ref.supabase.co",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
  },
  
  env: {
    // Use a test key for development
    STRIPE_SECRET_KEY:
      "sk_test_51NTj6ECBZbubqLlTavZEEYr8YqLtMwVYfzIY8EyT3kXY2yuSv6z7hsiQ2omjZnQ1TMIFee3emq7HIcMAe4rWdAoc00CZhpLtEf",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      "pk_test_51NTj6ECBZbubqLlTkG0te9lkV8yeJ2oICi7xozoKXI6iftnjKhBLOhI28HgOEd4UIk8UGzqsMhXx8A5MQFTEJnXm009dnJfaPI",
    STRIPE_WEBHOOK_SECRET: "whsec_b8ed9fefdf1bf740ac67575cd3c33ce604f7d88d0b8017955301518a5589446c",
  },
 
  webpack: (config, { isServer }) => {
    if (!isServer) {
      
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

