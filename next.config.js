/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: false,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.cache = false;
    config.snapshot = {
      ...(config.snapshot ?? {}),
      managedPaths: [],
    };
    return config;
  },
};

module.exports = nextConfig;
