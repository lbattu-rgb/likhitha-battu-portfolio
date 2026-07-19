'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { staggerContainer } from '@/lib/motionVariants'

interface StaggerListProps {
  children: ReactNode
  style?: CSSProperties
  /** 'mount' (default) fires once on load — used everywhere today.
   *  'scroll' fires when the list enters the viewport. */
  trigger?: 'mount' | 'scroll'
}

// Wraps a list of Cards (server-rendered, passed through as children) in a
// client-side stagger container — 0.08s delay between each child's entrance.
export function StaggerList({ children, style, trigger = 'mount' }: StaggerListProps) {
  if (trigger === 'scroll') {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={staggerContainer}
        style={style}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} style={style}>
      {children}
    </motion.div>
  )
}
