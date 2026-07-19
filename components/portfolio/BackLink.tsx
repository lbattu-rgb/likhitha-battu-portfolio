'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { buttonTap } from '@/lib/motionVariants'

interface BackLinkProps {
  href: string
  label: string
  accent: string
}

// Clear way back to a section's listing page from a detail page (e.g.
// "← All Projects" from a single project). The header's "Likhitha Battu"
// link (PageShell) always goes home — this is specifically for retracing
// one level up, not all the way out.
export function BackLink({ href, label, accent }: BackLinkProps) {
  return (
    <motion.div {...buttonTap} style={{ display: 'inline-block', marginBottom: 'var(--space-lg)' }}>
      <Link
        href={href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'var(--text-meta)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: `${accent}b3`,
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = accent }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = `${accent}b3` }}
      >
        <span aria-hidden="true">←</span>
        <span>{label}</span>
      </Link>
    </motion.div>
  )
}
