import Image from 'next/image'
import Link from 'next/link'
import { CarFront, Castle, Crosshair, Gamepad2, Search, Shield, Trophy, Zap } from 'lucide-react'
import { ChatbotButton } from '@/components/chatbot-button'
import { SignoutButton } from '@/components/auth/signout-button'
import { getCurrentUser } from '@/lib/auth'
import { getStoredSettings } from '@/lib/db'
import { ThemeToggle } from '@/components/theme-toggle'

function GamingLogo() {
  return (
    <Image
      src="/header-logo.png"
      alt="LivePatch logo"
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
      priority
    />
  )
}

function FireMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="fire-mark-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4d2d" />
          <stop offset="52%" stopColor="#ff8a00" />
          <stop offset="100%" stopColor="#ffd84d" />
        </linearGradient>
      </defs>
      <path
        d="M13.5 2.5c.4 2.1 1.7 3.6 3 5 1.4 1.5 2.9 3.1 2.9 5.8 0 4-3.2 7.2-7.4 7.2S4.5 17.7 4.5 13.6c0-2.3 1-4.2 2.6-5.8.4 1.8 1.2 3.1 2.1 4.1.8.9 1.7 1.7 1.7 3.1 0 1.2-.8 2.1-1.8 2.5.4.2.9.3 1.4.3 2.1 0 3.8-1.6 3.8-3.9 0-1.7-.9-2.9-1.8-4.2-1-1.4-2.1-2.9-1.5-5.1Z"
        fill="url(#fire-mark-gradient)"
        stroke="#c73a00"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
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
  title?: React.ReactNode
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
                  <Link href="/signup" className="rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_12px_rgba(96,165,250,0.22)] transition-all">
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
                className={`inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-muted transition-all hover:text-text hover:border-accent/40 hover:shadow-[0_0_10px_rgba(59,130,246,0.1)] ${
                  settings.games.indexOf(game) < 5
                    ? ''
                    : settings.games.indexOf(game) < 7
                      ? 'hidden sm:inline-flex'
                      : 'hidden'
                }`}
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
              <FireMark />
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
