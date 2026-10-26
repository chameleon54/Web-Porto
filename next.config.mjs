/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the site has no server features, so server-side Next.js
  // advisories (image optimizer, Server Actions, rewrites) do not apply.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ["three"],
};

export default nextConfig;
