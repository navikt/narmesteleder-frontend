import type { NextConfig } from "next";

const environment =
  process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod" ? "prod" : "dev";

const SELF = "'self'";

const appDirectives = {
  "default-src": [SELF],
  "script-src": [SELF, "'unsafe-eval'"],
  "script-src-elem": [SELF],
  "style-src": [SELF],
  "style-src-elem": [SELF],
  "img-src": [SELF, "data:"],
  "font-src": [SELF, "https://cdn.nav.no"],
  "worker-src": [SELF],
  "connect-src": [SELF, "https://*.nav.no"],
};

const nextConfig: NextConfig = {
  async headers() {
    const { buildCspHeader } = await import(
      "@navikt/nav-dekoratoren-moduler/ssr"
    );
    const cspValue = await buildCspHeader(appDirectives, { env: environment });
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspValue,
          },
        ],
      },
    ];
  },
  /* config options here */
  experimental: {
    optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
    turbopackFileSystemCacheForDev: true,
  },
  reactStrictMode: true,
  reactCompiler: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: "standalone",
  productionBrowserSourceMaps: true,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  serverExternalPackages: ["@navikt/next-logger", "pino"],
};

export default nextConfig;
