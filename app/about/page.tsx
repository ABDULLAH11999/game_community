import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { SiteShell } from '@/components/site-shell'

export default function AboutPage() {
  return (
    <SiteShell
      title="About LivePatch"
      subtitle="A free gaming resource for clear bug reports, verified workarounds, and searchable patch knowledge players can rely on."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading
              eyebrow="Mission"
              title="Built to help players solve issues faster"
              detail="LivePatch gives players free access to bug reports, community workarounds, and clear issue pages so problems are easier to understand, compare, and fix."
            />
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {[
                'Free issue summaries written in plain language',
                'Searchable fix pages for long-tail gaming questions',
                'Community conversations focused on workarounds and results',
                'Moderation tools that keep discussions safe and useful',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-panel-2/20 p-4 text-xs font-semibold leading-relaxed text-muted shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading eyebrow="Principles" title="What guides the platform" />
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-blue-500/20 bg-panel-2/10 p-4 shadow-sm">
                <StatusBadge label="Easy to discover" tone="blue" />
                <p className="mt-2.5 text-xs leading-relaxed text-muted font-medium">
                  Every page is structured to stay readable, indexable, and helpful so players can find answers quickly when they search.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-panel-2/10 p-4 shadow-sm">
                <StatusBadge label="Community trust" tone="emerald" />
                <p className="mt-2.5 text-xs leading-relaxed text-muted font-medium">
                  Players get transparent moderation, clear reporting paths, and trustworthy summaries that separate rumors from reproducible issues.
                </p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-panel-2/10 p-4 shadow-sm">
                <StatusBadge label="Long-term value" tone="rose" />
                <p className="mt-2.5 text-xs leading-relaxed text-muted font-medium">
                  The goal is a lasting library of fix content that stays useful long after a patch cycle ends.
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </SiteShell>
  )
}
