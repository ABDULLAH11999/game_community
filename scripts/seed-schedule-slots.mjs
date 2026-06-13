import fs from 'fs/promises'
import path from 'path'

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const gameCatalogFile = path.join(dataDir, 'game-catalog.json')
const startMinutesFromMidnight = 9 * 60
const slotGapMinutes = 15

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

function formatSlotTime(index) {
  const totalMinutes = startMinutesFromMidnight + index * slotGapMinutes
  const wrappedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = String(Math.floor(wrappedMinutes / 60)).padStart(2, '0')
  const minutes = String(wrappedMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes} PKT`
}

async function main() {
  const games = JSON.parse(await fs.readFile(gameCatalogFile, 'utf8'))
  const settings = await readJson('settings.json', {})

  const scheduledSlots = games.map((game, index) => ({
    id: `slot-${String(index + 1).padStart(3, '0')}`,
    time: formatSlotTime(index),
    games: [game],
    title: `${game} slot update`,
  }))

  await writeJson('settings.json', {
    ...settings,
    games,
    scheduledSlots,
  })

  console.log(`Seeded ${scheduledSlots.length} schedule slots at 15 minute gaps.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
