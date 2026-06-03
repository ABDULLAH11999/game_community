'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function IssueCommentForm({
  slug,
  canComment,
}: Readonly<{
  slug: string
  canComment: boolean
}>) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!message.trim() || !canComment) return
    setLoading(true)
    setStatus('')
    try {
      const response = await fetch(`/api/issues/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await response.json()
      if (!response.ok) {
        setStatus(data.error || 'Could not post your comment.')
        return
      }
      setMessage('')
      setStatus('Comment posted.')
      router.refresh()
    } catch {
      setStatus('Could not post your comment.')
    } finally {
      setLoading(false)
    }
  }

  if (!canComment) {
      return (
      <div className="mt-4 rounded-xl border border-border bg-panel p-4">
        <p className="text-sm text-muted">Sign in or create an account to post a comment.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/signin" className="rounded-xl border border-border bg-bg/80 px-4 py-2.5 text-xs font-bold text-text dark:bg-panel-2/70">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white">
            Sign up
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 grid gap-3 rounded-xl border border-border bg-panel p-4">
      <textarea
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Share your workaround, reproduction steps, or current status..."
        required
        className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-xs text-text outline-none transition-all placeholder:text-muted dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      {status ? <p className="text-[10px] font-semibold text-accent">{status}</p> : null}
      <button
        onClick={() => void submit()}
        disabled={loading}
        className="w-fit rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-blue-700 hover:to-cyan-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.25)] disabled:opacity-70"
      >
        {loading ? 'Posting...' : 'Post comment'}
      </button>
    </div>
  )
}
