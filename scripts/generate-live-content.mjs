import fs from 'fs/promises'
import path from 'path'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const gameCatalogFile = path.join(dataDir, 'game-catalog.json')
const issueTypes = [
  {
    slugPart: 'matchmaking-queue-stalls-after-update',
    titlePart: 'matchmaking queue stalls after update',
    summaryPart:
      'Players are reporting that the queue hangs after the latest update and the lobby stops advancing until the client is restarted.',
    contentParts: [
      'This live report summarizes repeated player submissions, search trend checks, and community replies around a queue stall that appears after recent game updates.',
      'The problem usually shows up when players try to queue again after a match or party swap, leaving the lobby stuck while the timer keeps running.',
      'Short-term workarounds include restarting the client, rejoining from a fresh party, and avoiding rapid back-to-back queue attempts until the next patch lands.',
    ],
    keywordsPart: ['matchmaking bug', 'queue stall', 'lobby freeze'],
  },
  {
    slugPart: 'frame-pacing-stutter-after-long-session',
    titlePart: 'frame pacing stutter after long session',
    summaryPart:
      'Players are seeing a frame pacing spike after longer sessions, tab changes, or menu loops, with the biggest drops happening on mid-range systems.',
    contentParts: [
      'This live report captures recurring community feedback about a performance dip that becomes easier to notice after an extended play session.',
      'Players describe uneven frame pacing, brief audio pops, or a slow recovery after changing menus, alt-tabbing, or loading back into a match.',
      'Current workarounds include closing background overlays, updating drivers, lowering a few visual settings, and restarting the game between sessions.',
    ],
    keywordsPart: ['performance stutter', 'frame pacing', 'low FPS fix'],
  },
]

const startMinutesFromMidnight = 9 * 60
const slotGapMinutes = 15

function formatSlotTime(index) {
  const totalMinutes = startMinutesFromMidnight + index * slotGapMinutes
  const wrappedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = String(Math.floor(wrappedMinutes / 60)).padStart(2, '0')
  const minutes = String(wrappedMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes} PKT`
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function readJson(name, fallback) {
  const target = path.join(dataDir, name)
  try {
    const raw = await fs.readFile(target, 'utf8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function writeJson(name, value) {
  const target = path.join(dataDir, name)
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

async function readGameCatalog() {
  const raw = await fs.readFile(gameCatalogFile, 'utf8')
  return JSON.parse(raw)
}

function buildPost(game, issueType, index) {
  const title = `${game} ${issueType.titlePart}`
  const slug = slugify(title)
  const summary = `${game} ${issueType.summaryPart}`
  const slotTime = formatSlotTime(index)
  const publishedAt = new Date(Date.UTC(2026, 5, 4, 4, 0, 0) - index * slotGapMinutes * 60 * 1000).toISOString()

  return {
    id: `post-${slug}`,
    slug,
    games: [game],
    slotTime,
    title,
    summary,
    content: [
      `This live report is published for ${game} after a spike in player feedback around ${issueType.titlePart}.`,
      issueType.contentParts[0],
      issueType.contentParts[1],
    ],
    keywords: Array.from(
      new Set([
        game,
        `${game} bug report`,
        `${game} live report`,
        `${game} issue`,
        `${game} fix`,
        ...issueType.keywordsPart.map((keyword) => `${game} ${keyword}`),
        ...issueType.keywordsPart,
      ]),
    ),
    metaTitle: title,
    metaDescription: summary,
    publishedAt,
    status: 'published',
  }
}

function buildSlot(game, index) {
  return {
    id: `slot-${String(index + 1).padStart(3, '0')}`,
    time: formatSlotTime(index),
    games: [game],
    title: `${game} slot update`,
  }
}

async function main() {
  const games = await readGameCatalog()
  const existingSettings = await readJson('settings.json', {})

  const nextPosts = games.map((game, index) => buildPost(game, issueTypes[index % issueTypes.length], index))

  const nextSettings = {
    ...existingSettings,
    games,
    canonicalUrl: 'https://livepatch.online',
    scheduledSlots: games.map((game, index) => buildSlot(game, index)),
  }

  await writeJson('settings.json', nextSettings)
  await writeJson('post.json', nextPosts)

  console.log(`Generated ${nextPosts.length} live posts and updated settings for ${games.length} games.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
