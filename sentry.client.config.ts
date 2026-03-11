import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.5,
  enabled: process.env.NODE_ENV === "production",
  ignoreErrors: [
    "ResizeObserver loop",
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    "AbortError",
    "ChunkLoadError",
    "Loading chunk",
  ],
})
