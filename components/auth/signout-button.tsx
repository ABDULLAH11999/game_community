'use client'

import { useRouter } from 'next/navigation'

export function SignoutButton() {
  const router = useRouter()

  return (
    <button
      onClick={async () => {
        await fetch('/api/auth/signout', { method: 'POST' })
        router.push('/')
        router.refresh()
      }}
      className="rounded-lg border border-border bg-panel px-3.5 py-1.5 text-xs font-semibold text-muted hover:text-text hover:border-accent/40 transition-all"
    >
      Sign out
    </button>
  )
}
