import { LiveRefresh } from '@/components/admin/live-refresh'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getVisitors, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type VisitorMode = 'all' | 'unique' | 'new' | 'return'

export default async function AdminVisitorsPage({
  searchParams,
}: Readonly<{
  searchParams?: { ip?: string; page?: string; mode?: VisitorMode; date?: string }
}>) {
  const mode = searchParams?.mode || 'all'
  const ip = searchParams?.ip?.trim().toLowerCase() || ''
  const page = searchParams?.page?.trim().toLowerCase() || ''
  const date = searchParams?.date?.trim().toLowerCase() || ''

  await refreshDatabaseSnapshot()

  const visitors = [...getVisitors()].sort((a, b) => {
    const left = new Date(b.timestamp || b.visitedAt).getTime()
    const right = new Date(a.timestamp || a.visitedAt).getTime()
    return left - right
  })

  const filtered = visitors.filter((visitor, index, list) => {
    const matchesMode =
      mode === 'all'
        ? true
        : mode === 'unique'
          ? list.findIndex((item) => item.ip === visitor.ip) === index
          : visitor.type.toLowerCase() === mode
    const matchesIp = !ip || visitor.ip.toLowerCase().includes(ip)
    const matchesPage = !page || visitor.page.toLowerCase().includes(page)
    const matchesDate = !date || `${visitor.visitedAt} ${visitor.timestamp}`.toLowerCase().includes(date)
    return matchesMode && matchesIp && matchesPage && matchesDate
  })

  const fieldClass =
    'w-full rounded-xl border border-border bg-bg/80 px-3.5 py-2.5 text-xs text-text outline-none transition-all font-semibold placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]'

  return (
    <div className="space-y-6">
      <LiveRefresh intervalMs={10000} />

      <GlassPanel>
        <SectionHeading
          eyebrow="Visitor Tracking"
          title="Traffic quality and entry point analysis"
          detail="IP tracking, source analysis, and identifying which issue pages or support pages attract useful traffic."
        />
      </GlassPanel>

      <GlassPanel>
        <form className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" method="get">
          <input name="ip" defaultValue={ip} placeholder="Filter by IP" className={fieldClass} />
          <input name="page" defaultValue={page} placeholder="Filter by page" className={fieldClass} />
          <input name="date" defaultValue={date} placeholder="Date range" className={fieldClass} />
          <select name="mode" defaultValue={mode} className={fieldClass}>
            <option value="all">All visitors</option>
            <option value="unique">Unique visitors</option>
            <option value="new">New visitors</option>
            <option value="return">Returning visitors</option>
          </select>
          <button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.25)]">
            Apply filters
          </button>
        </form>

        <div className="mb-4 flex items-center justify-between text-xs text-muted">
          <span className="font-semibold">{filtered.length} visitors shown</span>
          <span className="font-semibold">Unique mode deduplicates by IP</span>
        </div>

        <div className="space-y-3 md:hidden">
          {filtered.map((visitor) => (
            <div key={visitor.id} className="rounded-xl border border-border bg-panel p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-text">{visitor.ip}</p>
                <StatusBadge label={visitor.type} tone={visitor.type === 'New' ? 'emerald' : 'blue'} />
              </div>
              <p className="mt-2 text-xs text-muted">{visitor.location}</p>
              <p className="mt-2 break-all text-xs font-semibold text-text">{visitor.page}</p>
              <p className="mt-2 text-[10px] text-muted">
                {visitor.referrer} - {visitor.visitedAt}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="min-w-full divide-y divide-border text-left text-xs font-semibold text-text">
            <thead className="bg-panel-2/30 text-muted">
              <tr>
                <th className="px-4 py-3.5">IP</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Page</th>
                <th className="px-4 py-3.5">Referrer</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-4 py-3.5">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-panel-2/10 transition-colors">
                  <td className="px-4 py-4 text-text">{visitor.ip}</td>
                  <td className="px-4 py-4 text-muted">{visitor.location}</td>
                  <td className="px-4 py-4 text-muted">{visitor.page}</td>
                  <td className="px-4 py-4 text-muted">{visitor.referrer}</td>
                  <td className="px-4 py-4 text-muted">{visitor.visitedAt}</td>
                  <td className="px-4 py-4">
                    <StatusBadge label={visitor.type} tone={visitor.type === 'New' ? 'emerald' : 'blue'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  )
}
