import type { ScheduledSlot } from '@/lib/types'

const startMinutesFromMidnight = 9 * 60
const slotGapMinutes = 15

export function formatPktTime(totalMinutes: number) {
  const wrappedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = String(Math.floor(wrappedMinutes / 60)).padStart(2, '0')
  const minutes = String(wrappedMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes} PKT`
}

export function buildScheduledSlots(games: string[]): ScheduledSlot[] {
  return games.map((game, index) => {
    const time = formatPktTime(startMinutesFromMidnight + index * slotGapMinutes)

    return {
      id: `slot-${String(index + 1).padStart(3, '0')}`,
      time,
      games: [game],
      title: `${game} slot update`,
    }
  })
}

export function buildSlotTimeLabel(index: number) {
  return formatPktTime(startMinutesFromMidnight + index * slotGapMinutes)
}

export function getSlotGapMinutes() {
  return slotGapMinutes
}
