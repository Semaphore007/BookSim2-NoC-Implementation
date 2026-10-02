import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif-display', weight: ['600', '700'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: {
    default: 'NoC Simulation | BookSim 2',
    template: '%s | NoC Simulation',
  },
  description:
    'Interactive Network-on-Chip implementation, simulation and performance analysis project using BookSim 2.',
  generator: 'v0.app',
  authors: [{ name: 'Siddharth Gautam' }],
  openGraph: {
    title: 'NoC Simulation | BookSim 2',
    description:
      'Interactive Network-on-Chip implementation, simulation and performance analysis project using BookSim 2.',
    images: ['/images/noc-banner.png'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#040a18' },
    { media: '(prefers-color-scheme: light)', color: '#f5f8ff' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${serif.variable} ${mono.variable} bg-background`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <BackToTop />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
