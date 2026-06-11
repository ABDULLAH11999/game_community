import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const adminSessionCookie = 'livepatch_admin_session'
const visitorCookie = 'livepatch_visitor_id'

function createVisitorId() {
  return globalThis.crypto?.randomUUID?.() || `visitor_${Math.random().toString(36).slice(2, 10)}`
}

function shouldTrackVisitor(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')
  ) {
    return false
  }

  const accept = request.headers.get('accept') || ''
  return accept.includes('text/html')
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const adminCookie = request.cookies.get(adminSessionCookie)?.value
    const isAdminLogin = pathname === '/admin/login'

    if (isAdminLogin && adminCookie) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (!isAdminLogin && !adminCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (shouldTrackVisitor(request)) {
    const visitorId = request.cookies.get(visitorCookie)?.value || createVisitorId()
    const resolvedIp =
      request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('cf-connecting-ip')?.trim() ||
      ''
    const trackingUrl = new URL('/api/visitors', request.url)

    if (!request.cookies.get(visitorCookie)?.value) {
      response.cookies.set(visitorCookie, visitorId, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
    }

    event.waitUntil(
      fetch(trackingUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': resolvedIp,
          'x-real-ip': resolvedIp,
          'x-client-ip': resolvedIp,
          'x-visitor-id': visitorId,
          referer: request.headers.get('referer') || '',
          'user-agent': request.headers.get('user-agent') || '',
          'x-visitor-path': request.nextUrl.pathname,
          'x-visitor-search': request.nextUrl.search,
        },
        body: JSON.stringify({
          page: request.nextUrl.pathname,
          search: request.nextUrl.search,
          referrer: request.headers.get('referer') || 'Direct',
          userAgent: request.headers.get('user-agent') || '',
          visitorId,
          ip: resolvedIp,
        }),
      }).catch(() => undefined),
    )
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'],
}
