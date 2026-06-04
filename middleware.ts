import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

const adminSessionCookie = 'patchradar_admin_session'

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
    const forwardedFor = request.headers.get('x-forwarded-for') || ''
    const realIp = request.headers.get('x-real-ip') || ''
    const cfIp = request.headers.get('cf-connecting-ip') || ''
    const trackingUrl = new URL('/api/visitors', request.url)

    event.waitUntil(
      fetch(trackingUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': forwardedFor,
          'x-real-ip': realIp,
          'cf-connecting-ip': cfIp,
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
        }),
      }).catch(() => undefined),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'],
}
