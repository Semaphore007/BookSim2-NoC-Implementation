import type { Metadata } from 'next'
import { Activity, Boxes, Cable, Cpu, GitBranch, Layers, Package, Route, Split } from 'lucide-react'
import { PageHeader, Panel, SectionTitle } from '@/components/section-title'
import { LinkButton } from '@/components/link-button'
import { TopologyDiagram } from '@/components/topology-diagram'
import { links } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Overview',
  description: 'What Network-on-Chip is, what BookSim 2 does, and the objectives of this project.',
}

const concepts = [
  { icon: Cpu, term: 'Processing nodes', text: 'Cores or IP blocks that inject and eject traffic.' },
  { icon: Boxes, term: 'Routers', text: 'Switch flits between input and output ports each cycle.' },
  { icon: Cable, term: 'Links', text: 'Point-to-point channels connecting neighbouring routers.' },
  { icon: Package, term: 'Packets', text: 'Messages exchanged between nodes, split into flits.' },
  { icon: Layers, term: 'Flits', text: 'Flow-control units — the smallest unit a router buffers.' },
  { icon: Route, term: 'Routing', text: 'The function that picks the output port for each packet.' },
  { icon: Split, term: 'Virtual Channels', text: 'Multiple logical buffers per port to avoid blocking and deadlock.' },
  { icon: Activity, term: 'Traffic', text: 'Synthetic patterns like uniform, transpose or hotspot.' },
]

const tasks = [
  {
    n: 'Task 1',
    title: 'Design-Space Exploration',
    text: 'Sweep mesh/torus, network size, virtual channels and traffic patterns from low load to saturation.',
  },
  {
    n: 'Task 2',
    title: 'Target NoC Topology',
    text: 'Implement the target topology in BookSim and compare it with an equivalent mesh of the same node count.',
  },
  {
    n: 'Task 3',
    title: 'Congestion-Aware Routing',
    text: 'Implement CAMAR — credit-aware minimal adaptive routing — and evaluate it against dimension-order routing.',
  },
]

const metrics = ['Latency', 'Throughput', 'Injection Rate', 'Saturation', 'Hop Count', 'Link Utilization']

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="01 · Project Overview"
        title="Understanding the"
        highlight="Network-on-Chip"
        description="A compact introduction to on-chip interconnects, the BookSim 2 simulator and the three tasks this project covers."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Fundamentals"
          title="What is Network-on-Chip?"
          description="A NoC replaces shared buses with a packet-switched network of routers and links, letting many cores communicate in parallel with scalable bandwidth."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {concepts.map(({ icon: Icon, term, text }) => (
            <li key={term} className="rounded-xl border border-border bg-card/60 p-5">
              <Icon className="size-5 text-cyan-glow" aria-hidden="true" />
              <h3 className="mt-3 font-medium">{term}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <TopologyDiagram kind="mesh" />
          <TopologyDiagram kind="torus" />
          <TopologyDiagram kind="butterfly" />
          <TopologyDiagram kind="fattree" />
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Simulator" title="What is BookSim 2?" className="mb-6" />
            <p className="leading-relaxed text-muted-foreground">
              BookSim 2 is a cycle-accurate interconnection-network simulator. It supports configurable network
              topologies, routing functions, traffic patterns, virtual channels and simulation parameters, and reports
              statistics such as packet latency and accepted throughput.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href={links.booksimGithub}>Official BookSim</LinkButton>
              <LinkButton href={links.booksimManual} variant="outline">
                BookSim Manual
              </LinkButton>
            </div>
          </div>
          <Panel className="font-mono text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-cyan-glow">Simulation inputs → outputs</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <ul className="space-y-2 text-muted-foreground">
                <li>topology</li>
                <li>routing_function</li>
                <li>traffic</li>
                <li>num_vcs</li>
                <li>injection_rate</li>
              </ul>
              <GitBranch className="size-6 text-amber-glow" aria-hidden="true" />
              <ul className="space-y-2">
                <li>packet latency</li>
                <li>network latency</li>
                <li>accepted throughput</li>
                <li>hop count</li>
                <li>saturation</li>
              </ul>
            </div>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Objectives" title="Three project tasks" />
        <ol className="grid gap-4 md:grid-cols-3">
          {tasks.map((t) => (
            <li key={t.n} className="rounded-2xl border border-border bg-card/60 p-6">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-glow">{t.n}</span>
              <h3 className="mt-2 font-serif text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 mb-4 font-serif text-xl font-semibold">Evaluation metrics</h3>
        <ul className="flex flex-wrap gap-2">
          {metrics.map((m) => (
            <li key={m} className="rounded-full border border-cyan-glow/30 bg-cyan-glow/5 px-4 py-1.5 text-sm">
              {m}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
