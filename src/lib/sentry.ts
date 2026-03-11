type SentryModule = {
  init: (options: Record<string, unknown>) => void
  captureException: (error: unknown) => string
  withSentryConfig: (...args: any[]) => any
}

const noop = () => undefined

const fallback: SentryModule = {
  init: noop,
  captureException: () => "",
  withSentryConfig: (config: unknown) => config,
}

export const sentry: SentryModule = (() => {
  try {
    return require("@sentry/nextjs") as SentryModule
  } catch {
    return fallback
  }
})()
