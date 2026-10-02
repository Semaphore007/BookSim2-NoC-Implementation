import { cn } from '@/lib/utils'

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  align = 'left',
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={cn('mb-8 max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.25em] text-cyan-glow">{eyebrow}</p>
      )}
      <h2 className="text-balance font-serif text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: {
  eyebrow: string
  title: string
  highlight?: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-circuit">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-electric/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-cyan-glow animate-fade-up">{eyebrow}</p>
        <h1 className="max-w-4xl text-balance font-serif text-4xl font-bold tracking-tight animate-fade-up md:text-6xl">
          {title} {highlight && <span className="text-cyan-glow text-glow">{highlight}</span>}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-up">
          {description}
        </p>
        {children && <div className="mt-8 flex flex-wrap gap-3 animate-fade-up">{children}</div>}
      </div>
    </section>
  )
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-2xl border border-border bg-card/70 p-6', className)}>{children}</div>
}

export function DemoBadge({ children = 'DEMO DATA' }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-amber-glow/50 bg-amber-glow/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-glow">
      {children}
    </span>
  )
}
