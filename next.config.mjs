/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate source maps for production builds
  productionBrowserSourceMaps: true,
  // Target modern browsers to reduce polyfills
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize imports for better tree-shaking
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize external images like YouTube thumbnails with longer cache
    minimumCacheTTL: 2592000, // 30 days for external images
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images for 1 year with stale-while-revalidate
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache static files like ads.txt for 1 day
        source: '/:path*.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=43200',
          },
        ],
      },
      {
        // Explicitly set MIME type and cache for CSS files
        source: '/:path*.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400, immutable',
          },
        ],
      },
      {
        // Explicitly set MIME type and cache for JS files
        source: '/:path*.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400, immutable',
          },
        ],
      },
      {
        // Cache all other static assets
        source: '/:path*.{webp,jpg,jpeg,png,gif,svg,ico,woff,woff2,ttf,otf,eot}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400, immutable',
          },
        ],
      },
      {
        // Add compression headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async rewrites() {
    // Conditional destination based on environment
    const destination = process.env.NODE_ENV === 'production' || true
      ? 'https://jee-challenger-ai.vercel.app/:path*'
      : 'http://localhost:8000/:path*';
    
    return [
      {
        source: '/api/:path*',
        destination: destination,
      }
    ];
  },
};

// Add webpack optimizations only for production builds (not in dev with Turbopack)
if (process.env.NODE_ENV === 'production') {
  nextConfig.webpack = (config, { isServer }) => {
    if (!isServer) {
      // Only customize JS chunk splitting, let Next.js handle CSS automatically
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Vendor chunk for node_modules (JS only)
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/].*\.js$/,
            priority: 20,
          },
          // Common chunk for shared code (JS only)
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            test: /\.js$/,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  };
}

export default nextConfig;
