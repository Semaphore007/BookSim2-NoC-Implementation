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
const lastSegmentEnd = segments.reduce((length, segment) => length + segment.text.length, 0)
const TYPE_SPEED_MS = 70
const FULL_TEXT_PAUSE_TICKS = 14
const EMPTY_TEXT_PAUSE_TICKS = 4

function renderSegments(count: number, withCursor: boolean) {
  let offset = 0
  const nodes: React.ReactNode[] = []
  let cursorPlaced = false

  segments.forEach((seg, i) => {
    const start = offset
    const end = start + seg.text.length
    const visibleCount = Math.min(Math.max(count - start, 0), seg.text.length)
    offset = end
    nodes.push(
      <span key={i} className={seg.accent ? 'text-cyan-glow text-glow' : undefined}>
        {seg.text.slice(0, visibleCount)}
      </span>,
    )
    if (withCursor && !cursorPlaced && count >= start && count < end) {
      cursorPlaced = true
      nodes.push(
        <span
          key={`cursor-${i}`}
          className="ml-1 inline-block h-[0.85em] w-[0.08em] translate-y-[0.1em] animate-blink bg-cyan-glow shadow-[0_0_12px_var(--cyan)]"
        />,
      )
    }
    if (withCursor && !cursorPlaced && i === segments.length - 1 && count >= end) {
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
    let direction: 1 | -1 = 1
    let currentCount = 0
    let pauseTicks = 0
    const id = window.setInterval(() => {
      if (pauseTicks > 0) {
        pauseTicks -= 1
        return
      }
      if (currentCount === lastSegmentEnd && direction === 1) {
        direction = -1
        pauseTicks = FULL_TEXT_PAUSE_TICKS
        return
      }
      if (currentCount === 0 && direction === -1) {
        direction = 1
        pauseTicks = EMPTY_TEXT_PAUSE_TICKS
        return
      }
      currentCount += direction
      setCount(currentCount)
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
