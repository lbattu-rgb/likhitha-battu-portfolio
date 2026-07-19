'use client'

import { motion } from 'framer-motion'
import { pageFadeIn } from '@/lib/motionVariants'

interface PageIntroProps {
  title: string
  subtitle: string
}

// Shared H1 + mono eyebrow subtitle used at the top of every content page.
// "Section Title" tier of the type scale — fades in with the page on load.
export function PageIntro({ title, subtitle }: PageIntroProps) {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageFadeIn}>
      <h1 style={{
        margin: '0 0 var(--space-sm)',
        fontSize: 'var(--text-section)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        color: 'var(--fg)',
      }}>
        {title}
      </h1>
      <p style={{
        margin: '0 0 var(--space-xl)',
        fontSize: 'var(--text-meta)',
        fontWeight: 500,
        color: 'var(--fg-tertiary)',
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.04em',
      }}>
        {subtitle}
      </p>
    </motion.div>
  )
}
