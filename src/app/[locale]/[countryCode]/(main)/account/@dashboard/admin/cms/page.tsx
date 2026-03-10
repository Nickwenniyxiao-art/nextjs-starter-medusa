import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"
import AdminCmsTemplate from "@modules/cms/templates/admin-cms"

export const metadata: Metadata = { title: "CMS Management | NordHjem Admin", robots: { index: false, follow: false } }

export default async function AdminCmsPage() {
  const customer = await retrieveCustomer()
  if (!customer) redirect("/account")
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || []
  const isAdmin = adminEmails.includes(customer.email?.toLowerCase() || "")
  if (!isAdmin) redirect("/account")
  return <AdminCmsTemplate />
}
