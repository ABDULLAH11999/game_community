import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { getSessions, getUsers, saveSessions } from '@/lib/db'

const sessionCookie = 'livepatch_session'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex')
  const sessions = getSessions()
  sessions.push({
    token,
    userId,
    createdAt: new Date().toISOString(),
  })
  saveSessions(sessions)
  cookies().set(sessionCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearSession() {
  const token = cookies().get(sessionCookie)?.value
  if (!token) return
  saveSessions(getSessions().filter((session) => session.token !== token))
  cookies().delete(sessionCookie)
}

export function getCurrentUser() {
  const token = cookies().get(sessionCookie)?.value
  if (!token) return null
  const session = getSessions().find((item) => item.token === token)
  if (!session) return null
  return getUsers().find((user) => user.id === session.userId) ?? null
}

export function getSignedInUserName() {
  return getCurrentUser()?.name ?? null
}
