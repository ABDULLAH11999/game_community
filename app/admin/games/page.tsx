import { GamesEditor } from '@/components/admin/games-editor'
import { GameSlotManager } from '@/components/admin/game-slot-manager'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'
import { getStoredSettings } from '@/lib/db'

export default function AdminGamesPage() {
  const settings = getStoredSettings()

  return (
    <div className="space-y-6">
      <GlassPanel>
        <SectionHeading
          eyebrow="Games"
          title="Game tags and schedule slots"
          detail="Manage game tags, then assign time slots so the admin publishing workflow can queue the next AI-supported post."
        />
      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel>
          <h3 className="mb-4 border-b border-border pb-3 font-display text-lg font-bold text-text">Game Tags</h3>
          <GamesEditor initialTags={settings.games} />
        </GlassPanel>

        <GlassPanel>
          <h3 className="mb-4 border-b border-border pb-3 font-display text-lg font-bold text-text">Slot Planner</h3>
          <GameSlotManager availableGames={settings.games} initialSlots={settings.scheduledSlots} />
        </GlassPanel>
      </div>
    </div>
  )
}
