import type { Metadata } from 'next'
import { ArrowUpRight, BookOpen, Cloud, Code2, FileDown, Globe, Terminal } from 'lucide-react'
import { PageHeader } from '@/components/section-title'
import { LinkButton } from '@/components/link-button'
import { GithubIcon } from '@/components/icons'
import { WarningDisclosure } from '@/components/warning-disclosure'
import { links } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Project repository, official BookSim 2 sources, manuals and development environments.',
}

const resources = [
  { icon: GithubIcon, title: 'Project GitHub', href: links.projectGithub, text: 'Project implementation, configuration files and simulation resources.' },
  { icon: Code2, title: 'Official BookSim 2', href: links.booksimGithub, text: 'Official BookSim 2 source repository.' },
  { icon: BookOpen, title: 'BookSim 2 Manual', href: links.booksimManual, text: "Official BookSim 2 User's Guide." },
  { icon: Globe, title: 'BookSim Website', href: links.booksimWebsite, text: 'Official BookSim information/resource page.' },
  { icon: FileDown, title: 'Project Manual PDF', href: links.manualPdf, text: 'Step-by-step project manual (Google Drive).' },
  { icon: Terminal, title: 'Online C++ Compiler', href: links.onlineGdb, text: 'Useful for testing small C++ snippets.' },
  { icon: Cloud, title: 'GitHub Codespaces', href: links.codespaces, text: 'Useful for running Linux-based development environments when available.' },
]

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="06 · Resources"
        title="Links and"
        highlight="References"
        description="Everything you need to reproduce the project and run real BookSim simulations."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 rounded-2xl border border-cyan-glow/40 bg-gradient-to-br from-electric/20 via-card to-card p-8 glow-border">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Run the Real Simulation</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            For actual performance measurements, compile and run BookSim 2 using the project configuration files.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={links.projectGithub} icon={<GithubIcon className="size-4" />}>
              Open Project GitHub
            </LinkButton>
            <LinkButton href={links.booksimGithub} variant="outline">
              Open Official BookSim
            </LinkButton>
            <LinkButton href={links.booksimManual} variant="outline">
              Open BookSim Manual
            </LinkButton>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map(({ icon: Icon, title, href, text }) => (
            <li key={title}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 transition hover:-translate-y-0.5 hover:border-cyan-glow/50"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-electric/15 text-cyan-glow">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-cyan-glow" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <span className="mt-4 truncate font-mono text-xs text-muted-foreground/70">{href.replace(/^https?:\/\//, '')}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <WarningDisclosure title="About online development tools" className="mt-6">
          OnlineGDB and Codespaces do not automatically run this BookSim project; they are general development tools.
        </WarningDisclosure>
      </section>
    </>
  )
}
