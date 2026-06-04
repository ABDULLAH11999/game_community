import { Mail, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function ContactPage() {
  return (
    <SiteShell
      title="Contact LivePatch"
      subtitle="Use this page for support, moderation review, partnerships, feature requests, or technical questions."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel>
          <SectionHeading eyebrow="Contact Form" title="Send a message to the LivePatch team" />
          <ContactForm />
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading eyebrow="Reach Us" title="Support and business contact points" />
            <div className="mt-6 space-y-3 text-xs font-semibold text-text">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/10 p-3.5">
                <Mail className="h-4.5 w-4.5 text-blue-500" />
                allinoneg46@gmail.com
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-2/10 p-3.5">
                <MapPin className="h-4.5 w-4.5 text-cyan-500" />
                Remote operations with global gaming community coverage
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </SiteShell>
  )
}
