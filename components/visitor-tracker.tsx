'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const visitorStorageKey = 'livepatch_visitor_id'

function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return ''

  const existing = window.localStorage.getItem(visitorStorageKey)
  if (existing) {
    return existing
  }

  const created = window.crypto?.randomUUID?.() || `visitor_${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(visitorStorageKey, created)
  return created
}

export function VisitorTracker() {
  const pathname = usePathname()
  const hasMounted = useRef(false)
  const lastTrackedUrl = useRef('')

  useEffect(() => {
    const search = window.location.search.replace(/^\?/, '')
    const url = search ? `${pathname}?${search}` : pathname

    if (!hasMounted.current) {
      hasMounted.current = true
      lastTrackedUrl.current = url
      return
    }

    if (!url || lastTrackedUrl.current === url) {
      return
    }

    lastTrackedUrl.current = url

    void fetch('/api/visitors', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-visitor-id': getOrCreateVisitorId(),
      },
      body: JSON.stringify({
        page: pathname,
        search: search ? `?${search}` : '',
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        visitorId: getOrCreateVisitorId(),
      }),
      keepalive: true,
    }).catch(() => undefined)
  }, [pathname])

  return null
}
