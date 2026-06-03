import { NextRequest, NextResponse } from 'next/server'

const adminSessionCookie = 'patchradar_admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const adminCookie = request.cookies.get(adminSessionCookie)?.value
  const isAdminLogin = pathname === '/admin/login'

  if (isAdminLogin && adminCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (!isAdminLogin && !adminCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
