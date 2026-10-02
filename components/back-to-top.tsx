'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Back on Top"
      title="Back on Top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-cyan-glow/60 bg-card/90 p-3 text-sm font-medium text-foreground shadow-[0_0_22px_-6px_var(--cyan)] backdrop-blur transition-all duration-300 hover:bg-secondary sm:px-4 sm:py-2.5',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="size-4 text-cyan-glow" aria-hidden="true" />
      <span className="hidden sm:inline">Back on Top</span>
    </button>
  )
}
