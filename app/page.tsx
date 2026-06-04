import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { StatusBadge } from '@/components/ui/glass'
import { communityPosts, issues, trendingSearches } from '@/lib/site-data'
import { getPosts, getStoredSettings } from '@/lib/db'

export default function Home({
  searchParams,
}: Readonly<{
  searchParams?: { game?: string; q?: string }
}>) {
  const settings = getStoredSettings()
  const selectedGame = searchParams?.game?.trim() || ''
  const query = searchParams?.q?.trim().toLowerCase() || ''
  const posts = getPosts()

  const filteredIssues = issues.filter((issue) => {
    const matchesGame = !selectedGame || issue.game.toLowerCase() === selectedGame.toLowerCase()
    const haystack = `${issue.title} ${issue.summary} ${issue.keywords.join(' ')}`.toLowerCase()
    return matchesGame && (!query || haystack.includes(query))
  })

  const filteredPosts = posts.filter((post) => {
    const matchesGame =
      !selectedGame || post.games.some((game) => game.toLowerCase() === selectedGame.toLowerCase())
    const haystack = `${post.title} ${post.summary} ${post.keywords.join(' ')} ${post.content.join(' ')} ${post.games.join(' ')}`.toLowerCase()
    return matchesGame && (!query || haystack.includes(query))
  })

  return (
    <SiteShell
      title={
        <>
          <span className="text-[rgb(141,0,255)]">LivePatch</span> Gaming Community
        </>
      }
      subtitle="A free game-issue hub where players can track bugs, compare workarounds, and discover fixes that stay useful."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xl font-extrabold tracking-tight text-text">
              {selectedGame ? `#${selectedGame} Live reports` : 'Active community reports'}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {filteredIssues.length + filteredPosts.length} issues tracked
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredIssues.map((issue) => (
              <article
                key={issue.id}
                className={`group relative rounded-2xl border bg-panel p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,30,60,0.16)] ${
                  issue.severity === 'Critical'
                    ? 'border-rose-500/35 hover:border-rose-400/60'
                    : issue.severity === 'High'
                      ? 'border-amber-500/30 hover:border-amber-400/50'
                      : issue.severity === 'Medium'
                        ? 'border-blue-500/30 hover:border-blue-400/50'
                        : 'border-emerald-500/30 hover:border-emerald-400/50'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-muted">
                      <span className="text-blue-800 dark:text-blue-300">#{issue.game}</span>
                      <span>·</span>
                      <span className="badge-light-text inline-flex items-center rounded-full border border-black/20 bg-yellow-500/10 px-2.5 py-0.5 text-black dark:border-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-300">
                        {issue.patch}
                      </span>
                      <span>·</span>
                      <StatusBadge
                        label={issue.severity}
                        tone={
                          issue.severity === 'Critical'
                            ? 'rose'
                            : issue.severity === 'High'
                              ? 'yellow'
                              : 'blue'
                        }
                      />
                    </div>

                    <Link
                      href={`/issues/${issue.slug}`}
                      className="mt-2 block text-lg font-bold leading-snug text-text transition-colors hover:text-accent"
                    >
                      {issue.title}
                    </Link>

                    <p className="mt-2 text-sm leading-6 text-muted line-clamp-2">
                      {issue.summary}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-1.5 text-xs font-medium text-muted sm:flex-col sm:items-end">
                    <span className="rounded-lg bg-panel-2 px-2.5 py-1">
                      {issue.affected.toLocaleString()} affected
                    </span>
                    <span className="rounded-lg bg-panel-2 px-2.5 py-1">
                      {issue.reportedAgo}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-muted">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                      <Sparkles className="h-4 w-4" />
                      Free AI summary
                    </span>
                    <span className="badge-light-text inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-emerald-500/10 px-2.5 py-0.5 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:shadow-none">
                      <Users className="h-4 w-4" />
                      {issue.fixes} notes
                    </span>
                  </div>

                  <Link
                    href={`/issues/${issue.slug}`}
                    className="inline-flex items-center gap-1 text-blue-800 transition-colors hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200 group-hover:translate-x-1 duration-200"
                  >
                    Open issue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}

            {filteredPosts.length ? (
              <div className="pt-2">
                <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-800 dark:text-blue-300">LIVE REPORTS</p>
                    <h4 className="text-lg font-extrabold tracking-tight text-text">
                      {selectedGame ? `#${selectedGame} live reports` : 'Published live reports'}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-muted">
                    {filteredPosts.length} published
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group relative rounded-2xl border border-emerald-500/25 bg-panel p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-[0_12px_32px_rgba(15,30,60,0.16)]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-muted">
                            <span className="text-blue-800 dark:text-blue-300">#Bug report</span>
                            <span>·</span>
                            <span className="badge-light-text inline-flex items-center rounded-full border border-black/20 bg-yellow-500/10 px-2.5 py-0.5 text-black dark:border-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-300">
                              {post.slotTime}
                            </span>
                            <span>·</span>
                            <StatusBadge label="Published" tone="emerald" />
                          </div>

                          <Link
                            href={`/posts/${post.slug}`}
                            className="mt-2 block text-lg font-bold leading-snug text-text transition-colors hover:text-accent"
                          >
                            {post.title}
                          </Link>

                          <p className="mt-2 text-sm leading-6 text-muted line-clamp-2">
                            {post.summary}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-1.5 text-xs font-medium text-muted sm:flex-col sm:items-end">
                          <span className="badge-light-text rounded-lg bg-panel-2 px-2.5 py-1 text-black dark:text-blue-300">
                            {post.games.join(', ')}
                          </span>
                          <span className="badge-light-text rounded-lg bg-panel-2 px-2.5 py-1 text-black dark:text-yellow-300">
                            Bug report
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-muted">
                        <div className="flex items-center gap-4">
                          <span className="badge-light-text inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-emerald-500/10 px-2.5 py-0.5 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:shadow-none">
                            <Sparkles className="h-4 w-4" />
                            Bug report post
                          </span>
                          <span className="badge-light-text inline-flex items-center gap-1.5 text-black dark:text-rose-300">
                            <Users className="h-4 w-4" />
                            Player notes
                          </span>
                        </div>

                        <Link
                          href={`/posts/${post.slug}`}
                          className="inline-flex items-center gap-1 text-emerald-800 transition-colors hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200 group-hover:translate-x-1 duration-200"
                        >
                          Open live report
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {!filteredIssues.length && !filteredPosts.length ? (
              <div className="rounded-2xl border border-border bg-panel px-6 py-12 text-center text-sm text-muted shadow-sm">
                No issues matched your search. Try adjusting tags or keyword parameters.
              </div>
            ) : null}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-blue-500/20 bg-panel p-5 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
            <div className="flex items-center gap-2 border-b border-border pb-3 text-xs uppercase font-bold tracking-wider text-accent">
              <TrendingUp className="h-4 w-4 text-accent" />
              Trending searches
            </div>
            <div className="mt-4 space-y-4">
              {trendingSearches.map((item) => (
                <div key={item.rank} className="flex items-start gap-3">
                  <span className="font-display text-lg font-extrabold text-muted/60">{item.rank}</span>
                  <div>
                    <p className="text-sm font-bold text-text leading-tight">{item.title}</p>
                    <p className="badge-light-text mt-0.5 inline-flex items-center rounded-full border border-black/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:shadow-none">
                      {item.growth}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-rose-500/20 bg-panel p-5 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
            <div className="border-b border-border pb-3 text-xs uppercase font-bold tracking-wider text-muted">
              Community snapshots
            </div>
            <div className="mt-4 space-y-4">
              {communityPosts
                .filter((post) => !selectedGame || post.game.toLowerCase() === selectedGame.toLowerCase())
                .map((post) => (
                  <div key={post.id} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-xs font-bold text-text">{post.user}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{post.message}</p>
                  </div>
                ))}
            </div>
          </section>

          <section className="rounded-2xl border border-blue-500/20 bg-panel p-5 shadow-[0_18px_40px_rgba(15,30,60,0.12)]">
            <div className="border-b border-border pb-3 text-xs uppercase font-bold tracking-wider text-muted">
              Tracked games
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {settings.games.map((game) => (
                <Link
                  key={game}
                  href={`/?game=${encodeURIComponent(game)}`}
                  className="rounded-lg border border-border bg-panel px-2.5 py-1.5 text-xs font-semibold text-muted transition-all hover:border-accent/40 hover:text-text"
                >
                  #{game}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </SiteShell>
  )
}
