import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { getPendingSignups, getUsers, savePendingSignups, saveUsers } from '@/lib/db'
import { sendAdminSignupNotification, sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  const { email, otp } = await request.json()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedOtp = String(otp || '').trim()

  const pendingSignups = getPendingSignups()
  const pending = pendingSignups.find((item) => item.email === normalizedEmail)

  if (!pending) {
    return NextResponse.json({ error: 'No pending signup found for this email.' }, { status: 404 })
  }

  if (pending.expiresAt < new Date().toISOString()) {
    savePendingSignups(pendingSignups.filter((item) => item.id !== pending.id))
    return NextResponse.json({ error: 'Your OTP expired. Please sign up again.' }, { status: 400 })
  }

  if (pending.otpCode !== normalizedOtp) {
    return NextResponse.json({ error: 'Incorrect verification code.' }, { status: 400 })
  }

  const users = getUsers()
  if (users.some((user) => user.email === normalizedEmail)) {
    savePendingSignups(pendingSignups.filter((item) => item.id !== pending.id))
    return NextResponse.json({ error: 'Account already exists.' }, { status: 400 })
  }

  const user = {
    id: pending.id,
    name: pending.name,
    email: pending.email,
    passwordHash: pending.passwordHash,
    role: users.length === 0 ? ('admin' as const) : ('user' as const),
    verified: true,
    createdAt: pending.createdAt,
  }

  saveUsers([...users, user])
  savePendingSignups(pendingSignups.filter((item) => item.id !== pending.id))
  createSession(user.id)
  await Promise.allSettled([
    sendWelcomeEmail(user.email, user.name),
    sendAdminSignupNotification(user.email, user.name),
  ])

  return NextResponse.json({ success: true })
}
