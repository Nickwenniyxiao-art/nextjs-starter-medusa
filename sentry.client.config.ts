import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Performance Monitoring
  tracesSampleRate: 0.1,
  // Session Replay
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 0.1,
  // Core Web Vitals
  enableTracing: true,
  integrations: [
    Sentry.browserTracingIntegration({
      enableInp: true,
    }),
  ],
  environment: process.env.NODE_ENV,
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
