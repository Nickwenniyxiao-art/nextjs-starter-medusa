const checkEnvVariables = require("./check-env-variables")
const createNextIntlPlugin = require("next-intl/plugin")
const { withSentryConfig } = require("@sentry/nextjs")

checkEnvVariables()

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
  async redirects() {
    const defaultLocale = "en"
    const defaultCountryCode =
      process.env.NEXT_PUBLIC_DEFAULT_REGION?.toLowerCase() || "us"

    return [
      {
        source: "/",
        destination: `/${defaultLocale}/${defaultCountryCode}`,
        permanent: false,
      },
      {
        source: `/${defaultLocale}`,
        destination: `/${defaultLocale}/${defaultCountryCode}`,
        permanent: false,
      },
    ]
  },
}

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    silent: true,
    org: "huan-xiao-5d",
    project: "nordhjem-storefront",
  },
  {
    hideSourceMaps: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    reactComponentAnnotation: { enabled: false },
  }
)
