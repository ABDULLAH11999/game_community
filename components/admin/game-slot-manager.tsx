'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

export function GameSlotManager({
  availableGames,
}: Readonly<{
  availableGames: string[]
}>) {
  const [time, setTime] = useState('15:00')
  const [selectedGames, setSelectedGames] = useState<string[]>(availableGames.slice(0, 2))
  const [title, setTitle] = useState('')
  const [postNow, setPostNow] = useState(false)
  const [status, setStatus] = useState('')

  const timeLabel = useMemo(() => {
    const parts = time.split(':')
    return `${parts[0]}:${parts[1]} PKT`
  }, [time])

  async function addSlot() {
    if (!selectedGames.length) return
    setStatus('Publishing live report...')
    const response = await fetch('/api/admin/posts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time: postNow ? '' : timeLabel,
        games: selectedGames,
        title: title.trim(),
        postNow,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      setStatus(data.error || 'Failed to publish live report.')
      return
    }
    setTitle('')
    setPostNow(true)
    setStatus('Live report published to post.json')
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded-xl border border-border bg-panel p-4">
        <div className="grid gap-3 md:grid-cols-2">
          {!postNow ? (
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">Slot time</label>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs text-text outline-none dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Post now</p>
              <p className="mt-1 text-xs font-semibold text-text">This post will publish immediately.</p>
            </div>
          )}
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">Post title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="AI post title"
              className="w-full rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs text-text outline-none placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel"
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg/60 px-4 py-3 text-xs font-bold text-text dark:bg-panel-2/40">
          Post right now
          <input
            type="checkbox"
            checked={postNow}
            onChange={(event) => setPostNow(event.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
        </label>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">Select games</label>
          <select
            multiple
            value={selectedGames}
            onChange={(event) => {
              const values = Array.from(event.target.selectedOptions).map((option) => option.value)
              setSelectedGames(values)
            }}
            className="min-h-28 w-full rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs text-text outline-none dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel"
          >
            {availableGames.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => void addSlot()}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          {postNow ? 'Publish live report now' : `Publish live report for ${timeLabel}`}
        </button>
        {status ? <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300">{status}</p> : null}
      </div>
    </div>
  )
}
