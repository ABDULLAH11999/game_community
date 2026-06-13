import { Activity, BarChart3, Mail, Users } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getContactMessages, getUsers, getVisitors, refreshDatabaseSnapshot } from '@/lib/db'
import { issues } from '@/lib/site-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  await refreshDatabaseSnapshot()

  const users = getUsers()
  const contactMessages = getContactMessages()
  const trackedVisitors = getVisitors()

  const stats = [
    { label: 'Users', value: users.length, icon: Users, tone: 'blue' as const },
    { label: 'Issues', value: issues.length, icon: Activity, tone: 'violet' as const },
    { label: 'Contacts', value: contactMessages.length, icon: Mail, tone: 'emerald' as const },
    { label: 'Visitors', value: trackedVisitors.length, icon: BarChart3, tone: 'amber' as const },
  ]

  return (
    <div className="space-y-6">
      <GlassPanel className="py-5 px-6">
        <SectionHeading
          eyebrow="Operations"
          title="Minimal admin control center"
          detail="User moderation, visitors, contact inbox, SEO settings, and game taxonomy in one calm layout."
        />
      </GlassPanel>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-panel p-5 transition-all hover:border-accent/15">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs uppercase font-bold tracking-wider">{stat.label}</span>
              <stat.icon className="h-4.5 w-4.5 text-accent" />
            </div>
            
            <p className="mt-2.5 font-display text-3xl font-extrabold text-text tracking-tight">{stat.value}</p>
            
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge label="Healthy" tone={stat.tone} />
              <span className="text-[10px] text-muted font-semibold">Active connection</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <GlassPanel>
          <SectionHeading eyebrow="Moderation" title="Users and message flags" />
          <div className="mt-5 divide-y divide-border/60">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-bold text-text">{user.name}</p>
                  <p className="text-xs text-muted mt-0.5">{user.email}</p>
                </div>
                <StatusBadge label={user.verified ? 'Active' : 'Pending'} tone={user.verified ? 'emerald' : 'amber'} />
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeading eyebrow="Pipeline" title="AI content flow" />
          <div className="mt-5 space-y-2.5">
            <p className="rounded-xl border border-border bg-panel-2/20 px-4 py-3 text-xs leading-relaxed text-muted font-medium">AI suggestions cluster player reports into issue drafts.</p>
            <p className="rounded-xl border border-border bg-panel-2/20 px-4 py-3 text-xs leading-relaxed text-muted font-medium">AI suggestions refine the fix summary and workaround notes.</p>
            <p className="rounded-xl border border-border bg-panel-2/20 px-4 py-3 text-xs leading-relaxed text-muted font-medium">Admins approve, publish, and moderate community comments.</p>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel>
        <SectionHeading eyebrow="Contacts" title="Recent contact form messages" />
        <div className="mt-5 divide-y divide-border/60">
          {contactMessages.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-text">{item.name}</p>
                  <p className="text-xs text-muted mt-0.5">{item.topic}</p>
                </div>
                <StatusBadge label={item.status} tone={item.status === 'Unread' ? 'rose' : item.status === 'In Review' ? 'amber' : 'emerald'} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{item.message}</p>
            </div>
          ))}
          {!contactMessages.length ? (
            <div className="text-xs text-muted font-medium py-2">No contact messages received.</div>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  )
}
