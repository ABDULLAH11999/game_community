'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type CommentMode = 'guest' | 'google'

export function CommunityCommentForm({
  endpoint,
  currentUserName,
  mode,
  nameLabel,
  namePlaceholder,
  helperText,
  messagePlaceholder,
  submitLabel,
}: Readonly<{
  endpoint: string
  currentUserName?: string | null
  mode: CommentMode
  nameLabel: string
  namePlaceholder: string
  helperText: string
  messagePlaceholder: string
  submitLabel: string
}>) {
  const router = useRouter()
  const signedInName = currentUserName?.trim() || ''
  const isSignedIn = Boolean(signedInName)
  const [author, setAuthor] = useState(signedInName)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    const trimmedMessage = message.trim()
    const trimmedAuthor = (isSignedIn ? signedInName : author).trim()
    if (!trimmedMessage) return
    if (!trimmedAuthor) {
      setStatus(`${nameLabel} is required.`)
      return
    }

    setLoading(true)
    setStatus('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage, author: trimmedAuthor, accountType: mode }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setStatus(data.error || 'Could not post your comment.')
        return
      }

      setMessage('')
      if (!isSignedIn) {
        setAuthor('')
      }
      setStatus('Comment posted.')
      router.refresh()
    } catch {
      setStatus('Could not post your comment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      className="grid gap-3 rounded-xl border border-border bg-panel p-4"
    >
      <div
        className={`rounded-xl border p-4 ${
          mode === 'google'
            ? 'border-yellow-500/20 bg-yellow-500/5'
            : 'border-emerald-500/20 bg-emerald-500/5'
        }`}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {mode === 'google' ? 'Google account comments' : 'Guest comments'}
        </div>
        <p className="mt-1 text-xs leading-6 text-muted">{helperText}</p>
      </div>

      {!isSignedIn ? (
        <label className="grid gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted">{nameLabel}</span>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder={namePlaceholder}
            autoComplete="name"
            required
            className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-xs text-text outline-none transition-all placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
          />
        </label>
      ) : (
        <div className="rounded-xl border border-border bg-bg/70 px-4 py-3 text-xs font-semibold text-text dark:bg-panel-2/70">
          Posting as {signedInName}
        </div>
      )}

      <textarea
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={messagePlaceholder}
        required
        className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-xs text-text outline-none transition-all placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      {status ? <p className="text-[10px] font-semibold text-accent">{status}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-fit rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.25)] disabled:opacity-70"
      >
        {loading ? 'Posting...' : submitLabel}
      </button>
    </form>
  )
}