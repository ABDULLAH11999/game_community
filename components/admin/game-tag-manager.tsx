'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export function GameTagManager({
  initialTags,
  onChange,
}: Readonly<{
  initialTags: string[]
  onChange?: (tags: string[]) => void
}>) {
  const [tags, setTags] = useState(initialTags)
  const [value, setValue] = useState('')

  function updateTags(next: string[]) {
    setTags(next)
    onChange?.(next)
  }

  function addTag() {
    const trimmed = value.trim()
    if (!trimmed || tags.includes(trimmed)) return
    updateTags([...tags, trimmed])
    setValue('')
  }

  return (
    <div className="rounded-xl border border-border bg-panel-2/5 p-4">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-300"
          >
            #{tag}
            <button type="button" onClick={() => updateTags(tags.filter((item) => item !== tag))} className="text-muted hover:text-rose-500 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Add game title"
          className="flex-1 rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs text-text outline-none transition-all font-semibold placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
        />
        <button
          type="button"
          onClick={addTag}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-[0_0_10px_rgba(59,130,246,0.25)]"
        >
          <Plus className="h-4 w-4" />
          Add game
        </button>
      </div>
    </div>
  )
}
