import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: "/MeiHao",
  assetPrefix: "/MeiHao/",
};

export default nextConfig;
