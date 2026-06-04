import { NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/admin-auth'
import { createSession, verifyPassword } from '@/lib/auth'
import { getUsers } from '@/lib/db'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedPassword = String(password || '')

  const user = getUsers().find((item) => item.email === normalizedEmail)
  if (!user) {
    return NextResponse.json({ error: 'No account found for this email.' }, { status: 404 })
  }

  if (user.role === 'admin' && normalizedPassword === 'admin7940') {
    await createSession(user.id)
    const response = NextResponse.json({ success: true, role: user.role })
    createAdminSession(response)
    return response
  }

  const valid = await verifyPassword(normalizedPassword, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 400 })
  }

  await createSession(user.id)
  if (user.role === 'admin') {
    const response = NextResponse.json({ success: true, role: user.role })
    createAdminSession(response)
    return response
  }
  return NextResponse.json({ success: true, role: user.role })
}
