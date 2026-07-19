'use client'

import { motion } from 'framer-motion'

interface DrawLineProps {
  color: string
}

// A vertical accent line that draws itself in top-to-bottom as it scrolls
// into view — meant to sit to the left of the bio, like a margin annotation
// rather than a static border.
export function DrawLine({ color }: DrawLineProps) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '2px',
        background: color,
        transformOrigin: 'top',
      }}
    />
  )
}
