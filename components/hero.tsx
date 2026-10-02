import { Play } from 'lucide-react'
import { HeroNetwork } from '@/components/hero-network'
import { LinkButton } from '@/components/link-button'
import { TypingHeadline } from '@/components/typing-headline'
import { GithubIcon } from '@/components/icons'
import { links } from '@/lib/site'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-circuit">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-electric/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-violet-glow/15 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12 lg:px-8">
        <div className="min-w-0 animate-fade-up">
          <TypingHeadline />

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-glow" />
            <span className="size-1.5 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan)]" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-glow" />
          </div>

          <p className="font-serif text-2xl text-foreground/90">Multicore Systems Architecture</p>

          <p className="mt-5 inline-flex rounded-full border border-cyan-glow/40 bg-electric/15 px-5 py-2 font-serif text-base font-semibold sm:text-lg">
            BookSim 2 Cycle-Accurate NoC Simulator
          </p>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A practical implementation and simulation environment for exploring NoC topologies, routing algorithms,
            traffic patterns, latency, throughput and saturation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/simulation" icon={<Play className="size-4 fill-current" aria-hidden="true" />}>
              Explore Simulation
            </LinkButton>
            <LinkButton href={links.projectGithub} variant="outline" icon={<GithubIcon className="size-4" />}>
              View on GitHub
            </LinkButton>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-panel/80 p-5 glow-border lg:max-w-[520px]">
          <HeroNetwork />
        </div>
      </div>
    </section>
  )
}
