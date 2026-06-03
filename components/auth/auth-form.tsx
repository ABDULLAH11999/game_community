'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AuthForm({ mode }: Readonly<{ mode: 'signin' | 'signup' }>) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setError('')
    setLoading(true)

    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    }

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      if (mode === 'signup' && data.otpRequired) {
        router.push(`/verify-otp?email=${encodeURIComponent(payload.email)}`)
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Unable to complete the request right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      action={async (formData) => onSubmit(formData)}
      className="space-y-4 rounded-xl border border-border bg-panel p-6"
    >
      {mode === 'signup' ? (
        <input
          name="name"
          placeholder="Display name"
          required
          className="w-full rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
        />
      ) : null}
      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
        className="w-full rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-xl border border-border bg-bg/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-muted font-medium dark:bg-panel-2/70 focus:border-accent/40 focus:bg-panel focus:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      />
      {error ? <p className="text-xs font-semibold text-rose-500">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] disabled:opacity-75"
      >
        {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
      <p className="text-xs text-muted font-medium text-center">
        {mode === 'signup' ? 'Already have an account?' : 'Need a new account?'}{' '}
        <Link href={mode === 'signup' ? '/signin' : '/signup'} className="text-accent hover:underline">
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </form>
  )
}
