import type { Hop, Routing } from '@/lib/noc'
import { DemoBadge } from '@/components/section-title'
import { cn } from '@/lib/utils'

export function RoutingDecision({
  hop,
  destination,
  routing,
}: {
  hop?: Hop
  destination: number
  routing: Routing
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/70 p-5" aria-live="polite">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold">Routing Decision</h3>
        <DemoBadge>Demonstration</DemoBadge>
      </div>

      {!hop ? (
        <p className="text-sm text-muted-foreground">Packet has arrived — no further routing decisions.</p>
      ) : (
        <>
          <dl className="mb-4 grid grid-cols-2 gap-3 font-mono text-sm">
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Current Router</dt>
              <dd className="mt-1 text-cyan-glow">R{hop.from}</dd>
            </div>
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Destination</dt>
              <dd className="mt-1 text-violet-glow">R{destination}</dd>
            </div>
          </dl>

          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Candidate directions</p>
          <ul className="space-y-2">
            {hop.candidates.map((c) => {
              const selected = c.dir === hop.selected
              const pct = Math.round((c.credit / c.maxCredit) * 100)
              return (
                <li
                  key={c.dir}
                  className={cn(
                    'rounded-lg border p-3 text-sm',
                    selected ? 'border-cyan-glow/60 bg-cyan-glow/10' : 'border-border bg-background/40',
                  )}
                >
                  <div className="flex items-center justify-between gap-2 font-mono">
                    <span className={selected ? 'text-cyan-glow' : ''}>
                      {c.dir} → R{c.next}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      credits {c.credit}/{c.maxCredit}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                    <div
                      className={cn('h-full rounded-full', selected ? 'bg-cyan-glow' : 'bg-muted-foreground/50')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>

          <p className="mt-4 text-sm">
            Selected: <span className="font-mono font-semibold text-cyan-glow">{hop.selected}</span>
            <span className="text-muted-foreground">
              {' — '}
              {hop.candidates.length < 2
                ? 'only one minimal direction remains.'
                : routing === 'camar'
                  ? 'CAMAR picks the candidate with more available credit.'
                  : 'XY routes the X dimension first, ignoring congestion.'}
            </span>
          </p>
        </>
      )}
      <p className="mt-4 text-xs text-muted-foreground">Credit values are illustrative, not measured.</p>
    </section>
  )
}
