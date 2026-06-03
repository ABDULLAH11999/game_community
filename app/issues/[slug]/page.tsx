import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MessageSquare, Sparkles, Users } from 'lucide-react'
import { IssueCommentForm } from '@/components/issue-comment-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getIssueComments } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { getIssueBySlug, issues, siteSettings } from '@/lib/site-data'

export function generateStaticParams() {
  return issues.map((issue) => ({ slug: issue.slug }))
}

export function generateMetadata({ params }: Readonly<{ params: { slug: string } }>): Metadata {
  const issue = getIssueBySlug(params.slug)

  if (!issue) {
    return {
      title: 'Issue Not Found',
    }
  }

  return {
    title: issue.metaTitle,
    description: issue.metaDescription,
    keywords: issue.keywords,
    alternates: {
      canonical: `/issues/${issue.slug}`,
    },
    openGraph: {
      title: issue.metaTitle,
      description: issue.metaDescription,
      url: `${siteSettings.canonicalUrl}/issues/${issue.slug}`,
      type: 'article',
    },
  }
}

export default function IssuePage({ params }: Readonly<{ params: { slug: string } }>) {
  const issue = getIssueBySlug(params.slug)
  const extraComments = getIssueComments()[params.slug] || []
  const user = getCurrentUser()

  if (!issue) {
    notFound()
  }

  return (
    <SiteShell title={issue.title} subtitle={issue.metaDescription}>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {/* Main Content Area */}
        <div className="space-y-6">
          <GlassPanel>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase font-bold tracking-wider text-muted mb-4">
              <span className="text-accent">#{issue.game}</span>
              <span>·</span>
              <span>{issue.patch}</span>
              <span>·</span>
              <StatusBadge label={issue.severity} tone={issue.severity === 'Critical' ? 'rose' : issue.severity === 'High' ? 'amber' : 'blue'} />
              <StatusBadge label={issue.status} tone="emerald" />
            </div>

            {/* AI Suggestions with stylized gaming vibe */}
            <div className="relative rounded-xl border-l-4 border-emerald-500 bg-emerald-500/5 p-5 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
              <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                AI suggestions
              </div>
              <p className="text-sm leading-6 text-text font-medium">{issue.summary}</p>
            </div>

            <div className="mt-6 space-y-4 border-t border-border/60 pt-6">
              {issue.content.map((paragraph, index) => (
                <p key={index} className="text-sm leading-7 text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassPanel>

          {/* Comments section */}
          <GlassPanel>
            <SectionHeading
              eyebrow="Community Conversation"
              title="Comments and fix reports"
              detail="Admins review and moderate reported workarounds in this area."
            />
            
            <div className="mt-6 space-y-3">
              {[...issue.comments, ...extraComments].map((comment) => (
                <div key={comment.id} className="rounded-xl border border-border/80 bg-panel-2/30 p-4 transition-all hover:border-accent/15">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold text-text">{comment.author}</p>
                    <StatusBadge label={comment.role} tone={comment.role === 'Admin' ? 'violet' : comment.role === 'Moderator' ? 'blue' : 'emerald'} />
                    <span className="text-[10px] text-muted font-medium">{comment.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{comment.message}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t border-border/60 pt-6">
              <IssueCommentForm slug={issue.slug} canComment={Boolean(user)} />
            </div>
          </GlassPanel>
        </div>

        {/* Sidebar Information */}
        <aside className="space-y-6">
          <GlassPanel>
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted border-b border-border pb-3 mb-4">
              Issue metrics
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/20 p-3.5 text-xs text-text font-semibold">
                <Users className="h-4.5 w-4.5 text-emerald-500" />
                <span>{issue.affected.toLocaleString()} affected players</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/20 p-3.5 text-xs text-text font-semibold">
                <MessageSquare className="h-4.5 w-4.5 text-cyan-500" />
                <span>{issue.fixes} active discussion points</span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel>
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted border-b border-border pb-3 mb-4">
              SEO keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {issue.keywords.map((keyword) => (
                <StatusBadge key={keyword} label={keyword} tone="blue" />
              ))}
            </div>
          </GlassPanel>
        </aside>
      </div>
    </SiteShell>
  )
}
