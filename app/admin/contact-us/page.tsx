import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getContactMessages } from '@/lib/db'

export default function AdminContactUsPage() {
  const contactMessages = getContactMessages()

  return (
    <GlassPanel>
      <SectionHeading
        eyebrow="Contact Inbox"
        title="Support, partnership, and moderation requests"
        detail="Every contact form submission surfaces here for review, reply, and status management."
      />
      
      <div className="mt-6 space-y-4">
        {contactMessages.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-panel-2/10 p-5 hover:border-accent/15 transition-all">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-text">{item.name}</p>
                <p className="text-[10px] text-muted font-semibold mt-0.5">
                  {item.email} · {item.topic}
                </p>
              </div>
              <StatusBadge label={item.status} tone={item.status === 'Unread' ? 'rose' : item.status === 'In Review' ? 'amber' : 'emerald'} />
            </div>
            
            <p className="mt-3 text-xs leading-relaxed text-muted">{item.message}</p>
            
            <div className="mt-4 flex flex-wrap gap-1.5">
              <button className="rounded-lg border border-border bg-panel hover:bg-panel-2/50 px-3 py-1.5 text-[10px] font-bold text-text transition-all">
                Open record
              </button>
              <button className="rounded-lg border border-blue-500/25 bg-blue-50/5 hover:bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold text-blue-600 transition-all">
                Send email reply
              </button>
              <button className="rounded-lg border border-emerald-500/25 bg-emerald-50/5 hover:bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-600 transition-all">
                Mark answered
              </button>
            </div>
          </div>
        ))}
        {!contactMessages.length ? (
          <div className="rounded-xl border border-border bg-panel-2/5 p-6 text-xs text-muted font-semibold text-center">
            No contact messages yet. New submissions will appear here.
          </div>
        ) : null}
      </div>
    </GlassPanel>
  )
}
