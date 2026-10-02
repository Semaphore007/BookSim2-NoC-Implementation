'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ManualSidebar({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -60% 0px' },
    )
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label="Manual sections" className="lg:sticky lg:top-24">
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {items.map((item, i) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition',
                active === item.id
                  ? 'border-cyan-glow/50 bg-cyan-glow/10 text-cyan-glow'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
