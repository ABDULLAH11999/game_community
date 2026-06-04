'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Determine initial theme
    const activeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    setTheme(activeTheme)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-panel hover:bg-panel-2 hover:border-accent/40 text-muted hover:text-text transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-blue-600" />}
    </button>
  )
}
