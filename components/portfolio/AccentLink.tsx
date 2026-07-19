'use client'

import { motion } from 'framer-motion'
import { buttonTap } from '@/lib/motionVariants'

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
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...buttonTap}
      style={{
        display: 'inline-block',
        fontSize: 'var(--text-meta)',
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: `${accent}b3`,
        textDecoration: 'none',
        borderBottom: `1px solid ${accent}44`,
        paddingBottom: '2px',
        transition: animateBorder ? 'color 0.2s, border-color 0.2s' : 'color 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.color = accent
        if (animateBorder) el.style.borderColor = `${accent}aa`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.color = `${accent}b3`
        if (animateBorder) el.style.borderColor = `${accent}44`
      }}
    >
      {children}
    </motion.a>
  )
}
