import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function AdminLoginPage() {
  return (
    <main className="pr-theme min-h-screen bg-bg text-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-panel shadow-sm">
            <Gamepad2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-text">PatchRadar</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted">Admin login</p>
          </div>
        </div>

        <GlassPanel>
          <SectionHeading eyebrow="Protected Access" title="Admin sign in" detail="Use your admin username or email. Default password: admin7940." />
          <AdminLoginForm />
          <div className="mt-5 text-center text-[11px] text-muted">
            <Link href="/" className="font-semibold text-accent hover:underline">
              Return to public site
            </Link>
          </div>
        </GlassPanel>
      </div>
    </main>
  )
}
