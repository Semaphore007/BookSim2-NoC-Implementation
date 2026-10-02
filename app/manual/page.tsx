import type { Metadata } from 'next'
import { Download, FileText } from 'lucide-react'
import { PageHeader } from '@/components/section-title'
import { ManualSidebar } from '@/components/manual-sidebar'
import { CodeBlock } from '@/components/code-block'
import { TopologyDiagram } from '@/components/topology-diagram'
import { LinkButton } from '@/components/link-button'
import { links } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Manual',
  description: 'Interactive web version of the BookSim 2 NoC project manual, with PDF download.',
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'setup', label: 'Setup' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'task-1', label: 'Task 1' },
  { id: 'task-2', label: 'Task 2' },
  { id: 'task-3', label: 'Task 3' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'results', label: 'Results' },
]

function Section({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border pb-12 last:border-0">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">{String(n).padStart(2, '0')}</p>
      <h2 className="mt-1 mb-4 font-serif text-2xl font-semibold sm:text-3xl">{title}</h2>
      <div className="space-y-4 leading-relaxed text-muted-foreground [&_strong]:text-foreground">{children}</div>
    </section>
  )
}

export default function ManualPage() {
  return (
    <>
      <PageHeader
        eyebrow="07 · Manual"
        title="Project"
        highlight="Manual"
        description="An interactive web version of the project manual. The full PDF is available on Google Drive."
      >
        <LinkButton href={links.manualPdf} icon={<FileText className="size-4" />}>
          Open PDF Manual
        </LinkButton>
        <LinkButton href={links.manualPdfDownload} variant="outline" icon={<Download className="size-4" />}>
          Download PDF
        </LinkButton>
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr]">
        <ManualSidebar items={sections} />

        <article className="min-w-0 space-y-12">
          <Section id="overview" n={1} title="Overview">
            <p>
              This project uses <strong>BookSim 2</strong>, a cycle-accurate NoC simulator, to explore network design
              choices, implement a target topology and evaluate a congestion-aware routing algorithm.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Task 1 — design-space exploration of mesh and torus networks</li>
              <li>Task 2 — target NoC topology vs. an equivalent mesh</li>
              <li>Task 3 — CAMAR congestion-aware routing</li>
            </ul>
          </Section>

          <Section id="setup" n={2} title="Setup">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Install g++, make, flex and bison on Linux (or use a Linux container).</li>
              <li>Clone the official BookSim 2 repository.</li>
              <li>Build in the <code className="font-mono text-cyan-glow">src</code> directory.</li>
              <li>Run an example configuration.</li>
            </ol>
            <CodeBlock
              filename="terminal"
              language="bash"
              code={`$ git clone https://github.com/booksim/booksim2.git
$ cd booksim2/src
$ make
$ ./booksim examples/torus88`}
            />
          </Section>

          <Section id="configuration" n={3} title="Configuration">
            <p>A BookSim config is a list of key = value; pairs. The most important keys are:</p>
            <CodeBlock
              filename="example.cfg"
              language="booksim"
              code={`topology = torus;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
traffic = uniform;
injection_rate = 0.15;`}
            />
            <p>Parameters can also be overridden on the command line, e.g. <code className="font-mono text-cyan-glow">injection_rate=0.2</code>.</p>
          </Section>

          <Section id="task-1" n={4} title="Task 1 — Design-Space Exploration">
            <ul className="list-disc space-y-1 pl-5">
              <li>Topologies: mesh, torus · sizes 4×4, 6×6, 8×8</li>
              <li>Virtual channels: 1, 2, 4, 8</li>
              <li>Traffic: uniform, transpose, bit complement, bit reverse, hotspot</li>
              <li>Sweep injection rate from low load to saturation</li>
            </ul>
            <div className="grid max-w-md grid-cols-2 gap-4">
              <TopologyDiagram kind="mesh" />
              <TopologyDiagram kind="torus" />
            </div>
          </Section>

          <Section id="task-2" n={5} title="Task 2 — Target NoC Topology">
            <p>
              The selected topology is implemented in BookSim and compared against an equivalent mesh with the same
              number of nodes, using uniform traffic plus two structured/non-uniform patterns.
            </p>
            <p>Compare hop count, path diversity, link utilization, latency and throughput.</p>
          </Section>

          <Section id="task-3" n={6} title="Task 3 — CAMAR">
            <p>
              CAMAR generates valid minimal paths and uses local credit/congestion information to select a less
              congested candidate, within BookSim&apos;s buffered virtual-channel architecture.
            </p>
            <CodeBlock
              filename="camar — pseudo-code"
              language="text"
              code={`for each minimal candidate:
    read congestion / credit state
    evaluate candidate

select valid candidate
with lower congestion`}
            />
          </Section>

          <Section id="simulation" n={7} title="Simulation">
            <p>Automate sweeps with a small shell loop and save each log for parsing.</p>
            <CodeBlock
              filename="sweep.sh"
              language="bash"
              code={`for rate in 0.02 0.05 0.10 0.15 0.20 0.25 0.30; do
  ./booksim my.cfg injection_rate=$rate > logs/run_$rate.log
done`}
            />
          </Section>

          <Section id="results" n={8} title="Results">
            <ol className="list-decimal space-y-1 pl-5">
              <li>Extract packet latency and accepted rate from each log.</li>
              <li>Write a CSV: injection_rate, latency, throughput.</li>
              <li>Plot latency and throughput vs. injection rate.</li>
              <li>Identify the saturation point and compare configurations.</li>
            </ol>
            <p>You can upload that CSV on the Results page to plot it in the browser.</p>
          </Section>

        </article>
      </div>
    </>
  )
}
