import { MessageSquare, ThumbsUp } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { communityPosts } from '@/lib/site-data'

export default function CommunityPage() {
  return (
    <SiteShell
      title="Community Fix Exchange"
      subtitle="Free player-led conversations where people share fixes, compare workarounds, and help each other through game issues."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading
              eyebrow="Community Filters"
              title="Conversation categories"
              detail="Quick filters for games, patches, and fix topics so players can jump to the most relevant thread."
            />
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['PUBG', 'Cyberpunk 2077', 'Fortnite', 'Crash', 'Performance', 'Workaround', 'Hotfix'].map((tag) => (
                <StatusBadge key={tag} label={tag} tone={tag === 'Workaround' ? 'emerald' : tag === 'Crash' ? 'rose' : 'blue'} />
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-4">
          {communityPosts.map((post, index) => (
            <GlassPanel key={post.id} className={`p-5 ${index % 3 === 0 ? 'border-blue-500/20' : index % 3 === 1 ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent">#{post.game}</p>
                  <h2 className="mt-1 font-display text-lg font-bold text-text">{post.title}</h2>
                </div>
                <StatusBadge label="Live thread" tone={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'emerald' : 'rose'} />
              </div>
              
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white shadow-sm">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-text leading-none">{post.user}</p>
                  <p className="text-[10px] text-muted font-medium mt-1">Community contributor</p>
                </div>
              </div>
              
              <p className="mt-4 text-sm leading-6 text-muted">{post.message}</p>
              
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel-2/10 px-3 py-1.5 hover:text-text transition-colors">
                  <ThumbsUp className="h-4 w-4 text-emerald-500" />
                  {post.helpful} helpful
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel-2/10 px-3 py-1.5 hover:text-text transition-colors">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  {post.replies} replies
                </span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </SiteShell>
  )
}
