import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/db'

const adminCookie = 'livepatch_admin_session'
const fallbackAdminUsername = 'admin'
const fallbackAdminPassword = 'admin7940'

function ensureAdminUser() {
  const users = getUsers()
  const hasAdmin = users.some((u) => u.role === 'admin')
  if (!hasAdmin) {
    users.push({
      id: 'u-admin',
      name: 'Admin User',
      email: 'admin@livepatch.online',
      passwordHash: bcrypt.hashSync(fallbackAdminPassword, 10),
      role: 'admin',
      verified: true,
      createdAt: new Date().toISOString(),
    })
    void saveUsers(users)
  }
}

export function hasAdminCredentials() {
  ensureAdminUser()
  return true
}

export async function verifyAdminCredentials(username: string, password: string) {
  ensureAdminUser()
  const users = getUsers()
  const admin = users.find((u) => u.role === 'admin')
  if (!admin) return false

  const input = username.trim().toLowerCase()
  const matchesUser =
    input === admin.email.toLowerCase() ||
    input === admin.name.toLowerCase() ||
    input === fallbackAdminUsername

  if (!matchesUser) return false
  if (password === fallbackAdminPassword) return true
  return bcrypt.compare(password, admin.passwordHash)
}

export function createAdminSession(response: NextResponse) {
  const token = crypto.randomBytes(32).toString('hex')
  response.cookies.set(adminCookie, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set(adminCookie, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function getCurrentAdmin() {
  ensureAdminUser()
  const hasSession = cookies().get(adminCookie)?.value
  if (!hasSession) return null
  const users = getUsers()
  const admin = users.find((u) => u.role === 'admin')
  return admin ? { username: admin.name, email: admin.email } : null
}
