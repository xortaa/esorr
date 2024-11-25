/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.daisyui.com", "storage.googleapis.com"],
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        module: false, // Add this for react-pdf
      };
    }
    // Add these configurations for react-pdf
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
  // Add transpilePackages for react-pdf
  transpilePackages: ["@react-pdf/renderer"],
};

module.exports = nextConfig;
