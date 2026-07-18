interface EmptyStateProps {
  message?: string
  accent?: string
}

export function EmptyState({
  message = 'Content coming soon.',
  accent  = '#8bb8ff',
}: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
      gap: '16px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '32px',
        height: '1px',
        background: `${accent}55`,
      }} />
      <p style={{
        margin: 0,
        fontSize: '12px',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'rgba(248,250,252,0.25)',
      }}>
        {message}
      </p>
      <p style={{
        margin: 0,
        fontSize: '11px',
        color: 'rgba(248,250,252,0.12)',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.06em',
      }}>
        Add entries via <span style={{ color: `${accent}66` }}>/studio</span>
      </p>
    </div>
  )
}
