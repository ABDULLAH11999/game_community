import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getStoredSettings, getPosts, savePosts, saveStoredSettings } from '@/lib/db'
import { issues } from '@/lib/site-data'
import type { PostRecord } from '@/lib/types'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: Request) {
  const { time, games, title, postNow } = await request.json()
  const selectedGames = Array.isArray(games) ? games.map((item) => String(item).trim()).filter(Boolean) : []
  const publishNow = Boolean(postNow)
  const normalizedTime = String(time || '').trim()
  if (!selectedGames.length || (!publishNow && !normalizedTime)) {
    return NextResponse.json({ error: 'Please choose games and a slot time, or enable post now.' }, { status: 400 })
  }

  const matchedIssues = issues.filter((issue) => selectedGames.includes(issue.game))
  const issueTitles = matchedIssues.map((issue) => issue.title).slice(0, 3)
  const summary =
    matchedIssues[0]?.summary ||
    `AI suggestions are preparing a fresh issue post for ${selectedGames.join(', ')}.`
  const slotTime = publishNow ? 'Published now' : normalizedTime
  const content = matchedIssues.length
    ? [
        publishNow
          ? `This post was published immediately for ${selectedGames.join(', ')}.`
          : `This slot is scheduled for ${normalizedTime} PKT and targets ${selectedGames.join(', ')}.`,
        `AI suggestions reviewed ${issueTitles.join('; ')} and summarized the most relevant community fixes for publication.`,
        'The post is structured for search indexing so players can discover the latest issue summary from search engines.',
      ]
    : [
        publishNow
          ? `This post was published immediately for ${selectedGames.join(', ')}.`
          : `This slot is scheduled for ${normalizedTime} PKT and targets ${selectedGames.join(', ')}.`,
        'AI suggestions are preparing a fresh game issue post for the selected game slot.',
        'The post is structured for search indexing so players can discover the latest issue summary from search engines.',
      ]

  const record: PostRecord = {
    id: crypto.randomUUID(),
    slug: slugify(title || `${selectedGames.join('-')}-${slotTime.replace(':', '-')}`),
    games: selectedGames,
    slotTime,
    title: String(title || `${selectedGames.join(', ')} slot update`),
    summary,
    content,
    keywords: Array.from(
      new Set([
        ...selectedGames.flatMap((game) => [game, `${game} issue`, `${game} patch`]),
        ...matchedIssues.flatMap((issue) => issue.keywords),
      ]),
    ),
    metaTitle: String(title || `${selectedGames.join(', ')} issue update`),
    metaDescription: summary,
    publishedAt: new Date().toISOString(),
    status: 'published',
  }

  const posts = getPosts()
  savePosts([record, ...posts])

  const settings = getStoredSettings()
  settings.scheduledSlots = [
    {
      id: record.id,
      time: slotTime,
      games: selectedGames,
      title: record.title,
    },
    ...settings.scheduledSlots,
  ]
  saveStoredSettings(settings)
  return NextResponse.json({ success: true, post: record })
}
