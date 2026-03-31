/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'v53y6dv6.us-east.insforge.app',
      },
      {
        protocol: 'https',
        hostname: 'cdn.insforge.dev',
      },
    ],
  },
};

module.exports = nextConfig;
