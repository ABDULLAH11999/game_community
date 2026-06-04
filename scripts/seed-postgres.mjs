import fs from 'fs/promises'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { Pool } from 'pg'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')

async function readJson(name, fallback) {
  const target = path.join(dataDir, name)
  try {
    const raw = await fs.readFile(target, 'utf8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function loadEnvFile() {
  if (process.env.DATABASE_URL?.trim()) {
    return
  }

  const envPath = path.join(process.cwd(), '.env')
  if (!existsSync(envPath)) {
    return
  }

  const raw = readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const index = trimmed.indexOf('=')
    if (index === -1) {
      continue
    }

    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (key === 'DATABASE_URL' && value) {
      process.env.DATABASE_URL = value
      break
    }
  }
}

async function ensureSchema(pool) {
  await pool.query(`
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
}

async function upsertRows(pool, table, rows, keyField) {
  for (const row of rows) {
    const key = row[keyField]
    await pool.query(
      `INSERT INTO ${table} (${keyField}, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (${keyField}) DO UPDATE SET data = EXCLUDED.data`,
      [key, JSON.stringify(row)]
    )
  }
}

async function upsertComments(pool, comments) {
  for (const [slug, rows] of Object.entries(comments)) {
    await pool.query(
      `INSERT INTO issue_comments (issue_slug, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (issue_slug) DO UPDATE SET data = EXCLUDED.data`,
      [slug, JSON.stringify(rows)]
    )
  }
}

async function upsertSettings(pool, settings) {
  await pool.query(
    `INSERT INTO site_settings (id, data)
     VALUES ('default', $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    [JSON.stringify(settings)]
  )
}

async function main() {
  loadEnvFile()

  const connectionString = process.env.DATABASE_URL?.trim()
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.')
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const [users, pendingSignups, sessions, contactMessages, visitors, posts, issueComments, settings] =
      await Promise.all([
        readJson('users.json', []),
        readJson('pending-signups.json', []),
        readJson('sessions.json', []),
        readJson('contact-messages.json', []),
        readJson('visitors.json', []),
        readJson('post.json', []),
        readJson('issue-comments.json', {}),
        readJson('settings.json', {}),
      ])

    await ensureSchema(pool)
    await Promise.all([
      upsertRows(pool, 'users', users, 'id'),
      upsertRows(pool, 'pending_signups', pendingSignups, 'id'),
      upsertRows(pool, 'sessions', sessions, 'token'),
      upsertRows(pool, 'contact_messages', contactMessages, 'id'),
      upsertRows(pool, 'visitors', visitors, 'id'),
      upsertRows(pool, 'posts', posts, 'id'),
      upsertComments(pool, issueComments),
      upsertSettings(pool, settings),
    ])

    console.log('Neon seed completed from local JSON snapshots.')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
