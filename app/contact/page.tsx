import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/section-title'
import { GithubIcon, LinkedinIcon, TelegramIcon } from '@/components/icons'
import { links } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Siddharth Gautam, author of the Network-on-Chip Implementation & Simulation project.',
}

const contacts = [
  { icon: GithubIcon, label: 'GitHub', handle: '@Semaphore007', href: links.authorGithub, cta: 'Open GitHub' },
  { icon: LinkedinIcon, label: 'LinkedIn', handle: 'Siddharth Gautam', href: links.linkedin, cta: 'Connect on LinkedIn' },
  { icon: TelegramIcon, label: 'Telegram', handle: '@TheOutlier_2003', href: links.telegram, cta: 'Message on Telegram' },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="08 · Contact" title="Project" highlight="Author"
        description="Questions about the implementation, BookSim setup or results? Reach out on any of the channels below."
      />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <div className="relative rounded-full p-1.5 [background:conic-gradient(from_180deg,var(--cyan),var(--electric),var(--violet),var(--cyan))] shadow-[0_0_60px_-10px_var(--cyan)]">
            <Image
              src="/images/siddharth-gautam.png"
              alt="Portrait of Siddharth Gautam"
              width={288}
              height={288}
              priority
              sizes="(max-width: 640px) 224px, 288px"
              quality={80}
              className="size-56 rounded-full border-4 border-background object-cover sm:size-72"
            />
          </div>
        </div>

        <div className="text-center lg:text-left">
          <h2 className="font-serif text-4xl font-semibold sm:text-5xl">Siddharth Gautam</h2>
          <p className="mt-2 text-lg text-cyan-glow">Computer Science &amp; Engineering</p>
          <p className="mt-1 text-muted-foreground">Project: Network-on-Chip Implementation &amp; Simulation</p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {contacts.map(({ icon: Icon, label, handle, href, cta }) => (
              <li key={label} className="flex flex-col rounded-2xl border border-border bg-card/60 p-5 text-left">
                <Icon className="size-6 text-cyan-glow" aria-hidden="true" />
                <h3 className="mt-3 font-medium">{label}</h3>
                <p className="truncate text-sm text-muted-foreground">{handle}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 rounded-full border border-cyan-glow/50 px-4 py-2 text-center text-sm text-cyan-glow transition hover:bg-cyan-glow/10"
                >
                  {cta}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
