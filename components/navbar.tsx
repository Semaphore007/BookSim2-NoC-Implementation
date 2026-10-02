'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, Cpu, Menu, X } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'
import { links, navItems } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-lg border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow">
            <Cpu className="size-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">
            <span className="text-cyan-glow">NoC</span> Simulation
          </span>
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground',
                  isActive(item.href) ? 'text-cyan-glow' : 'text-muted-foreground',
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-cyan-glow shadow-[0_0_10px_var(--cyan)]" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/manual"
            className="hidden items-center gap-2 rounded-full border border-cyan-glow/50 bg-electric/20 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-electric/35 hover:shadow-[0_0_20px_-4px_var(--electric)] sm:flex"
          >
            <BookOpen className="size-4 text-cyan-glow" aria-hidden="true" />
            Manual
          </Link>
          <a
            href={links.projectGithub}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Project GitHub repository"
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-cyan-glow/50 hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md border border-border xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background xl:hidden">
          <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:grid-cols-2 sm:px-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-md border-l-2 px-3 py-2.5 text-sm',
                    isActive(item.href)
                      ? 'border-cyan-glow bg-cyan-glow/10 text-cyan-glow'
                      : 'border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
