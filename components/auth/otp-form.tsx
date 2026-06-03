'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function OtpForm() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || ''
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: String(formData.get('otp') || ''),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Verification failed.')
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Unable to verify this code right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={async (formData) => onSubmit(formData)} className="space-y-4 rounded-xl border border-border bg-panel p-6">
      <p className="text-xs text-muted font-medium">Verification code sent to <span className="text-text font-bold">{email || 'your email'}</span>.</p>
      <input
        name="otp"
        placeholder="6-digit OTP code"
        required
        className="w-full rounded-xl border border-border bg-panel-2/20 px-4 py-3 text-sm text-text outline-none focus:border-accent/40 focus:shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-all placeholder:text-muted font-medium"
      />
      {error ? <p className="text-xs font-semibold text-rose-500">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md disabled:opacity-70 transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]"
      >
        {loading ? 'Verifying...' : 'Verify account'}
      </button>
    </form>
  )
}
