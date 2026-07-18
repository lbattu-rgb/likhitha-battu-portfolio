'use client'

import Link from 'next/link'

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
      background: '#000000',
      color: '#f8fafc',
      fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
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
        height: '56px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(248,250,252,0.06)',
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'rgba(248,250,252,0.45)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,250,252,0.85)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,250,252,0.45)' }}
        >
          <span style={{ fontSize: '14px' }}>←</span>
          <span>Likhitha Battu</span>
        </Link>

        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent,
          textShadow: `0 0 20px ${accent}66`,
        }}>
          {title}
        </span>
      </header>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <main style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px)' }}>
        {children}
      </main>
    </div>
  )
}
