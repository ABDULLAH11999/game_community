import { Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'

export default function ContactPage() {
  return (
    <SiteShell
      title="Contact PatchRadar"
      subtitle="Use this page for support, moderation review, partnerships, feature requests, or technical questions."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel>
          <SectionHeading eyebrow="Contact Form" title="Send a message to the PatchRadar team" />
          <ContactForm />
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading eyebrow="Reach Us" title="Support and business contact points" />
            <div className="mt-6 space-y-3 text-xs font-semibold text-text">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/10 p-3.5">
                <Mail className="h-4.5 w-4.5 text-blue-500" />
                hello@patchradar.gg
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/10 p-3.5">
                <Phone className="h-4.5 w-4.5 text-violet-500" />
                +1 (555) 014-7782
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/10 p-3.5">
                <MapPin className="h-4.5 w-4.5 text-cyan-500" />
                Remote operations with global gaming community coverage
              </div>
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading eyebrow="Admin Workflow" title="What happens after submission" />
            <div className="mt-4 flex flex-wrap gap-1.5">
              <StatusBadge label="Record shown in admin" tone="violet" />
              <StatusBadge label="Optional email response" tone="blue" />
              <StatusBadge label="Support audit trail" tone="emerald" />
            </div>
          </GlassPanel>
        </div>
      </div>
    </SiteShell>
  )
}
