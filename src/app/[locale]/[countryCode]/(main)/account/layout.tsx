import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import { Metadata } from "next"
import { isAdmin } from "@lib/util/admin-guard"

export const metadata: Metadata = {
  title: "My Account | NordHjem",
  description: "Manage your NordHjem account, orders, and addresses.",
  robots: { index: false, follow: false },
}

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)
  const isAdminUser = customer ? await isAdmin() : false

  return (
    <AccountLayout customer={customer} isAdminUser={isAdminUser}>
      {customer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  )
}
