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
  tone?: 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'yellow'
}>) {
  const tones = {
    violet:
      'border-black/20 bg-violet-500/15 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-violet-500/25 dark:text-violet-300 dark:shadow-none',
    blue:
      'border-black/20 bg-blue-500/15 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-blue-500/25 dark:text-blue-300 dark:shadow-none',
    emerald:
      'border-black/20 bg-emerald-500/15 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-emerald-400/60 dark:bg-emerald-400/25 dark:text-emerald-100 dark:shadow-[0_0_0_1px_rgba(74,222,128,0.18)]',
    rose:
      'border-black/20 bg-rose-500/15 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-rose-400/60 dark:bg-rose-400/25 dark:text-rose-100 dark:shadow-[0_0_0_1px_rgba(251,113,133,0.18)]',
    amber:
      'border-black/20 bg-amber-500/15 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-amber-400/60 dark:bg-amber-400/25 dark:text-amber-100 dark:shadow-[0_0_0_1px_rgba(251,191,36,0.18)]',
    yellow:
      'border-black/20 bg-yellow-500/15 text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:border-yellow-400/60 dark:bg-yellow-400/25 dark:text-yellow-100 dark:shadow-[0_0_0_1px_rgba(250,204,21,0.18)]',
  }

  return (
    <span className={`badge-light-text inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${tones[tone]}`}>
      {label}
    </span>
  )
}
