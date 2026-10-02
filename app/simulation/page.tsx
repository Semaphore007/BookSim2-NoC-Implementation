import type { Metadata } from 'next'
import { AlertTriangle, ArrowDown, Code2 } from 'lucide-react'
import { PageHeader, SectionTitle } from '@/components/section-title'
import { SimulationLab } from '@/components/simulation/simulation-lab'
import { CodeBlock } from '@/components/code-block'
import { LinkButton } from '@/components/link-button'

export const metadata: Metadata = {
  title: 'Simulation Lab',
  description: 'Interactive NoC visualization of XY and CAMAR routing, plus the three project tasks.',
}

const matrix = [
  ['Topology', ['Mesh', 'Torus']],
  ['Sizes', ['4×4', '6×6', '8×8']],
  ['Virtual Channels', ['1', '2', '4', '8']],
  ['Traffic', ['Uniform Random', 'Transpose', 'Bit Complement', 'Bit Reverse', 'Hotspot']],
  ['Injection Rate', ['low → saturation']],
  ['Metrics', ['Avg. Packet Latency', 'Throughput', 'Injection Rate', 'Saturation Throughput']],
] as const

const comparison = [
  ['Topology', 'Equivalent 2D Mesh', 'Target NoC Topology'],
  ['Node Count', 'N', 'N (same)'],
  ['Connectivity', 'Up to 4 neighbours per router', 'Defined by target design'],
  ['Average Hop Count', 'Measured in BookSim', 'Measured in BookSim'],
  ['Path Diversity', 'Multiple minimal paths', 'Depends on topology structure'],
  ['Link Utilization', 'Measured in BookSim', 'Measured in BookSim'],
  ['Latency', 'Measured vs. injection rate', 'Measured vs. injection rate'],
  ['Throughput', 'Measured vs. injection rate', 'Measured vs. injection rate'],
]

const camarFlow = ['Current Router', 'Find Minimal Candidates', 'Read Credit State', 'Compare', 'Select Route', 'Forward']

const pseudo = `for each minimal candidate:
    read congestion / credit state
    evaluate candidate

select valid candidate
with lower congestion`

export default function SimulationPage() {
  return (
    <>
      <PageHeader
        eyebrow="04 · Simulation Lab"
        title="Interactive NoC"
        highlight="Simulation Lab"
        description="Configure a network, pick a routing algorithm and watch a packet traverse the routers hop by hop."
      />

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div
          role="note"
          className="mb-6 flex gap-3 rounded-xl border border-amber-glow/40 bg-amber-glow/5 p-4 text-sm leading-relaxed"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-glow" aria-hidden="true" />
          <p>
            The route animation is a deterministic preview, not a cycle-accurate BookSim run. Import a BookSim CSV in
            the configuration panel to see measured values or interpolations between measurements. Without matching
            dataset rows, performance estimates are not shown.
          </p>
        </div>
        <SimulationLab />
      </section>

      <section id="task-1" className="scroll-mt-24 border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionTitle
            eyebrow="Task 1"
            title="Design-Space Exploration"
            description="Import BookSim measurements in the simulator to view dataset-backed latency and throughput estimates for matching configurations."
          />
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matrix.map(([label, values]) => (
              <div key={label} className="rounded-xl border border-border bg-card/60 p-5">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {values.map((v) => (
                    <span key={v} className="rounded-md border border-cyan-glow/30 bg-cyan-glow/5 px-2.5 py-1 font-mono text-xs">
                      {v}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="task-2" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Task 2"
          title="Target NoC Topology"
          description="The selected topology is implemented in BookSim and compared against an equivalent Mesh with the same number of nodes, under uniform traffic plus two structured / non-uniform patterns."
        />
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/60">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Comparison criteria between mesh and target topology</caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-medium">Criterion</th>
                <th scope="col" className="px-5 py-3 font-medium">Mesh</th>
                <th scope="col" className="px-5 py-3 font-medium text-cyan-glow">Target NoC Topology</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([c, a, b]) => (
                <tr key={c} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-5 py-3 font-medium">{c}</th>
                  <td className="px-5 py-3 text-muted-foreground">{a}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <LinkButton href="/implementation" icon={<Code2 className="size-4" />}>
            Open Implementation
          </LinkButton>
        </div>
      </section>

      <section id="task-3" className="scroll-mt-24 border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Task 3"
              title="CAMAR — Credit-Aware Minimal Adaptive Routing"
              description="CAMAR generates valid minimal paths and uses local credit/congestion information to select a less congested candidate."
              className="mb-6"
            />
            <p className="mb-6 rounded-xl border border-violet-glow/40 bg-violet-glow/5 p-4 text-sm leading-relaxed">
              CAMAR is a BookSim-compatible congestion-aware adaptive routing approach within the simulator&apos;s
              buffered/virtual-channel architecture. It is not bufferless deflection routing.
            </p>
            <CodeBlock code={pseudo} filename="camar — pseudo-code" language="text" />
          </div>
          <ol className="flex flex-col items-center gap-1" aria-label="CAMAR decision flow">
            {camarFlow.map((step, i) => (
              <li key={step} className="flex w-full max-w-sm flex-col items-center">
                <div className="w-full rounded-xl border border-cyan-glow/40 bg-card/70 px-5 py-3 text-center">
                  <span className="mr-2 font-mono text-xs text-cyan-glow">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </div>
                {i < camarFlow.length - 1 && <ArrowDown className="my-1 size-4 text-amber-glow" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
