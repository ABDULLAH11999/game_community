import { notFound } from 'next/navigation'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getUsers } from '@/lib/db'
import { issues } from '@/lib/site-data'

export default function AdminUserDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  const users = getUsers()
  const user = users.find((item) => item.id === params.id)

  if (!user) {
    notFound()
  }

  const messages = issues.flatMap((issue) =>
    issue.comments
      .filter((comment) => comment.author.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()))
      .map((comment) => ({
        ...comment,
        issueTitle: issue.title,
      })),
  )

  return (
    <div className="space-y-6">
      <GlassPanel>
        <SectionHeading eyebrow="User Profile" title={user.name} detail={user.email} />
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge label={user.role} tone="blue" />
          <StatusBadge label={user.verified ? 'Active' : 'Pending'} tone={user.verified ? 'emerald' : 'amber'} />
          <StatusBadge label={`Joined ${new Date(user.createdAt).toISOString().slice(0, 10)}`} tone="violet" />
        </div>
        
        <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-6">
          <button className="rounded-xl border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-600 transition-all">
            Ban user
          </button>
          <button className="rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-600 transition-all">
            Flag account
          </button>
          <button className="rounded-xl border border-border bg-panel-2/30 hover:bg-panel-2/60 px-4 py-2.5 text-xs font-bold text-text transition-all">
            Send moderation email
          </button>
        </div>
      </GlassPanel>

      <GlassPanel>
        <SectionHeading
          eyebrow="User Messages"
          title="Comments and conversations"
          detail="Admins inspect user activity and remove inappropriate issue comments here."
        />
        
        <div className="mt-6 space-y-3">
          {messages.length ? (
            messages.map((message) => (
              <div key={message.id} className="rounded-xl border border-border bg-panel-2/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-text">{message.issueTitle}</p>
                    <p className="text-[10px] text-muted font-medium mt-0.5">{message.createdAt}</p>
                  </div>
                  <button className="rounded-lg border border-rose-500/25 bg-rose-500/5 hover:bg-rose-500/10 px-2.5 py-1.5 text-[10px] font-bold text-rose-600 transition-all">
                    Remove message
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">{message.message}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border bg-panel-2/5 p-4 text-xs font-semibold text-muted text-center">
              No matching comments found in the sample moderation dataset yet.
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}
