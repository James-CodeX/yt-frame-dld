import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'minio.jameskaranja.me',
        port: '9000',
        pathname: '/yt-frames/**',
      },
    ],
  },
};

export default nextConfig;
