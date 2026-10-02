'use client'

import { useEffect, useState } from 'react'

type Segment = { text: string; accent?: boolean; breakAfter?: boolean }

const segments: Segment[] = [
  { text: 'Network-on-Chip ' },
  { text: 'Project', accent: true, breakAfter: true },
  { text: 'Implementation & ' },
  { text: 'Simulation', accent: true },
]

const fullText = segments.map((s) => s.text).join('')
const TYPE_SPEED_MS = 70

function renderSegments(count: number, withCursor: boolean) {
  let remaining = count
  const nodes: React.ReactNode[] = []
  let cursorPlaced = false

  segments.forEach((seg, i) => {
    const visible = seg.text.slice(0, Math.max(0, remaining))
    remaining -= seg.text.length
    const isTypingHere = withCursor && !cursorPlaced && remaining <= 0
    nodes.push(
      <span key={i} className={seg.accent ? 'text-cyan-glow text-glow' : undefined}>
        {visible}
      </span>,
    )
    if (isTypingHere) {
      cursorPlaced = true
      nodes.push(
        <span
          key={`cursor-${i}`}
          className="ml-1 inline-block h-[0.85em] w-[0.08em] translate-y-[0.1em] animate-blink bg-cyan-glow shadow-[0_0_12px_var(--cyan)]"
        />,
      )
    }
    if (seg.breakAfter) nodes.push(<br key={`br-${i}`} />)
  })

  return nodes
}

export function TypingHeadline() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(fullText.length)
      return
    }
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= fullText.length) {
          window.clearInterval(id)
          return c
        }
        return c + 1
      })
    }, TYPE_SPEED_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <h1 className="font-serif text-[clamp(2.25rem,4.4vw,4.5rem)] font-bold leading-[1.08] tracking-tight">
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true" className="grid">
        <span className="invisible col-start-1 row-start-1">{renderSegments(fullText.length, false)}</span>
        <span className="col-start-1 row-start-1">{renderSegments(count, true)}</span>
      </span>
    </h1>
  )
}
