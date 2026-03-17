"use client"

import { reportWebVitals } from "@lib/web-vitals"
import { useReportWebVitals } from "next/web-vitals"

export default function WebVitalsReporter() {
  useReportWebVitals(reportWebVitals)

  return null
}
