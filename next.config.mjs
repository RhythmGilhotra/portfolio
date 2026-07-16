/** @type {import('next').NextConfig} */

// When building for GitHub Pages (set GITHUB_PAGES=true in CI), emit a fully
// static site under /portfolio. Local `next dev` / `next build` stay unaffected.
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  ...(isPages
    ? {
        output: "export",
        basePath: "/portfolio",
        assetPrefix: "/portfolio/",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
