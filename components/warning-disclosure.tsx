'use client'

import { useId, useState } from 'react'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WarningDisclosure({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('rounded-xl border border-amber-glow/40 bg-amber-glow/5', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition hover:bg-amber-glow/10 focus-visible:outline-2 focus-visible:outline-cyan-glow"
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="size-4 shrink-0 text-amber-glow" aria-hidden="true" />
          {title}
        </span>
        <ChevronDown className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div id={id} role="note" className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  )
}
