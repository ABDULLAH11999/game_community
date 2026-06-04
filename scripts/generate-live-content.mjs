import fs from 'fs/promises'
import path from 'path'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')

const games = [
  'Call of Duty: Warzone',
  'Counter-Strike 2',
  'Apex Legends',
  'PUBG: Battlegrounds',
  'Valorant',
  'Garena Free Fire',
  "Tom Clancy's Rainbow Six Siege",
  'Overwatch 2',
  'Fortnite',
  'Roblox',
  'Minecraft',
  'Ark: Survival Ascended',
  'Rust',
  'Dead by Daylight',
  'Palworld',
  "No Man's Sky",
  'EA Sports FC',
  'Grand Theft Auto Online',
  'Rocket League',
  'The Sims 4',
  'NBA 2K',
  'Forza Horizon 5',
  'Destiny 2',
  'World of Warcraft',
  'Warframe',
  'Genshin Impact',
  'Honkai: Star Rail',
  'Elden Ring',
  'The Elder Scrolls Online',
  'Fallout 76',
  'Helldivers 2',
  'Cyberpunk 2077',
  'League of Legends',
  'Dota 2',
  'Mobile Legends: Bang Bang',
  'Diablo IV',
  'Path of Exile',
  "Baldur's Gate 3",
  'Lost Ark',
  'Teamfight Tactics',
  'Tekken 8',
]

const slotLabels = ['Published now', '11 min ago', '24 min ago', '42 min ago', '1 hour ago', '3 hours ago']
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

function buildPost(game, issueType, index) {
  const title = `${game} ${issueType.titlePart}`
  const slug = slugify(title)
  const summary = `${game} ${issueType.summaryPart}`
  const slotTime = slotLabels[index % slotLabels.length]
  const publishedAt = new Date(Date.UTC(2026, 5, 4, 12, 0, 0) - index * 6 * 60 * 1000).toISOString()

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

async function main() {
  const existingSettings = await readJson('settings.json', {})

  const nextPosts = games.flatMap((game, gameIndex) =>
    issueTypes.map((issueType, issueIndex) => buildPost(game, issueType, gameIndex * issueTypes.length + issueIndex)),
  )

  const nextSettings = {
    ...existingSettings,
    games,
    canonicalUrl: 'https://livepatch.online',
    scheduledSlots: Array.isArray(existingSettings.scheduledSlots)
      ? existingSettings.scheduledSlots.map((slot) => ({
          ...slot,
          games: Array.isArray(slot.games)
            ? slot.games.map((game) => (game.toLowerCase() === 'takken8' ? 'Tekken 8' : game))
            : slot.games,
          title: typeof slot.title === 'string' && slot.title.toLowerCase().includes('takken8')
            ? slot.title.replace(/takken8/gi, 'Tekken 8')
            : slot.title,
        }))
      : [],
  }

  await writeJson('settings.json', nextSettings)
  await writeJson('post.json', nextPosts)

  console.log(`Generated ${nextPosts.length} live posts and updated settings for ${games.length} games.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
