import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getPosts, getStoredSettings } from '@/lib/db'
import { siteSettings } from '@/lib/site-data'

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
      url: `${siteSettings.canonicalUrl}/posts/${post.slug}`,
      type: 'article',
    },
  }
}

export default function PostPage({ params }: Readonly<{ params: { slug: string } }>) {
  const post = getPosts().find((item) => item.slug === params.slug)
  if (!post) notFound()
  const settings = getStoredSettings()

  return (
    <SiteShell title={post.title} subtitle="A free bug report for players who want the summary, likely cause, and current workaround in one place.">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <GlassPanel className="border-blue-500/20 p-6 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
          <div className="flex flex-wrap gap-2">
            {post.games.map((game) => (
              <StatusBadge key={game} label={game} tone="blue" />
            ))}
            <StatusBadge label={post.slotTime} tone="emerald" />
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
