import { getCurrentAdmin } from '@/lib/admin-auth'
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell'

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = getCurrentAdmin()

  return (
    <main className="pr-theme min-h-screen bg-bg text-text selection:bg-accent/20">
      <AdminLayoutShell authenticated={Boolean(admin)} username={admin?.username ?? undefined}>
        {children}
      </AdminLayoutShell>
    </main>
  )
}
