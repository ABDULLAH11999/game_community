import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'

function EmailPreview({
  title,
  description,
}: Readonly<{
  title: string
  description: string
}>) {
  return (
    <div className="rounded-xl border border-border bg-panel-2/5 p-4 mt-3">
      <div className="rounded-xl border border-border bg-panel p-5 shadow-sm">
        <p className="text-[10px] uppercase font-bold tracking-wider text-accent">LivePatch Mail</p>
        <h3 className="mt-2.5 font-display text-lg font-bold text-text leading-tight">{title}</h3>
        <p className="mt-3.5 text-xs leading-relaxed text-muted font-medium">{description}</p>
        <div className="mt-5 rounded-lg border border-border bg-panel-2/50 py-2.5 text-center text-xs font-bold text-text cursor-pointer hover:bg-panel-2/80 transition-colors">
          Open dashboard
        </div>
      </div>
    </div>
  )
}

export default function AdminEmailTemplatesPage() {
  return (
    <GlassPanel>
      <SectionHeading
        eyebrow="Transactional Email UI"
        title="Professional email template previews"
        detail="These templates support welcome emails, admin signup notifications, and contact-form follow-up communication."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div>
          <StatusBadge label="Welcome Email" tone="blue" />
          <EmailPreview
            title="Welcome to LivePatch"
            description="Your account is active. Start tracking bugs, posting fixes, and following high-priority game issues across the community."
          />
        </div>
        <div>
          <StatusBadge label="Admin Signup Alert" tone="violet" />
          <EmailPreview
            title="New user registration received"
            description="A new player account has been created. Review the profile, moderation history, and activity from the admin panel."
          />
        </div>
        <div>
          <StatusBadge label="Contact Reply" tone="emerald" />
          <EmailPreview
            title="We received your message"
            description="Your contact request is now in the LivePatch support queue. A team member will follow up as soon as possible."
          />
        </div>
      </div>
    </GlassPanel>
  )
}
