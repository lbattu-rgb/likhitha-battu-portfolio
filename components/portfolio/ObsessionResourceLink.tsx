'use client'

import { motion } from 'framer-motion'
import { buttonTap } from '@/lib/motionVariants'

const RESOURCE_ICONS: Record<string, string> = {
  paper:   '📄',
  article: '📰',
  video:   '▶',
  repo:    '⌥',
  other:   '→',
}

interface ObsessionResourceLinkProps {
  href: string
  title: string
  type: string
  accent: string
}

export function ObsessionResourceLink({ href, title, type, accent }: ObsessionResourceLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...buttonTap}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 2px',
        margin: '-4px -2px',
        fontSize: 'var(--text-meta)',
        fontWeight: 500,
        color: `${accent}c0`,
        textDecoration: 'none',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = accent }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = `${accent}c0` }}
    >
      <span style={{ fontSize: '11px', opacity: 0.8 }}>{RESOURCE_ICONS[type] ?? '→'}</span>
      <span>{title}</span>
    </motion.a>
  )
}
