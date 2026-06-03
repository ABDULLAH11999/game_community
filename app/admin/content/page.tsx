import Link from 'next/link'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { issues } from '@/lib/site-data'

export default function AdminContentPage() {
  return (
    <GlassPanel>
      <SectionHeading
        eyebrow="Issues & SEO Content"
        title="Manage searchable bug posts"
        detail="Evergreen issue articles that rank across patch cycles."
      />
      
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded-xl border border-border bg-panel-2/10 p-5 flex flex-col justify-between hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <p className="font-display text-sm font-bold text-text">{issue.title}</p>
                <StatusBadge label={issue.status} tone="blue" />
              </div>
              <p className="text-xs leading-relaxed text-muted line-clamp-3">{issue.metaDescription}</p>
            </div>
            
            <div className="mt-4 border-t border-border/60 pt-4">
              <div className="flex flex-wrap gap-1 mb-4">
                {issue.keywords.slice(0, 3).map((keyword) => (
                  <StatusBadge key={keyword} label={keyword} tone="violet" />
                ))}
              </div>
              <Link href={`/issues/${issue.slug}`} className="inline-flex rounded-lg border border-border bg-panel hover:bg-panel-2/50 px-3.5 py-2 text-xs font-bold text-text transition-all">
                Open public page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
