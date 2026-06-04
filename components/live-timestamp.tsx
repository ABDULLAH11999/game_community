import { formatLiveTimestamp } from '@/lib/time'

export function LiveTimestamp({
  value,
  label = 'Live',
  className = '',
}: Readonly<{
  value: string
  label?: string
  className?: string
}>) {
  return (
    <span
      className={`badge-light-text inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:border-emerald-500/25 dark:text-emerald-300 dark:shadow-none ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
      </span>
      <span>{label}</span>
      <span className="opacity-60">·</span>
      <span className="normal-case tracking-normal">{formatLiveTimestamp(value)}</span>
    </span>
  )
}