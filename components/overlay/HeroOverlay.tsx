'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HERO_STATE } from '@/lib/brainState'

// ─── Animation variants ───────────────────────────────────────────────────────
// Container starts at t≈3.2s on a first-ever visit — the brain's assembly
// easing (see BrainParticles.tsx's bloom curve) is visually settled well
// before the literal 5.3s "assembled" threshold, so text doesn't need to
// wait for that — then staggers each child in at 60ms intervals.
//
// `instant` is true when reduced-motion is requested OR the intro has
// already played once this session (HERO_STATE, module-level so it survives
// this component unmounting/remounting when navigating back to "/" — mirrors
// the persistent SHADER_UNIFORMS.uTime fix that keeps the brain itself from
// replaying its assembly on return visits).

const containerVariants = (instant: boolean) => ({
  hidden: { opacity: instant ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: instant ? 0 : 3.2,
      staggerChildren: instant ? 0 : 0.06,
    },
  },
})

const itemVariants = (instant: boolean) => ({
  hidden: { opacity: instant ? 1 : 0, y: instant ? 0 : 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: instant ? 0 : 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
})

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroOverlay() {
  const prefersReduced = useReducedMotion() ?? false
  const [alreadyPlayed] = useState(() => HERO_STATE.introPlayed)
  const instant = prefersReduced || alreadyPlayed

  useEffect(() => { HERO_STATE.introPlayed = true }, [])

  return (
    <motion.div
      variants={containerVariants(instant)}
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
        variants={itemVariants(instant)}
        style={{
          margin: 0,
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: '#f8fafc',
          textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)',
        }}
      >
        Likhitha Battu
      </motion.h1>

      {/* Discipline */}
      <motion.p
        variants={itemVariants(instant)}
        style={{
          margin: '10px 0 0',
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'clamp(13px, 1.6vw, 18px)',
          fontWeight: 500,
          letterSpacing: '0.01em',
          color: 'rgba(248,250,252,0.80)',
          textShadow: '0 1px 12px rgba(0,0,0,0.8)',
        }}
      >
        Computer Science with a Specialization in Intelligent Systems
      </motion.p>

      {/* Tags */}
      <motion.p
        variants={itemVariants(instant)}
        style={{
          margin: '6px 0 0',
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 'clamp(11px, 1.1vw, 13px)',
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'rgba(158,199,255,0.90)',
          textShadow: '0 1px 12px rgba(0,0,0,0.8)',
        }}
      >
        AI&nbsp;&nbsp;•&nbsp;&nbsp;Computational Drug Discovery&nbsp;&nbsp;•&nbsp;&nbsp;Research
      </motion.p>

      {/* CTA */}
      <motion.button
        variants={itemVariants(instant)}
        style={{
          display: 'block',
          marginTop: '22px',
          padding: '9px 22px',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(248,250,252,0.38)',
          borderRadius: '2px',
          color: 'rgba(248,250,252,0.85)',
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'border-color 0.25s, color 0.25s, background 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(158,199,255,0.75)'
          e.currentTarget.style.color = '#f8fafc'
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(248,250,252,0.38)'
          e.currentTarget.style.color = 'rgba(248,250,252,0.85)'
          e.currentTarget.style.background = 'rgba(0,0,0,0.25)'
        }}
      >
        Explore the Brain
      </motion.button>
    </motion.div>
  )
}
