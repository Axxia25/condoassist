/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para produção em escala
  reactStrictMode: true,

  // Compilador SWC otimizado
  swcMinify: true,

  // Compressão
  compress: true,

  // Otimização de imagens
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Power-ups experimentais
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Otimizar CSS
    optimizeCss: true,
    // Otimizar pacotes
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      '@radix-ui/react-tabs',
      '@radix-ui/react-dropdown-menu',
    ],
  },

  // Webpack otimizado
  webpack: (config, { dev, isServer }) => {
    // Produção: tree shaking agressivo
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      }
    }

    return config
  },

  // Headers para cache e segurança
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
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
