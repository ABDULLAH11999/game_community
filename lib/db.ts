import fs from 'fs'
import path from 'path'
import { siteSettings } from '@/lib/site-data'
import type {
  AuthSession,
  AuthUser,
  ContactMessage,
  IssueComment,
  PendingSignup,
  PostRecord,
  SiteSettings,
} from '@/lib/types'

const dataDir = path.join(process.cwd(), 'data')

function ensureDir() {
  fs.mkdirSync(dataDir, { recursive: true })
}

function filePath(name: string) {
  ensureDir()
  return path.join(dataDir, name)
}

function readJson<T>(name: string, fallback: T): T {
  const target = filePath(name)
  if (!fs.existsSync(target)) {
    writeJson(name, fallback)
    return fallback
  }

  try {
    return JSON.parse(fs.readFileSync(target, 'utf8')) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(name: string, value: T) {
  fs.writeFileSync(filePath(name), JSON.stringify(value, null, 2), 'utf8')
}

export function getUsers() {
  return readJson<AuthUser[]>('users.json', [])
}

export function saveUsers(users: AuthUser[]) {
  writeJson('users.json', users)
}

export function getPendingSignups() {
  return readJson<PendingSignup[]>('pending-signups.json', [])
}

export function savePendingSignups(signups: PendingSignup[]) {
  writeJson('pending-signups.json', signups)
}

export function getSessions() {
  return readJson<AuthSession[]>('sessions.json', [])
}

export function saveSessions(sessions: AuthSession[]) {
  writeJson('sessions.json', sessions)
}

export function getContactMessages() {
  return readJson<ContactMessage[]>('contact-messages.json', [])
}

export function saveContactMessages(messages: ContactMessage[]) {
  writeJson('contact-messages.json', messages)
}

export function getPosts() {
  return readJson<PostRecord[]>('post.json', [])
}

export function savePosts(posts: PostRecord[]) {
  writeJson('post.json', posts)
}

export function getIssueComments() {
  return readJson<Record<string, IssueComment[]>>('issue-comments.json', {})
}

export function saveIssueComments(comments: Record<string, IssueComment[]>) {
  writeJson('issue-comments.json', comments)
}

export function getStoredSettings(): SiteSettings {
  return {
    ...siteSettings,
    ...readJson<Partial<SiteSettings>>('settings.json', {}),
    scheduledSlots: readJson<Partial<SiteSettings>>('settings.json', {}).scheduledSlots || siteSettings.scheduledSlots,
  }
}

export function saveStoredSettings(settings: SiteSettings) {
  writeJson('settings.json', settings)
}
