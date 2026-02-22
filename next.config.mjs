/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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

export default nextConfig;
