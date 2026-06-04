import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function TermsConditionsPage() {
  const terms = [
    'Users must not post abusive, illegal, misleading, or intentionally harmful content.',
    'LivePatch may moderate, hide, or remove messages that violate site standards or create safety risks for the community.',
    'AI generated summaries are editorial tools and should not replace official developer statements or platform support guidance.',
    'By submitting bug reports or comments, users grant LivePatch permission to display and organize that content across issue pages and community sections.',
  ]

  return (
    <SiteShell
      title="Terms & Conditions"
      subtitle="The ground rules for participating in the community, submitting issue reports, and using platform features."
    >
      <GlassPanel>
        <SectionHeading eyebrow="Use of Service" title="Community participation rules" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {terms.map((term, index) => (
            <div key={index} className="rounded-xl border border-border bg-panel-2/10 p-4 text-xs font-semibold leading-relaxed text-muted">
              {term}
            </div>
          ))}
        </div>
      </GlassPanel>
    </SiteShell>
  )
}
