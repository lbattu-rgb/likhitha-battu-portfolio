'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface PageShellProps {
  title: string
  accent: string        // CSS colour, e.g. '#00ff88'
  children: React.ReactNode
}

// Shared chrome for all content pages: top bar with back link + page title,
// scrollable content area below.
export function PageShell({ title, accent, children }: PageShellProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--fg)',
      fontFamily: 'var(--font-inter), system-ui, sans-serif',
    }}>
      {/* ── Fixed top bar ─────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 5vw, 64px)',
        height: '64px',
        background: 'rgba(var(--bg-rgb), 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--card-border)',
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'var(--fg-muted)',
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '8px 4px',
            margin: '-8px -4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-muted)' }}
        >
          <span style={{ fontSize: '14px' }}>←</span>
          <span>Home</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: accent,
            textShadow: `0 0 20px ${accent}66`,
          }}>
            {title}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <main style={{ padding: 'clamp(48px, 7vw, 96px) clamp(20px, 5vw, 64px) clamp(80px, 10vw, 140px)' }}>
        {children}
      </main>
    </div>
  )
}
