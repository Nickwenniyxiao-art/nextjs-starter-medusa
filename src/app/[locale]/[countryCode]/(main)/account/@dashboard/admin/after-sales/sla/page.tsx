import { adminFetch } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"

async function updateSlaConfig(formData: FormData) {
  "use server"

  const responseTime = Number(formData.get("response_time_hours") || 24)
  const resolutionTime = Number(formData.get("resolution_time_hours") || 72)
  const autoEscalation = formData.get("auto_escalation_enabled") === "on"

  await adminFetch("/admin/after-sales/sla-config", {
    method: "PUT",
    body: {
      response_time_hours: responseTime,
      resolution_time_hours: resolutionTime,
      auto_escalation_enabled: autoEscalation,
    },
  })
}

export default async function AdminAfterSalesSlaPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const data = await adminFetch<{ config?: any }>("/admin/after-sales/sla-config").catch(() => ({
    config: {
      response_time_hours: 24,
      resolution_time_hours: 72,
      auto_escalation_enabled: false,
    },
  }))

  const config = data.config

  return (
    <form action={updateSlaConfig} className="space-y-4 rounded-2xl border border-grey-20 bg-white p-6">
      <h1 className="text-2xl font-semibold">SLA 配置</h1>
      <label className="block text-sm">
        响应时间（小时）
        <input name="response_time_hours" type="number" min={1} defaultValue={config.response_time_hours || 24} className="mt-1 w-full rounded border p-2" />
      </label>
      <label className="block text-sm">
        解决时间（小时）
        <input name="resolution_time_hours" type="number" min={1} defaultValue={config.resolution_time_hours || 72} className="mt-1 w-full rounded border p-2" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="auto_escalation_enabled" type="checkbox" defaultChecked={Boolean(config.auto_escalation_enabled)} />
        启用自动升级
      </label>
      <button type="submit" className="rounded bg-[#2C3E2D] px-4 py-2 text-white">保存设置</button>
    </form>
  )
}
