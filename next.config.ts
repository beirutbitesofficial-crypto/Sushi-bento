import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  // Fully static site (out/) — upload to any host (Hostinger public_html, Netlify, GitHub Pages…).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
