import Image from 'next/image'
import Link from 'next/link'
import { CarFront, Castle, Crosshair, Flame, Gamepad2, Search, Shield, Trophy, Zap } from 'lucide-react'
import { ChatbotButton } from '@/components/chatbot-button'
import { SignoutButton } from '@/components/auth/signout-button'
import { getCurrentUser } from '@/lib/auth'
import { getStoredSettings } from '@/lib/db'
import { ThemeToggle } from '@/components/theme-toggle'

function GamingLogo() {
  return (
    <Image
      src="/header-logo.png"
      alt="PatchRadar logo"
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
      priority
    />
  )
}

function TopLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted transition hover:text-text"
    >
      {children}
    </Link>
  )
}

const gameIcons: Record<string, React.ReactNode> = {
  PUBG: <Crosshair className="h-3.5 w-3.5" />,
  'GTA 5': <CarFront className="h-3.5 w-3.5" />,
  'Cyberpunk 2077': <Zap className="h-3.5 w-3.5" />,
  'FIFA 25': <Trophy className="h-3.5 w-3.5" />,
  Fortnite: <Castle className="h-3.5 w-3.5" />,
  Valorant: <Shield className="h-3.5 w-3.5" />,
  'Apex Legends': <Gamepad2 className="h-3.5 w-3.5" />,
}

export async function SiteShell({
  children,
  title,
  subtitle,
}: Readonly<{
  children: React.ReactNode
  title?: string
  subtitle?: string
}>) {
  const user = getCurrentUser()
  const settings = getStoredSettings()

  return (
    <main className="pr-theme min-h-screen text-text bg-bg selection:bg-accent/20">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-panel/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5" aria-label={settings.title}>
              <GamingLogo />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              ['Home', '/'],
              ['About', '/about'],
              ['Community', '/community'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <TopLink key={label} href={href}>
                {label}
              </TopLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm font-semibold text-muted hidden sm:inline-block">
                    {user.name}
                  </span>
                  <SignoutButton />
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-semibold text-muted transition hover:text-text px-3 py-1.5 rounded-lg">
                    Sign in
                  </Link>
                  <Link href="/signup" className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_12px_rgba(59,130,246,0.25)] transition-all">
                    Sign up
                  </Link>
                </>
              )}
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-4 py-6 sm:px-6">
        <section className="rounded-2xl border border-border bg-panel/80 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <form action="/" className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-border bg-bg/70 px-4 py-3 transition-all focus-within:border-accent/50 focus-within:shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <Search className="h-4.5 w-4.5 text-muted" />
              <input
                name="q"
                aria-label="Search issues"
                placeholder="Search bugs, fixes, patch notes..."
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
              />
            </form>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted mr-2">Games:</span>
            <Link href="/" className="rounded-lg border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-muted hover:text-text hover:border-accent/40 transition-all">
              #All Games
            </Link>
            {settings.games.map((game) => (
              <Link
                key={game}
                href={`/?game=${encodeURIComponent(game)}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-muted transition-all hover:text-text hover:border-accent/40 hover:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
              >
                {gameIcons[game] ?? <Gamepad2 className="h-3.5 w-3.5" />}
                #{game}
              </Link>
            ))}
          </div>
        </section>

        {title ? (
          <div className="flex flex-col gap-2 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent font-bold">
              <Flame className="h-4 w-4" />
              Player issue hub
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-text sm:text-5xl">{title}</h1>
            {subtitle ? <p className="max-w-4xl text-sm leading-7 text-muted sm:text-base">{subtitle}</p> : null}
          </div>
        ) : null}

        <div className="min-h-[400px] animate-panel">
          {children}
        </div>

        <footer className="mt-12 border-t border-border pt-8 pb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-text">{settings.title}</p>
              <p className="mt-1.5 max-w-2xl text-xs leading-6 text-muted">
                Built for fast search, clear navigation, and long-term gaming issue discovery.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted">
              <Link href="/about" className="hover:text-text transition-colors">About Us</Link>
              <Link href="/privacy-policy" className="hover:text-text transition-colors">Privacy Policy</Link>
              <Link href="/terms-conditions" className="hover:text-text transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-text transition-colors">Contact</Link>
              <Link href="/community" className="hover:text-text transition-colors">Community</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-border/60 pt-6 text-center text-[10px] text-muted">
            &copy; {new Date().getFullYear()} {settings.title}. All rights reserved.
          </div>
        </footer>
      </div>

      <ChatbotButton />
    </main>
  )
}
