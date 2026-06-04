import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'
import { siteSettings } from '@/lib/site-data'
import type {
  AuthSession,
  AuthUser,
  ContactMessage,
  IssueComment,
  PendingSignup,
  PostRecord,
  SiteSettings,
  VisitorRecord,
} from '@/lib/types'

const dataDir = path.join(process.cwd(), 'data')
const fallbackSettings = mergeSettings({})

type DataSnapshot = {
  users: AuthUser[]
  pendingSignups: PendingSignup[]
  sessions: AuthSession[]
  contactMessages: ContactMessage[]
  posts: PostRecord[]
  issueComments: Record<string, IssueComment[]>
  visitors: VisitorRecord[]
  settings: SiteSettings
}

const localSnapshot = loadLocalSnapshot()
let snapshot: DataSnapshot = localSnapshot
let pool: Pool | null = null
let schemaReadyPromise: Promise<void> | null = null
let primePromise: Promise<void> | null = null

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

function mergeSettings(raw: Partial<SiteSettings>) {
  return {
    ...siteSettings,
    ...raw,
    scheduledSlots: raw.scheduledSlots || siteSettings.scheduledSlots,
  }
}

function loadLocalSnapshot(): DataSnapshot {
  return {
    users: readJson<AuthUser[]>('users.json', []),
    pendingSignups: readJson<PendingSignup[]>('pending-signups.json', []),
    sessions: readJson<AuthSession[]>('sessions.json', []),
    contactMessages: readJson<ContactMessage[]>('contact-messages.json', []),
    posts: readJson<PostRecord[]>('post.json', []),
    issueComments: readJson<Record<string, IssueComment[]>>('issue-comments.json', {}),
    visitors: readJson<VisitorRecord[]>('visitors.json', []),
    settings: mergeSettings(readJson<Partial<SiteSettings>>('settings.json', {})),
  }
}

function writeLocalSnapshot(nextSnapshot: DataSnapshot) {
  writeJson('users.json', nextSnapshot.users)
  writeJson('pending-signups.json', nextSnapshot.pendingSignups)
  writeJson('sessions.json', nextSnapshot.sessions)
  writeJson('contact-messages.json', nextSnapshot.contactMessages)
  writeJson('post.json', nextSnapshot.posts)
  writeJson('issue-comments.json', nextSnapshot.issueComments)
  writeJson('visitors.json', nextSnapshot.visitors)
  writeJson('settings.json', nextSnapshot.settings)
}

function getPool() {
  const connectionString = process.env.DATABASE_URL?.trim()
  if (!connectionString) return null

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  }

  return pool
}

async function ensureSchema() {
  const db = getPool()
  if (!db) return

  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pending_signups (
          id text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sessions (
          token text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS contact_messages (
          id text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS visitors (
          id text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS posts (
          id text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS issue_comments (
          issue_slug text PRIMARY KEY,
          data jsonb NOT NULL
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          id text PRIMARY KEY,
          data jsonb NOT NULL
        );
      `)
    })().catch((error) => {
      schemaReadyPromise = null
      throw error
    })
  }

  await schemaReadyPromise
}

async function countRows(table: string) {
  const db = getPool()
  if (!db) return 0
  const result = await db.query(`SELECT COUNT(*)::int AS count FROM ${table}`)
  return Number(result.rows[0]?.count || 0)
}

async function upsertRows<T extends { id: string }>(table: string, rows: T[]) {
  const db = getPool()
  if (!db || !rows.length) return

  await ensureSchema()

  for (const row of rows) {
    await db.query(
      `INSERT INTO ${table} (id, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [row.id, JSON.stringify(row)]
    )
  }
}

async function upsertKeyedRows<T>(table: string, keyColumn: string, rows: Array<[string, T]>) {
  const db = getPool()
  if (!db || !rows.length) return

  await ensureSchema()

  for (const [key, value] of rows) {
    await db.query(
      `INSERT INTO ${table} (${keyColumn}, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (${keyColumn}) DO UPDATE SET data = EXCLUDED.data`,
      [key, JSON.stringify(value)]
    )
  }
}

async function loadSnapshotFromDb(): Promise<DataSnapshot> {
  const db = getPool()
  if (!db) return snapshot

  await ensureSchema()

  const [
    usersResult,
    pendingSignupsResult,
    sessionsResult,
    contactMessagesResult,
    visitorsResult,
    postsResult,
    issueCommentsResult,
    settingsResult,
  ] = await Promise.all([
    db.query('SELECT data FROM users ORDER BY data->>\'createdAt\' ASC, id ASC'),
    db.query('SELECT data FROM pending_signups ORDER BY data->>\'createdAt\' DESC, id DESC'),
    db.query('SELECT data FROM sessions ORDER BY data->>\'createdAt\' DESC, token DESC'),
    db.query('SELECT data FROM contact_messages ORDER BY data->>\'createdAt\' DESC, id DESC'),
    db.query('SELECT data FROM visitors ORDER BY data->>\'timestamp\' DESC, id DESC'),
    db.query('SELECT data FROM posts ORDER BY data->>\'publishedAt\' DESC, id DESC'),
    db.query('SELECT issue_slug, data FROM issue_comments ORDER BY issue_slug ASC'),
    db.query("SELECT data FROM site_settings WHERE id = 'default' LIMIT 1"),
  ])

  const issueComments: Record<string, IssueComment[]> = {}
  for (const row of issueCommentsResult.rows) {
    const issueSlug = String((row as { issue_slug: string }).issue_slug)
    issueComments[issueSlug] = row.data as IssueComment[]
  }

  return {
    users: usersResult.rows.map((row) => row.data as AuthUser),
    pendingSignups: pendingSignupsResult.rows.map((row) => row.data as PendingSignup),
    sessions: sessionsResult.rows.map((row) => row.data as AuthSession),
    contactMessages: contactMessagesResult.rows.map((row) => row.data as ContactMessage),
    visitors: visitorsResult.rows.map((row) => row.data as VisitorRecord),
    posts: postsResult.rows.map((row) => row.data as PostRecord),
    issueComments,
    settings: mergeSettings((settingsResult.rows[0]?.data as Partial<SiteSettings>) || {}),
  }
}

async function seedFromLocalIfEmpty() {
  const db = getPool()
  if (!db) return

  await ensureSchema()

  if ((await countRows('users')) === 0 && snapshot.users.length) {
    await upsertRows('users', snapshot.users)
  }

  if ((await countRows('pending_signups')) === 0 && snapshot.pendingSignups.length) {
    await upsertRows('pending_signups', snapshot.pendingSignups)
  }

  if ((await countRows('sessions')) === 0 && snapshot.sessions.length) {
    await upsertKeyedRows(
      'sessions',
      'token',
      snapshot.sessions.map((session) => [session.token, session]),
    )
  }

  if ((await countRows('contact_messages')) === 0 && snapshot.contactMessages.length) {
    await upsertRows('contact_messages', snapshot.contactMessages)
  }

  if ((await countRows('visitors')) === 0 && snapshot.visitors.length) {
    await upsertRows('visitors', snapshot.visitors)
  }

  if ((await countRows('posts')) === 0 && snapshot.posts.length) {
    await upsertRows('posts', snapshot.posts)
  }

  if ((await countRows('issue_comments')) === 0 && Object.keys(snapshot.issueComments).length) {
    await upsertKeyedRows(
      'issue_comments',
      'issue_slug',
      Object.entries(snapshot.issueComments)
    )
  }

  if ((await countRows('site_settings')) === 0) {
    await upsertKeyedRows('site_settings', 'id', [['default', snapshot.settings]])
  }
}

async function mirrorSnapshotToDb() {
  const db = getPool()
  if (!db) return

  try {
    await ensureSchema()
    await Promise.all([
      upsertRows('users', snapshot.users),
      upsertRows('pending_signups', snapshot.pendingSignups),
      upsertKeyedRows(
        'sessions',
        'token',
        snapshot.sessions.map((session) => [session.token, session]),
      ),
      upsertRows('contact_messages', snapshot.contactMessages),
      upsertRows('visitors', snapshot.visitors),
      upsertRows('posts', snapshot.posts),
      upsertKeyedRows('issue_comments', 'issue_slug', Object.entries(snapshot.issueComments)),
      upsertKeyedRows('site_settings', 'id', [['default', snapshot.settings]]),
    ])
  } catch (error) {
    console.warn('LivePatch database mirror failed; using local JSON snapshot.', error)
  }
}

export async function primeDatabaseSnapshot() {
  const db = getPool()
  if (!db) return snapshot

  if (!primePromise) {
    primePromise = (async () => {
      try {
        await seedFromLocalIfEmpty()
        const nextSnapshot = await loadSnapshotFromDb()
        snapshot = nextSnapshot
        writeLocalSnapshot(nextSnapshot)
      } catch (error) {
        console.warn('LivePatch database bootstrap failed; falling back to local JSON.', error)
      }
    })().catch(() => {
      primePromise = null
    })
  }

  await primePromise
  return snapshot
}

export function getUsers() {
  return snapshot.users
}

export async function saveUsers(users: AuthUser[]) {
  snapshot.users = users
  writeJson('users.json', users)
  await mirrorSnapshotToDb()
}

export function getPendingSignups() {
  return snapshot.pendingSignups
}

export async function savePendingSignups(signups: PendingSignup[]) {
  snapshot.pendingSignups = signups
  writeJson('pending-signups.json', signups)
  await mirrorSnapshotToDb()
}

export function getSessions() {
  return snapshot.sessions
}

export async function saveSessions(sessions: AuthSession[]) {
  snapshot.sessions = sessions
  writeJson('sessions.json', sessions)
  await mirrorSnapshotToDb()
}

export function getContactMessages() {
  return snapshot.contactMessages
}

export async function saveContactMessages(messages: ContactMessage[]) {
  snapshot.contactMessages = messages
  writeJson('contact-messages.json', messages)
  await mirrorSnapshotToDb()
}

export function getVisitors() {
  return snapshot.visitors
}

export async function saveVisitors(visitors: VisitorRecord[]) {
  snapshot.visitors = visitors
  writeJson('visitors.json', visitors)
  await mirrorSnapshotToDb()
}

export function getPosts() {
  return snapshot.posts
}

export async function savePosts(posts: PostRecord[]) {
  snapshot.posts = posts
  writeJson('post.json', posts)
  await mirrorSnapshotToDb()
}

export function getIssueComments() {
  return snapshot.issueComments
}

export async function saveIssueComments(comments: Record<string, IssueComment[]>) {
  snapshot.issueComments = comments
  writeJson('issue-comments.json', comments)
  await mirrorSnapshotToDb()
}

export function getStoredSettings(): SiteSettings {
  return snapshot.settings
}

export async function saveStoredSettings(settings: SiteSettings) {
  snapshot.settings = mergeSettings(settings)
  writeJson('settings.json', snapshot.settings)
  await mirrorSnapshotToDb()
}
