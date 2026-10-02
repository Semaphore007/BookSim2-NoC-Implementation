import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  ChevronRight,
  Cog,
  Code2,
  FlaskConical,
  LineChart,
  Network,
  Settings2,
  Waypoints,
} from 'lucide-react'
import { SectionTitle } from '@/components/section-title'

const features = [
  {
    icon: BarChart3,
    title: 'Design-Space Exploration',
    text: 'Sweep topology, size, virtual channels and traffic to map the performance envelope.',
    color: 'text-electric bg-electric/15 border-electric/40',
  },
  {
    icon: Network,
    title: 'Target NoC Topology',
    text: 'Implement the target topology in BookSim and compare it with an equivalent mesh.',
    color: 'text-[#34d399] bg-[#34d399]/10 border-[#34d399]/40',
  },
  {
    icon: Cog,
    title: 'Congestion-Aware Routing',
    text: 'CAMAR selects among minimal paths using local credit and congestion information.',
    color: 'text-amber-glow bg-amber-glow/10 border-amber-glow/40',
  },
  {
    icon: LineChart,
    title: 'Performance Analysis',
    text: 'Latency, throughput, injection rate and saturation behaviour across experiments.',
    color: 'text-violet-glow bg-violet-glow/10 border-violet-glow/40',
  },
]

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, color }) => (
          <li
            key={title}
            className="group rounded-2xl border border-border bg-card/60 p-6 transition hover:-translate-y-0.5 hover:border-cyan-glow/40 hover:shadow-[0_0_30px_-12px_var(--cyan)]"
          >
            <span className={`mb-5 flex size-12 items-center justify-center rounded-full border ${color}`}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="font-serif text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

const steps = [
  { icon: BookOpenText, title: 'Study', text: 'NoC concepts & BookSim', href: '/overview' },
  { icon: Settings2, title: 'Configure', text: 'Topology, routing, VCs', href: '/setup' },
  { icon: Code2, title: 'Implement', text: 'Topology & CAMAR code', href: '/implementation' },
  { icon: Waypoints, title: 'Simulate', text: 'Run sweeps & visualize', href: '/simulation' },
  { icon: FlaskConical, title: 'Collect Results', text: 'Latency & throughput', href: '/results' },
  { icon: LineChart, title: 'Analyze', text: 'Saturation & comparison', href: '/results' },
]

export function Workflow() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Quick Workflow"
          title="From study to analysis"
          description="The project follows a straightforward pipeline. Each step links to the page where it is explained."
        />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map(({ icon: Icon, title, text, href }, i) => (
            <li key={title} className="relative">
              <Link
                href={href}
                className="flex h-full flex-col rounded-xl border border-border bg-card/60 p-4 transition hover:border-cyan-glow/50"
              >
                <span className="font-mono text-[11px] text-cyan-glow">{String(i + 1).padStart(2, '0')}</span>
                <Icon className="mt-3 size-5 text-foreground/80" aria-hidden="true" />
                <span className="mt-3 font-medium">{title}</span>
                <span className="mt-1 text-xs text-muted-foreground">{text}</span>
              </Link>
              {i < steps.length - 1 && (
                <ChevronRight
                  className="absolute -right-3 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-cyan-glow lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function HomeCta() {
  const cards = [
    { href: '/manual', title: 'Read the Manual', text: 'Step-by-step technical guide with Viva notes.' },
    { href: '/resources', title: 'Run the Real Simulation', text: 'Compile BookSim 2 with the project configs.' },
    { href: '/contact', title: 'Project Author', text: 'Siddharth Gautam — Computer Science & Engineering.' },
  ]
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6 transition hover:border-cyan-glow/50"
        >
          <span>
            <span className="block font-serif text-lg font-semibold">{c.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{c.text}</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-cyan-glow transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ))}
    </section>
  )
}
