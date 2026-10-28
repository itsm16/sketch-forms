/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/trpc",
    "@repo/services",
    "@repo/database",
    "@repo/logger",
  ],
  serverExternalPackages: ["pg"],
};

export default nextConfig;
