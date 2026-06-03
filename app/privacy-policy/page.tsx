import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function PrivacyPolicyPage() {
  const sections = [
    'We collect account details, contact form submissions, moderation events, and visitor analytics to operate the site and improve issue discovery.',
    'Visitor tracking can include IP address, approximate location, user agent, referrer, and visited page so admins can understand traffic quality and abuse patterns.',
    'Contact us submissions and account emails may be used for responses, moderation actions, service updates, and transactional communication.',
    'We do not sell private user data. Operational data is retained only as long as necessary for site security, moderation, and business administration.',
  ]

  return (
    <SiteShell title="Privacy Policy" subtitle="How PatchRadar handles data for community participation, moderation, analytics, and support communication.">
      <GlassPanel>
        <SectionHeading eyebrow="Data Use" title="Plain language privacy commitments" />
        <div className="mt-6 space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="rounded-xl border border-border bg-panel-2/10 p-4 text-xs font-semibold leading-relaxed text-muted">
              {section}
            </div>
          ))}
        </div>
      </GlassPanel>
    </SiteShell>
  )
}
