import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
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
  return <TicketDetail ticketId={id} />
}
