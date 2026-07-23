import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/site-config";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: `${BASE_PATH}/`,
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
