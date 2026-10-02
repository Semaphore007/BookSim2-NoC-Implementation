import type { Hop, Routing } from '@/lib/noc'
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
        <h3 className="font-serif text-lg font-semibold">Route Preview</h3>
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
                  ? 'This deterministic preview picks the first minimal candidate; live CAMAR requires BookSim credit state.'
                  : 'XY routes the X dimension first, then the Y dimension.'}
            </span>
          </p>
        </>
      )}
      <p className="mt-4 text-xs text-muted-foreground">A route preview is not a cycle-accurate BookSim run.</p>
    </section>
  )
}
