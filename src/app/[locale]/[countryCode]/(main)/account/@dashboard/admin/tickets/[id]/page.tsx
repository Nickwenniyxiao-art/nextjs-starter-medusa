import { fetchTicketDetail, fetchTicketMessages } from "@lib/data/admin"
import { isAdmin } from "@lib/util/admin-guard"
import { redirect, notFound } from "next/navigation"
import TicketDetail from "@modules/account/components/ticket-detail"

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>
}) {
  const { countryCode, id } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }

  const [ticket, messages] = await Promise.all([
    fetchTicketDetail(id),
    fetchTicketMessages(id),
  ])

  if (!ticket) {
    notFound()
  }

  return <TicketDetail ticket={ticket} initialMessages={messages} />
}
