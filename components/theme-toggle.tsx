'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  const isDark = !mounted || resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
      title={isDark ? 'Switch to day mode' : 'Switch to night mode'}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-cyan-glow/40 bg-secondary text-secondary-foreground transition-colors hover:border-cyan-glow/70 hover:bg-accent"
    >
      {isDark ? <Sun className="size-4 text-muted-foreground" aria-hidden="true" /> : <Moon className="size-4 text-muted-foreground" aria-hidden="true" />}
      <span className="sr-only">{isDark ? 'Switch to day mode' : 'Switch to night mode'}</span>
    </button>
  )
}
