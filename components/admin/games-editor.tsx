'use client'

import { useState } from 'react'
import { GameTagManager } from '@/components/admin/game-tag-manager'

export function GamesEditor({ initialTags }: Readonly<{ initialTags: string[] }>) {
  const [games, setGames] = useState(initialTags)
  const [status, setStatus] = useState('')

  async function saveGames() {
    setStatus('Saving...')
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ games }),
    })
    setStatus(response.ok ? 'Games saved.' : 'Could not save games.')
  }

  return (
    <div className="space-y-4">
      <GameTagManager initialTags={games} onChange={setGames} />
      <button
        type="button"
        onClick={() => void saveGames()}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-blue-700 hover:to-cyan-600"
      >
        Save games
      </button>
      {status ? <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300">{status}</p> : null}
    </div>
  )
}
