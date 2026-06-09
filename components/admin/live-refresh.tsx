'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function LiveRefresh({ intervalMs = 10000 }: Readonly<{ intervalMs?: number }>) {
  const router = useRouter()

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        router.refresh()
      }
    }

    const id = window.setInterval(refresh, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, router])

  return null
}
