import * as Sentry from "@sentry/nextjs"

export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  label: string
}) {
  Sentry.metrics.distribution(metric.name, metric.value, {
    unit: metric.name === "CLS" ? "" : "millisecond",
    tags: {
      metric_id: metric.id,
      label: metric.label,
    },
  })
}
