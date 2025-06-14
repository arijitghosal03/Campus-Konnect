import type { NextConfig } from "next";
const { NEXT_PUBLIC_API_URL } = process.env;
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Make sure this is your actual Render backend URL
        destination: `${NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
};

export default nextConfig;
