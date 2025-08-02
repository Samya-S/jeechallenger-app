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
    return [
      {
        source: '/api/:path*',
        destination: 'https://jee-challenger-ai.vercel.app/:path*', 
        // destination: 'http://localhost:8000/:path*',
      }
    ];
  },
};

export default nextConfig;
