import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de rendimiento
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Modo de renderizado
  reactStrictMode: true,
  
  // Compresión
  compress: true,
  
  // Optimizar bundle y chunks
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components'], // Tree-shaking agresivo
  },
  
  // Headers de performance
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
          }
        ],
      },
    ];
  },
};

export default nextConfig;
