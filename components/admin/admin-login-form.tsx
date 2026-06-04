'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function AdminLoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(username: string, password: string) {
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || 'Login failed.')
        return
      }

      window.location.assign('/admin')
    } catch {
      setError('Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        void submit(String(formData.get('username') || ''), String(formData.get('password') || ''))
      }}
      className="mt-6 space-y-4 rounded-xl border border-border bg-panel p-4 sm:p-6"
    >
      <input
        name="username"
        placeholder="Admin username or email"
        required
        className="w-full rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      <input
        name="password"
        type="password"
        placeholder="Admin password"
        required
        className="w-full rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      {error ? <p className="text-xs font-semibold text-rose-500">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md disabled:opacity-70 transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]"
      >
        <span className="inline-flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Signing in...' : 'Enter admin panel'}
        </span>
      </button>
    </form>
  )
}
