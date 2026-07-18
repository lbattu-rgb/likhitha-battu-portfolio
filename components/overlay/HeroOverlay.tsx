'use client'

import { motion, useReducedMotion } from 'framer-motion'

// ─── Animation variants ───────────────────────────────────────────────────────
// Container delays until t≈5.5 s (after brain assembly completes),
// then staggers each child in at 150 ms intervals.

const containerVariants = (instant: boolean) => ({
  hidden: { opacity: instant ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: instant ? 0 : 5.5,
      staggerChildren: instant ? 0 : 0.15,
    },
  },
})

const itemVariants = (instant: boolean) => ({
  hidden: { opacity: instant ? 1 : 0, y: instant ? 0 : 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: instant ? 0 : 0.9,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
})

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroOverlay() {
  const prefersReduced = useReducedMotion() ?? false

  return (
    <motion.div
      variants={containerVariants(prefersReduced)}
      initial="hidden"
      animate="visible"
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '8%',
        zIndex: 10,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Name */}
      <motion.h1
        variants={itemVariants(prefersReduced)}
        style={{
          margin: 0,
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: '#f8fafc',
        }}
      >
        Likhitha Battu
      </motion.h1>

      {/* Discipline */}
      <motion.p
        variants={itemVariants(prefersReduced)}
        style={{
          margin: '10px 0 0',
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'clamp(13px, 1.6vw, 18px)',
          fontWeight: 400,
          letterSpacing: '0.01em',
          color: 'rgba(248,250,252,0.55)',
        }}
      >
        Computer Science &amp; Engineering
      </motion.p>

      {/* Tags */}
      <motion.p
        variants={itemVariants(prefersReduced)}
        style={{
          margin: '6px 0 0',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 'clamp(11px, 1.1vw, 13px)',
          fontWeight: 400,
          letterSpacing: '0.06em',
          color: 'rgba(139,184,255,0.70)',
        }}
      >
        AI&nbsp;&nbsp;•&nbsp;&nbsp;Computational Drug Discovery&nbsp;&nbsp;•&nbsp;&nbsp;Research
      </motion.p>

      {/* CTA */}
      <motion.button
        variants={itemVariants(prefersReduced)}
        style={{
          display: 'block',
          marginTop: '22px',
          padding: '9px 22px',
          background: 'transparent',
          border: '1px solid rgba(248,250,252,0.22)',
          borderRadius: '2px',
          color: 'rgba(248,250,252,0.65)',
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'border-color 0.25s, color 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(139,184,255,0.55)'
          e.currentTarget.style.color = 'rgba(248,250,252,0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(248,250,252,0.22)'
          e.currentTarget.style.color = 'rgba(248,250,252,0.65)'
        }}
      >
        Explore the Brain
      </motion.button>
    </motion.div>
  )
}
