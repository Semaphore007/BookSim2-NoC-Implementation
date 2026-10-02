import type { Metadata } from 'next'
import { PageHeader, SectionTitle } from '@/components/section-title'
import { CodeBlock } from '@/components/code-block'
import { LinkButton } from '@/components/link-button'
import { GithubIcon } from '@/components/icons'
import { WarningDisclosure } from '@/components/warning-disclosure'
import { links } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Setup',
  description: 'Clone, build and run BookSim 2, with an explained example configuration.',
}

const steps = [
  { n: '01', title: 'Clone BookSim', code: '$ git clone https://github.com/booksim/booksim2.git' },
  { n: '02', title: 'Enter the source directory', code: '$ cd booksim2/src' },
  { n: '03', title: 'Build the simulator', code: '$ make' },
  { n: '04', title: 'Run an example', code: '$ ./booksim examples/torus88' },
]

const exampleOutput = `====== Overall Traffic Statistics ======
Packet latency average = 20.3 (1 samples)
Network latency average = 20.3 (1 samples)
Flit latency average = 20.3 (1 samples)
Injected packet rate average = 0.150 (1 samples)
Accepted packet rate average = 0.150 (1 samples)
Hops average = 4.06 (1 samples)
Total run time 1.2`

const config = `topology = torus;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
traffic = uniform;
injection_rate = 0.15;`

const params = [
  ['topology', 'torus', 'Network topology (mesh, torus, fly, ...).'],
  ['k', '8', 'Routers per dimension (radix).'],
  ['n', '2', 'Number of dimensions — k=8, n=2 gives an 8×8 network.'],
  ['routing_function', 'dim_order', 'Routing algorithm — dimension-order (XY).'],
  ['num_vcs', '4', 'Virtual channels per physical port.'],
  ['traffic', 'uniform', 'Synthetic traffic pattern.'],
  ['injection_rate', '0.15', 'Offered load in packets/node/cycle.'],
]

export default function SetupPage() {
  return (
    <>
      <PageHeader
        eyebrow="02 · Setup"
        title="Install and run"
        highlight="BookSim 2"
        description="A minimal, Linux-friendly path from cloning the official repository to running your first simulation."
      >
        <LinkButton href={links.booksimGithub}>Official BookSim</LinkButton>
        <LinkButton href={links.booksimManual} variant="outline">
          BookSim Manual
        </LinkButton>
        <LinkButton href={links.projectGithub} variant="outline" icon={<GithubIcon className="size-4" />}>
          Project GitHub
        </LinkButton>
      </PageHeader>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Steps" title="Installation guide" description="Requires g++, make, flex and bison." />
        <ol className="relative space-y-6 border-l border-cyan-glow/30 pl-6">
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <span className="absolute -left-[37px] top-0 flex size-7 items-center justify-center rounded-full border border-cyan-glow bg-background font-mono text-[11px] text-cyan-glow">
                {s.n}
              </span>
              <h3 className="mb-3 font-medium">
                <span className="font-mono text-xs text-cyan-glow">STEP {s.n}</span> — {s.title}
              </h3>
              <CodeBlock code={s.code} filename="terminal" language="bash" />
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-serif text-xl font-semibold">Example output</h3>
            <span className="rounded-full border border-amber-glow/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-glow">
              Example output
            </span>
          </div>
          <CodeBlock code={exampleOutput} filename="booksim — stdout" language="text" />
          <WarningDisclosure title="About the example output" className="mt-3">
            Representative format only. These numbers are illustrative and are not measured project results.
          </WarningDisclosure>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Configuration" title="Example config file" className="mb-6" />
            <CodeBlock code={config} filename="torus88_config" language="booksim" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <caption className="sr-only">Configuration parameters</caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                  <th scope="col" className="py-3 pr-4 font-medium">Parameter</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Value</th>
                  <th scope="col" className="py-3 font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {params.map(([p, v, m]) => (
                  <tr key={p} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-mono text-cyan-glow">{p}</td>
                    <td className="py-3 pr-4 font-mono text-violet-glow">{v}</td>
                    <td className="py-3 text-muted-foreground">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
