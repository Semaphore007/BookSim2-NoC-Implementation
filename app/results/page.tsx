import type { Metadata } from 'next'
import { PageHeader, SectionTitle } from '@/components/section-title'
import { ResultsDashboard } from '@/components/results-dashboard'

export const metadata: Metadata = {
  title: 'Results',
  description: 'Research dashboard for latency and throughput versus injection rate, with CSV import for real BookSim results.',
}

const phases = [
  { label: 'Low injection rate', color: 'border-cyan-glow', text: 'Latency is generally lower and close to the zero-load latency of the network.' },
  { label: 'Increasing injection', color: 'border-amber-glow', text: 'Contention and queueing at routers can increase latency gradually.' },
  { label: 'Near saturation', color: 'border-violet-glow', text: 'Latency can increase sharply while accepted throughput may flatten.' },
]

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="05 · Results"
        title="Research"
        highlight="Dashboard"
        description="Latency and throughput against injection rate. Import a CSV produced from your BookSim runs to replace the demo curves."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <ResultsDashboard />
      </section>
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionTitle eyebrow="Interpretation" title="Reading the curves" />
          <ol className="grid gap-4 md:grid-cols-3">
            {phases.map((p, i) => (
              <li key={p.label} className={`rounded-xl border-l-2 bg-card/60 p-5 ${p.color}`}>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-1 font-medium">{p.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-muted-foreground">
            These are general trends. Specific values depend on topology, routing, traffic and configuration and must
            be measured with BookSim.
          </p>
        </div>
      </section>
    </>
  )
}
