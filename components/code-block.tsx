'use client'

import { useState } from 'react'
import { Check, Copy, FileCode2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const KEYWORDS =
  'for|each|if|else|return|while|int|void|const|class|struct|include|select|in|and|or|not|def|import|from|git|cd|make'

const TOKEN = new RegExp(
  [
    '(?<comment>//.*$|#(?!include).*$)',
    '(?<string>"[^"]*"|\'[^\']*\')',
    '(?<prompt>^\\$ )',
    '(?<number>\\b\\d+(?:\\.\\d+)?\\b)',
    `(?<keyword>\\b(?:${KEYWORDS})\\b|#include)`,
    '(?<key>\\b[A-Za-z_][\\w]*(?=\\s*=(?!=)))',
    '(?<fn>\\b[A-Za-z_][\\w]*(?=\\())',
  ].join('|'),
  'gm',
)

const tokenClass: Record<string, string> = {
  comment: 'text-[var(--code-comment)] italic',
  string: 'text-[var(--code-string)]',
  prompt: 'text-[var(--code-prompt)] select-none',
  number: 'text-[var(--code-prompt)]',
  keyword: 'text-[var(--code-keyword)]',
  key: 'text-[var(--code-key)]',
  fn: 'text-[var(--code-function)]',
}

export function highlight(code: string) {
  const out: React.ReactNode[] = []
  let last = 0
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) out.push(code.slice(last, index))
    const type = Object.entries(match.groups ?? {}).find(([, v]) => v !== undefined)?.[0] ?? ''
    out.push(
      <span key={index} className={tokenClass[type]}>
        {match[0]}
      </span>,
    )
    last = index + match[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({
  code,
  filename,
  language,
  className,
}: {
  code: string
  filename?: string
  language?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.replace(/^\$ /gm, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <figure className={cn('overflow-hidden rounded-xl border border-border bg-[var(--code-background)]', className)}>
      <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-[var(--code-header)] px-4 py-2">
        <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground">
          <FileCode2 className="size-3.5 shrink-0 text-cyan-glow" aria-hidden="true" />
          <span className="truncate">{filename ?? 'snippet'}</span>
          {language && <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase">{language}</span>}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-cyan-glow" /> : <Copy className="size-3.5" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[var(--code-foreground)]">
        <code>{highlight(code)}</code>
      </pre>
    </figure>
  )
}
