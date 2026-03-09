import { retrieveCustomer } from "@lib/data/customer"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||
  "admin@nordhjem.com,nickwenniyxiao@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())

export async function isAdmin(): Promise<boolean> {
  try {
    const customer = await retrieveCustomer()
    if (!customer?.email) return false
    return ADMIN_EMAILS.includes(customer.email.toLowerCase())
  } catch {
    return false
  }
}
