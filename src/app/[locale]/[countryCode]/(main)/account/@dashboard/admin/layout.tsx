import AdminSidebar from "@modules/admin/components/admin-sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  )
}
