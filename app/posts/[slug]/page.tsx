import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LiveTimestamp } from '@/components/live-timestamp'
import { PostCommentForm } from '@/components/post-comment-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getCurrentUser } from '@/lib/auth'
import { getCommentTone } from '@/lib/comments'
import { getPosts, getPostComments, getStoredSettings } from '@/lib/db'
import { canonicalUrl } from '@/lib/site-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Readonly<{ params: { slug: string } }>): Metadata {
  const post = getPosts().find((item) => item.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: canonicalUrl(`/posts/${post.slug}`),
      type: 'article',
    },
  }
}

export default function PostPage({ params }: Readonly<{ params: { slug: string } }>) {
  const post = getPosts().find((item) => item.slug === params.slug)
  if (!post) notFound()
  const settings = getStoredSettings()
  const user = getCurrentUser()
  const comments = getPostComments()[post.slug] || []

  return (
    <SiteShell title={post.title} subtitle="A free bug report for players who want the summary, likely cause, and current workaround in one place.">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <GlassPanel className="border-blue-500/20 p-6 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
            <div className="flex flex-wrap items-center gap-2">
              {post.games.map((game) => (
                <StatusBadge key={game} label={game} tone="blue" />
              ))}
              <StatusBadge label={post.status === 'published' ? 'Published' : 'Scheduled'} tone={post.status === 'published' ? 'emerald' : 'amber'} />
              <LiveTimestamp value={post.publishedAt} label={post.status === 'published' ? 'Live' : 'Scheduled'} />
            </div>
            <SectionHeading eyebrow="Live Bug Report" title={post.title} detail={post.summary} />
            <div className="mt-6 space-y-4">
              {post.content.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="border-emerald-500/20 p-6 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
            <SectionHeading
              eyebrow="Community Conversation"
              title="Guest comments"
              detail="Visitors can share fixes, bug notes, or current status without creating an account."
            />

            <div className="mt-6 space-y-3">
              {comments.length ? (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl border border-border/80 bg-panel-2/30 p-4 transition-all hover:border-accent/15">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-xs font-bold text-text">{comment.author}</p>
                      <StatusBadge label={comment.role} tone={getCommentTone(comment.role)} />
                      <span className="text-[10px] font-medium text-muted">{comment.createdAt}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{comment.message}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/80 bg-panel-2/20 p-5 text-sm text-muted">
                  No guest comments yet. Share the first workaround or bug note.
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border/60 pt-6">
              <PostCommentForm slug={post.slug} currentUserName={user?.name ?? null} />
            </div>
          </GlassPanel>
        </div>

        <GlassPanel className="border-emerald-500/20 p-6 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
          <SectionHeading eyebrow="Player value" title="Helpful for players" detail="This report stays easy to scan and useful for anyone trying to reproduce the bug or share a workaround." />
          <div className="mt-4 flex flex-wrap gap-2">
            {settings.keywords.map((keyword) => (
              <StatusBadge key={keyword} label={keyword} tone="violet" />
            ))}
          </div>
        </GlassPanel>
      </div>
    </SiteShell>
  )
}
