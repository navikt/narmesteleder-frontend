import type { NextConfig } from 'next'

export const BASE_PATH = '/arbeidgsgiver/ansatte/narmesteleder'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  reactStrictMode: true,
  basePath: BASE_PATH,
  output: 'standalone',
  productionBrowserSourceMaps: true,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
}

export default nextConfig
