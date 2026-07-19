'use client'

import { motion } from 'framer-motion'
import { buttonTap } from '@/lib/motionVariants'

interface ProjectLinksProps {
  githubUrl?: string
  demoUrl?: string
  accent: string
}

export function ProjectLinks({ githubUrl, demoUrl, accent }: ProjectLinksProps) {
  if (!githubUrl && !demoUrl) return null

  return (
    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
      {githubUrl && (
        <motion.a href={githubUrl} target="_blank" rel="noopener noreferrer"
          {...buttonTap}
          style={{ fontSize: 'var(--text-meta)', fontWeight: 500, letterSpacing: '0.04em', color: `${accent}dd`, textDecoration: 'none', border: `1px solid ${accent}55`, padding: '9px 20px', borderRadius: 'var(--ui-radius-sm)', transition: 'border-color 0.2s, color 0.2s' }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = accent; el.style.borderColor = `${accent}99` }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = `${accent}dd`; el.style.borderColor = `${accent}55` }}
        >
          → GitHub
        </motion.a>
      )}
      {demoUrl && (
        <motion.a href={demoUrl} target="_blank" rel="noopener noreferrer"
          {...buttonTap}
          style={{ fontSize: 'var(--text-meta)', fontWeight: 500, letterSpacing: '0.04em', color: 'var(--fg-secondary)', textDecoration: 'none', border: '1px solid var(--card-border)', padding: '9px 20px', borderRadius: 'var(--ui-radius-sm)', transition: 'border-color 0.2s, color 0.2s' }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = 'var(--fg)'; el.style.borderColor = 'var(--card-border-hover)' }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = 'var(--fg-secondary)'; el.style.borderColor = 'var(--card-border)' }}
        >
          → Live Demo
        </motion.a>
      )}
    </div>
  )
}
