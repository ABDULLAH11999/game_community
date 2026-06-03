import { OtpForm } from '@/components/auth/otp-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function VerifyOtpPage() {
  return (
    <SiteShell
      title="Verify Email OTP"
      subtitle="When OTP verification is enabled in admin settings, users must confirm their email here before the account becomes active."
    >
      <div className="mx-auto w-full max-w-2xl">
        <GlassPanel className="p-6 sm:p-8">
          <SectionHeading eyebrow="Email Verification" title="Finish your signup" />
          <div className="mt-6">
            <OtpForm />
          </div>
        </GlassPanel>
      </div>
    </SiteShell>
  )
}
