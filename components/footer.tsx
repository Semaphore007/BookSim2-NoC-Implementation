import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { links } from '@/lib/site'

const projectLinks = [
  { href: '/overview', label: 'Overview' },
  { href: '/setup', label: 'Setup' },
  { href: '/implementation', label: 'Implementation' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/results', label: 'Results' },
  { href: '/manual', label: 'Manual' },
]

const resourceLinks = [
  { href: links.booksimGithub, label: 'BookSim' },
  { href: links.projectGithub, label: 'GitHub' },
  { href: links.manualPdf, label: 'Manual (PDF)' },
  { href: '/resources', label: 'Online Tools', internal: true },
]

const contactLinks = [
  { href: links.authorGithub, label: 'GitHub' },
  { href: links.linkedin, label: 'LinkedIn' },
  { href: links.telegram, label: 'Telegram' },
]

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: { href: string; label: string; internal?: boolean }[]
}) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow">{title}</h2>
      <ul className="space-y-2.5">
        {items.map((item) => {
          const internal = item.internal || item.href.startsWith('/')
          return (
            <li key={item.label}>
              {internal ? (
                <Link href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Cpu className="size-5 text-cyan-glow" aria-hidden="true" />
            <span className="font-serif text-lg font-semibold">
              <span className="text-cyan-glow">NoC</span> Simulation
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Implementation, simulation and performance analysis of Network-on-Chip architectures with BookSim 2.
          </p>
        </div>
        <FooterColumn title="Project" items={projectLinks} />
        <FooterColumn title="Resources" items={resourceLinks} />
        <FooterColumn title="Contact" items={[...contactLinks, { href: '/contact', label: 'Author', internal: true }]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Siddharth Gautam</p>
          <p>Network-on-Chip Project — BookSim 2</p>
        </div>
      </div>
    </footer>
  )
}
