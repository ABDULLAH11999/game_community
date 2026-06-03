'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({
  label,
  pendingLabel,
  className = '',
}: Readonly<{
  label: string
  pendingLabel: string
  className?: string
}>) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
