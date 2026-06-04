import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createSession, generateOtp, hashPassword } from '@/lib/auth'
import { getPendingSignups, getStoredSettings, getUsers, savePendingSignups, saveUsers } from '@/lib/db'
import { sendAdminSignupNotification, sendOtpEmail, sendWelcomeEmail } from '@/lib/email'

export async function POST(request: Request) {
  const { name, email, password } = await request.json()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedName = String(name || '').trim()
  const normalizedPassword = String(password || '')

  if (!normalizedName || !normalizedEmail || normalizedPassword.length < 6) {
    return NextResponse.json({ error: 'Please provide valid signup details.' }, { status: 400 })
  }

  const users = getUsers()
  if (users.some((user) => user.email === normalizedEmail)) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 })
  }

  const settings = getStoredSettings()
  const passwordHash = await hashPassword(normalizedPassword)

  if (settings.smtpEnabled && settings.otpRequired) {
    const otpCode = generateOtp()
    const pending = getPendingSignups().filter((item) => item.email !== normalizedEmail)
    pending.push({
      id: crypto.randomUUID(),
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      otpCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })
    await savePendingSignups(pending)
    await sendOtpEmail(normalizedEmail, normalizedName, otpCode)
    return NextResponse.json({ otpRequired: true })
  }

  const user = {
    id: crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
    role: users.length === 0 ? ('admin' as const) : ('user' as const),
    verified: true,
    createdAt: new Date().toISOString(),
  }
  await saveUsers([...users, user])
  await createSession(user.id)
  await Promise.allSettled([
    sendWelcomeEmail(user.email, user.name),
    sendAdminSignupNotification(user.email, user.name),
  ])

  return NextResponse.json({ success: true })
}
