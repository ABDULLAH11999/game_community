import { AuthForm } from '@/components/auth/auth-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function SigninPage() {
  return (
    <SiteShell
      title="Sign In"
      subtitle="Return to your PatchRadar account to follow issues, post comments, and manage your gaming activity."
    >
      <div className="mx-auto w-full max-w-2xl">
        <GlassPanel className="p-6 sm:p-8">
          <SectionHeading eyebrow="Account Access" title="Sign in to PatchRadar" />
          <div className="mt-6">
            <AuthForm mode="signin" />
          </div>
        </GlassPanel>
      </div>
    </SiteShell>
  )
}
