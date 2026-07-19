import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { MotionProvider } from '@/components/MotionProvider'
import './globals.css'

// Runs before paint so there's no flash of the wrong theme. Sets data-theme
// on <html> from localStorage, falling back to OS preference. Dark (no
// attribute) is the default — see the [data-theme="light"] block in
// globals.css and components/theme/ThemeToggle.tsx for the toggle itself.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) {}
})();
`

// Heading font. Note: Space Grotesk's heaviest Google Fonts weight is 700
// (no 800 exists) — used wherever the design calls for weight 800.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

// Body font.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Likhitha Battu',
  description:
    'Computer Science & Engineering — AI, Computational Drug Discovery, Research Computing.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
