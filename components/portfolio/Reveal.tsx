'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { sectionReveal, imageReveal } from '@/lib/motionVariants'

interface RevealProps {
  children: ReactNode
  style?: CSSProperties
  /** 'section' = fade + slight rise. 'image' = fade + scale 0.97→1. */
  as?: 'section' | 'image'
  /** 'mount' (default) fires once on load — used everywhere today.
   *  'scroll' fires when the element enters the viewport — used on the
   *  About page, which is long enough for that to actually read. */
  trigger?: 'mount' | 'scroll'
}

// Fade-in wrapper for standalone content that isn't part of a StaggerList
// (e.g. the About page's headline/bio sections, project Problem/Solution).
export function Reveal({ children, style, as = 'section', trigger = 'mount' }: RevealProps) {
  const variants = as === 'image' ? imageReveal : sectionReveal

  if (trigger === 'scroll') {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={variants}
        style={style}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} style={style}>
      {children}
    </motion.div>
  )
}
