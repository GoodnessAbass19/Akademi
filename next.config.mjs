/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose", // Allow ESM packages
  },
  transpilePackages: ["@react-pdf/renderer", '@david.kucsai/react-pdf-table"'],
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
