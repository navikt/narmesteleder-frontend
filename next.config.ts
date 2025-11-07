import type { NextConfig } from "next";

export const BASE_PATH = "/arbeidsgiver/ansatte/narmesteleder";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
    turbopackFileSystemCacheForDev: true,
  },
  reactStrictMode: true,
  basePath: BASE_PATH,
  output: "standalone",
  productionBrowserSourceMaps: true,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  serverExternalPackages: ["@navikt/next-logger", "pino"],
};

export default nextConfig;
