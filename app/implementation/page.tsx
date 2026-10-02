import type { Metadata } from 'next'
import { Folder, FileText } from 'lucide-react'
import { PageHeader, Panel, SectionTitle } from '@/components/section-title'
import { CodeBlock } from '@/components/code-block'
import { TypingCode } from '@/components/typing-code'
import { LinkButton } from '@/components/link-button'
import { GithubIcon } from '@/components/icons'
import { links } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Implementation',
  description: 'How the BookSim 2 NoC project is organised: configuration, topology, routing, simulation and results.',
}

const tree: { name: string; depth: number; dir?: boolean; note?: string }[] = [
  { name: 'BookSim2-NoC-Implementation', depth: 0, dir: true },
  { name: 'configs/', depth: 1, dir: true, note: 'BookSim configuration files' },
  { name: 'mesh_*.cfg / torus_*.cfg', depth: 2, note: 'Task 1 sweeps' },
  { name: 'target_topology.cfg', depth: 2, note: 'Task 2' },
  { name: 'camar.cfg', depth: 2, note: 'Task 3' },
  { name: 'src/', depth: 1, dir: true, note: 'BookSim source with extensions' },
  { name: 'networks/', depth: 2, dir: true, note: 'topology implementation' },
  { name: 'routefunc.cpp', depth: 2, note: 'routing functions incl. CAMAR' },
  { name: 'scripts/', depth: 1, dir: true, note: 'sweep & parsing helpers' },
  { name: 'results/', depth: 1, dir: true, note: 'CSV output & plots' },
  { name: 'README.md', depth: 1 },
]

const sections = [
  {
    title: '1. Configuration',
    text: 'Each experiment is a plain-text BookSim config. Only the parameters under study change between runs.',
    filename: 'configs/mesh_8x8.cfg',
    language: 'booksim',
    code: `// Task 1 — baseline mesh
topology = mesh;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
vc_buf_size = 8;
traffic = transpose;
injection_rate = 0.10;
sim_type = latency;`,
  },
  {
    title: '2. Topology',
    text: 'The target topology is registered in BookSim’s network factory so it can be selected from a config file.',
    filename: 'src/networks/network.cpp (excerpt)',
    language: 'cpp',
    code: `} else if ( topo == "target" ) {
  TargetTopology::RegisterRoutingFunctions();
  n = new TargetTopology( config, name );
} else if ( topo == "mesh" ) {
  KNCube::RegisterRoutingFunctions();
  n = new KNCube( config, name, true );
}`,
  },
  {
    title: '3. Routing',
    text: 'CAMAR gathers minimal output ports, then picks the one with more downstream credits.',
    filename: 'src/routefunc.cpp (sketch)',
    language: 'cpp',
    code: `void camar_mesh( const Router *r, const Flit *f, int in_channel,
                 OutputSet *outputs, bool inject )
{
  int best = -1, best_credit = -1;
  for ( int port : minimal_ports( r, f->dest ) ) {
    int credit = r->GetUsedCredit( port );  // lower used => more free
    if ( best < 0 || credit < best_credit ) { best = port; best_credit = credit; }
  }
  outputs->AddRange( best, vc_start, vc_end );
}`,
  },
  {
    title: '4. Simulation',
    text: 'A shell loop sweeps injection rate from low load toward saturation.',
    filename: 'scripts/sweep.sh',
    language: 'bash',
    code: `for rate in 0.02 0.05 0.10 0.15 0.20 0.25 0.30; do
  ./booksim configs/mesh_8x8.cfg injection_rate=$rate \\
    > results/mesh_8x8_$rate.log
done`,
  },
  {
    title: '5. Results',
    text: 'Logs are parsed into a CSV with injection rate, latency and throughput for plotting.',
    filename: 'results/mesh_8x8.csv',
    language: 'csv',
    code: `injection_rate,latency,throughput
0.02,<value>,<value>
0.05,<value>,<value>
0.10,<value>,<value>`,
  },
]

const typingConfig = `topology = mesh;
k = 8;
n = 2;
routing_function = dim_order;
num_vcs = 4;
traffic = uniform;
injection_rate = 0.10;`

export default function ImplementationPage() {
  return (
    <>
      <PageHeader
        eyebrow="03 · Implementation"
        title="How the project is"
        highlight="organised"
        description="Repository layout and the key code paths for configuration, topology, routing, simulation and results."
      >
        <LinkButton href={links.projectGithub} icon={<GithubIcon className="size-4" />}>
          Project Repository
        </LinkButton>
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionTitle
            eyebrow="Repository"
            title="Project structure"
            description="Indicative layout of the project repository. See GitHub for the exact files."
            className="mb-6"
          />
          <Panel className="overflow-x-auto font-mono text-sm">
            <ul className="space-y-1.5" aria-label="Repository tree">
              {tree.map((n) => (
                <li key={n.name} className="flex items-center gap-2 whitespace-nowrap" style={{ paddingLeft: n.depth * 20 }}>
                  {n.dir ? (
                    <Folder className="size-4 shrink-0 text-amber-glow" aria-hidden="true" />
                  ) : (
                    <FileText className="size-4 shrink-0 text-cyan-glow" aria-hidden="true" />
                  )}
                  <span>{n.name}</span>
                  {n.note && <span className="text-xs text-muted-foreground">— {n.note}</span>}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div>
          <SectionTitle
            eyebrow="Live demo"
            title="Typing a configuration"
            description="A lightweight typed preview of a BookSim config — play, pause or restart."
            className="mb-6"
          />
          <TypingCode code={typingConfig} filename="configs/mesh_uniform.cfg" />
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6">
          {sections.map((s) => (
            <article key={s.title} className="grid gap-5 md:grid-cols-[0.8fr_1.4fr]">
              <div>
                <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
              <CodeBlock code={s.code} filename={s.filename} language={s.language} />
            </article>
          ))}
          <p className="text-xs text-muted-foreground">
            Code snippets are simplified sketches to explain the structure. Refer to the repository for the actual
            implementation.
          </p>
        </div>
      </section>
    </>
  )
}
