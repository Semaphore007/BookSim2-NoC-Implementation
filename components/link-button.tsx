import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  icon?: React.ReactNode
  download?: boolean
  className?: string
}

export function LinkButton({ href, children, variant = 'primary', icon, download, className }: Props) {
  const external = /^https?:\/\//.test(href)
  const classes = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-glow',
    variant === 'primary'
      ? 'bg-electric text-white shadow-[0_0_24px_-6px_var(--electric)] hover:bg-[#3d7bff] hover:shadow-[0_0_30px_-4px_var(--electric)]'
      : 'border border-cyan-glow/40 bg-background/40 text-foreground hover:border-cyan-glow hover:bg-cyan-glow/10',
    className,
  )
  const Arrow = external ? ArrowUpRight : ArrowRight
  const content = (
    <>
      {icon}
      {children}
      <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} download={download || undefined}>
        {content}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
