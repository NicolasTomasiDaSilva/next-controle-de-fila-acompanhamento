import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "sistema-de-filas-cervantes-perm-bucket.s3.us-east-2.amazonaws.com",
    ],
  },
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

export default nextConfig;
