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
        // Cache all other static assets
        source: '/:path*.{js,css,webp,jpg,jpeg,png,gif,svg,ico,woff,woff2,ttf,otf,eot}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400, immutable',
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
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  };
}

export default nextConfig;
