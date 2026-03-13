import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import TicketList from "@modules/account/components/ticket-list"
import { adminFetch } from "@lib/data/admin"

const DEFAULT_SLA = {
  response_time_hours: 24,
  resolution_time_hours: 72,
  auto_escalation_enabled: false,
}

export default async function AdminTicketsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const [ticketsData, slaData] = await Promise.all([
    adminFetch<{ tickets?: any[] }>("/admin/after-sales/tickets", {
      query: { limit: 100, order: "-created_at" },
    }).catch(() => ({ tickets: [] })),
    adminFetch<{ config?: typeof DEFAULT_SLA }>("/admin/after-sales/sla-config").catch(() => ({ config: DEFAULT_SLA })),
  ])

  return <TicketList tickets={ticketsData.tickets || []} slaConfig={slaData.config || DEFAULT_SLA} />
}
