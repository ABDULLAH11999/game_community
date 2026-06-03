'use client'

import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setStatus('')
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || ''),
          email: String(formData.get('email') || ''),
          topic: String(formData.get('topic') || ''),
          message: String(formData.get('message') || ''),
        }),
      })
      const data = await response.json()
      setStatus(response.ok ? 'Your message has been sent to the PatchRadar admin inbox.' : data.error || 'Could not send the message.')
    } catch {
      setStatus('Could not send the message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={async (formData) => onSubmit(formData)} className="mt-6 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          placeholder="Your name"
          required
          className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          required
          className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
        />
      </div>
      <input
        name="topic"
        placeholder="Topic"
        required
        className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      <textarea
        name="message"
        rows={6}
        placeholder="Tell us how we can help"
        required
        className="rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      {status ? <p className="text-xs font-semibold text-accent">{status}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-fit rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-md disabled:opacity-70 transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]"
      >
        {loading ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
