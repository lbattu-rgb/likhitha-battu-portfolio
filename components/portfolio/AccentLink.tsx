interface AccentLinkProps {
  href: string
  accent: string
  children: React.ReactNode
  /** Also brighten the underline on hover (research page does this; hackathons page doesn't). */
  animateBorder?: boolean
}

// Shared "→ Label" accent-colored link with hover brighten, used in link lists
// across content pages (research entries, hackathon entries).
export function AccentLink({ href, accent, children, animateBorder = false }: AccentLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        color: `${accent}99`,
        textDecoration: 'none',
        borderBottom: `1px solid ${accent}33`,
        paddingBottom: '1px',
        transition: animateBorder ? 'color 0.2s, border-color 0.2s' : 'color 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.color = accent
        if (animateBorder) el.style.borderColor = `${accent}88`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.color = `${accent}99`
        if (animateBorder) el.style.borderColor = `${accent}33`
      }}
    >
      {children}
    </a>
  )
}
