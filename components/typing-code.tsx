'use client'

import { useEffect, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { highlight } from '@/components/code-block'

export function TypingCode({
  code,
  filename = 'config.booksim',
  speed = 35,
  autoPlay = true,
}: {
  code: string
  filename?: string
  speed?: number
  autoPlay?: boolean
}) {
  const [count, setCount] = useState(0)
  const [playing, setPlaying] = useState(autoPlay)
  const done = count >= code.length

  useEffect(() => {
    if (!playing || done) return
    const id = setTimeout(() => setCount((c) => c + 1), code[count] === '\n' ? speed * 6 : speed)
    return () => clearTimeout(id)
  }, [playing, done, count, code, speed])

  const btn =
    'flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition hover:border-cyan-glow/50 hover:text-foreground disabled:opacity-40'

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#030915] glow-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#071125] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => setPlaying(true)} disabled={playing || done}>
            <Play className="size-3" aria-hidden="true" /> Play
          </button>
          <button type="button" className={btn} onClick={() => setPlaying(false)} disabled={!playing || done}>
            <Pause className="size-3" aria-hidden="true" /> Pause
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => {
              setCount(0)
              setPlaying(true)
            }}
          >
            <RotateCcw className="size-3" aria-hidden="true" /> Restart
          </button>
        </div>
      </div>
      <pre className="min-h-56 overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#dbe6ff]" aria-label={`${filename} contents`}>
        <code>
          {highlight(code.slice(0, count))}
          <span className="ml-px inline-block h-4 w-2 translate-y-0.5 bg-cyan-glow animate-blink" aria-hidden="true" />
        </code>
      </pre>
      <p className="sr-only">{code}</p>
    </div>
  )
}
