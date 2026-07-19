'use client'

import { motion } from 'framer-motion'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { cardItemVariants } from '@/lib/motionVariants'

interface CardProps {
  accent: string
  children: ReactNode
  style?: CSSProperties
}

// Shared card shell — flat surface (no blur), border brightens and the card
// lifts a few pixels on hover. That's the entire interaction; no glow, no
// scale, no color-matched shadow bloom.
// Pair with lib/motionVariants' staggerContainer on the parent list for the
// staggered entrance (this component only declares the child variant).
export function Card({ accent, children, style }: CardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      variants={cardItemVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{
        position: 'relative',
        borderRadius: 'var(--ui-radius-md)',
        border: `1px solid ${hovered ? `${accent}55` : 'var(--card-border)'}`,
        background: 'var(--surface)',
        boxShadow: 'var(--card-shadow)',
        transitionProperty: 'border-color',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'ease',
        ...style,
      }}
    >
      {children}
    </motion.article>
  )
}
