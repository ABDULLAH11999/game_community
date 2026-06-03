import { SettingsForm } from '@/components/admin/settings-form'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'
import { getStoredSettings } from '@/lib/db'

export default function AdminSettingsPage() {
  const settings = getStoredSettings()

  return (
    <div className="space-y-6">
      <GlassPanel>
        <SectionHeading
          eyebrow="Site Settings"
          title="SEO and email controls"
          detail="Configure long-term discoverability, transaction email setup, and core platform settings."
        />
      </GlassPanel>

      <GlassPanel>
        <h3 className="font-display text-lg font-extrabold text-text tracking-tight border-b border-border pb-3 mb-6">SEO & App Configuration</h3>
        <SettingsForm settings={settings} />
      </GlassPanel>
    </div>
  )
}
