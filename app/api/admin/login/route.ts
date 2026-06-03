import { NextResponse } from 'next/server'
import { createAdminSession, hasAdminCredentials, verifyAdminCredentials } from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!hasAdminCredentials()) {
    return NextResponse.json({ error: 'Admin credentials are not configured.' }, { status: 500 })
  }

  const { username, password } = await request.json()
  const valid = await verifyAdminCredentials(String(username || ''), String(password || ''))

  if (!valid) {
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
  }

  createAdminSession()
  return NextResponse.json({ success: true })
}
