'use client'

import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { cardItemVariants } from '@/lib/motionVariants'

interface StaggerItemProps {
  children: ReactNode
  style?: CSSProperties
}

// Plain fade/rise entrance that participates in a parent StaggerList — for
// content that isn't a Card (e.g. skill category groups).
export function StaggerItem({ children, style }: StaggerItemProps) {
  return (
    <motion.div variants={cardItemVariants} style={style}>
      {children}
    </motion.div>
  )
}
