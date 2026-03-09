import { isAdmin } from "@lib/util/admin-guard"
import { redirect } from "next/navigation"
import TicketList from "@modules/account/components/ticket-list"

export default async function AdminTicketsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  if (!(await isAdmin())) {
    redirect(`/${countryCode}/account`)
  }
  return <TicketList />
}
