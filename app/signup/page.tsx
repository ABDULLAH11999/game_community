import { AuthForm } from '@/components/auth/auth-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function SignupPage() {
  return (
    <SiteShell
      title="Create Account"
      subtitle="Join the gaming community to report bugs, comment on issue threads, and receive updates on the games you follow."
    >
      <div className="mx-auto w-full max-w-2xl">
        <GlassPanel className="p-6 sm:p-8">
          <SectionHeading eyebrow="Player Registration" title="Create your LivePatch account" />
          <div className="mt-6">
            <AuthForm mode="signup" />
          </div>
        </GlassPanel>
      </div>
    </SiteShell>
  )
}
