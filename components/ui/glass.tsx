import type { ReactNode } from 'react'

export function GlassPanel({
  children,
  className = '',
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <section
      className={`rounded-2xl border border-border bg-panel text-text p-6 shadow-[0_18px_40px_rgba(15,30,60,0.12)] transition-all duration-350 hover:border-accent/20 ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  detail,
}: Readonly<{
  eyebrow: string
  title: string
  detail?: string
}>) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent">{eyebrow}</p>
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-text sm:text-3xl">{title}</h2>
      {detail ? <p className="max-w-2xl text-xs leading-6 text-muted">{detail}</p> : null}
    </div>
  )
}

export function StatusBadge({
  label,
  tone = 'violet',
}: Readonly<{
  label: string
  tone?: 'violet' | 'blue' | 'emerald' | 'rose' | 'amber'
}>) {
  const tones = {
    violet: 'border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-300',
    blue: 'border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-300',
    emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    rose: 'border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300',
    amber: 'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300',
  }

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${tones[tone]}`}>{label}</span>
}
