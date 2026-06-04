import Image from 'next/image'
import Link from 'next/link'
import { Bell, Contact, FileText, Gamepad2, LayoutDashboard, Mail, Settings, Users } from 'lucide-react'
import { getCurrentAdmin } from '@/lib/admin-auth'

const adminMenu = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/games', label: 'Games', icon: Gamepad2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/visitors', label: 'Visitors', icon: Bell },
  { href: '/admin/contact-us', label: 'Contact', icon: Contact },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/email-templates', label: 'Email Templates', icon: Mail },
]

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = getCurrentAdmin()

  if (!admin) {
    return (
      <main className="pr-theme min-h-screen bg-bg text-text selection:bg-accent/20">
        {children}
      </main>
    )
  }

  return (
    <main className="pr-theme min-h-screen bg-bg text-text selection:bg-accent/20">
      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] gap-4 px-3 py-4 sm:px-4 sm:py-6 xl:grid-cols-[260px_1fr] xl:gap-6">
        <aside className="rounded-2xl border border-border bg-panel p-4 flex flex-col gap-5 sm:p-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/25 bg-panel p-1 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Image src="/header-logo.png" alt="LivePatch logo" width={40} height={40} className="h-full w-full rounded-lg object-contain" />
            </div>
            <div>
              <p className="font-display text-sm sm:text-base font-extrabold tracking-tight text-text">LivePatch</p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-accent">{admin?.username ?? 'Admin access'}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {adminMenu.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-muted transition hover:bg-panel-2/65 hover:text-text sm:px-3.5"
              >
                <Icon className="h-4 w-4 text-accent" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent">MANAGEMENT</p>
              <h2 className="text-lg sm:text-xl font-extrabold text-text tracking-tight">Admin Control Center</h2>
            </div>
            <Link href="/" className="rounded-xl border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-muted hover:text-text hover:border-accent/40 transition-all self-start sm:self-auto">
              Go to public site
            </Link>
          </div>
          
          <div className="animate-panel">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
