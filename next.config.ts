import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Experimental features
  experimental: {
    optimizePackageImports: ['@solana/web3.js', '@solana/wallet-adapter-react', 'lucide-react'],
  },

  // Add trailing slashes for better SEO
  trailingSlash: false,

  // Disable ESLint during builds (linting is done separately)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Generate ETags for caching
  generateEtags: true,

  // Optimize headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
};

export default nextConfig;
