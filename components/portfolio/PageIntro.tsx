interface PageIntroProps {
  title: string
  subtitle: string
}

// Shared H1 + mono eyebrow subtitle used at the top of every content page.
export function PageIntro({ title, subtitle }: PageIntroProps) {
  return (
    <>
      <h1 style={{
        margin: '0 0 8px',
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: '#f8fafc',
      }}>
        {title}
      </h1>
      <p style={{
        margin: '0 0 48px',
        fontSize: '14px',
        color: 'rgba(248,250,252,0.40)',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.04em',
      }}>
        {subtitle}
      </p>
    </>
  )
}
