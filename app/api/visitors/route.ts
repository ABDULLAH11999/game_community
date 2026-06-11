import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getVisitors, refreshDatabaseSnapshot, saveVisitors } from '@/lib/db'
import type { VisitorRecord } from '@/lib/types'

function firstHeaderValue(value: string | null | undefined) {
  if (!value) return ''
  return value.split(',')[0]?.trim() || ''
}

function resolveIp(headers: Headers) {
  return (
    firstHeaderValue(headers.get('x-client-ip')) ||
    firstHeaderValue(headers.get('x-forwarded-for')) ||
    headers.get('x-real-ip')?.trim() ||
    headers.get('cf-connecting-ip')?.trim() ||
    headers.get('x-client-ip')?.trim() ||
    ''
  )
}

function resolveVisitorId(headers: Headers, body: Record<string, unknown>) {
  return String(body.visitorId || headers.get('x-visitor-id') || '').trim()
}

function resolveLocation(headers: Headers) {
  const city = headers.get('x-vercel-ip-city')?.trim()
  const country = headers.get('x-vercel-ip-country')?.trim()
  const region = headers.get('x-vercel-ip-country-region')?.trim()
  const parts = [city, region, country].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Unknown location'
}

function buildVisitedAtLabel(timestamp: string) {
  const now = Date.now()
  const elapsedMinutes = Math.max(0, Math.round((now - new Date(timestamp).getTime()) / 60000))
  if (elapsedMinutes < 1) return 'just now'
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`
  const hours = Math.floor(elapsedMinutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export async function POST(request: Request) {
  const headers = request.headers
  const body = await request.json().catch(() => ({} as Record<string, unknown>))

  const page = String(body.page || headers.get('x-visitor-path') || '/').trim() || '/'
  const search = String(body.search || headers.get('x-visitor-search') || '').trim()
  const referrer = String(body.referrer || headers.get('referer') || 'Direct').trim() || 'Direct'
  const userAgent = String(body.userAgent || headers.get('user-agent') || '').trim()
  const visitorId = resolveVisitorId(headers, body)
  const timestamp = new Date().toISOString()
  const ip = String(body.ip || resolveIp(headers)).trim() || (visitorId ? `visitor-${visitorId.slice(0, 8)}` : 'unknown')
  const session = String(body.session || visitorId || `sess_${crypto.randomBytes(3).toString('hex')}`)

  await refreshDatabaseSnapshot()
  const existing = getVisitors()
  const record: VisitorRecord = {
    id: crypto.randomUUID(),
    ip,
    location: resolveLocation(headers),
    page: `${page}${search}`,
    referrer,
    timestamp,
    visitedAt: buildVisitedAtLabel(timestamp),
    session,
    type: existing.some((visitor) => visitor.session === session || visitor.ip === ip) ? 'Return' : 'New',
  }

  const nextVisitors = [record, ...existing].slice(0, 1000)
  await saveVisitors(nextVisitors)

  return NextResponse.json({
    success: true,
    visitor: {
      ...record,
      userAgent,
    },
  })
}
