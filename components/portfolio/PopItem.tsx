'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { tagPop } from '@/lib/motionVariants'

// Wraps a single tag/chip so it springs in individually — pair with a
// StaggerList trigger="scroll" parent for a "landing one at a time" feel,
// instead of the whole group fading in as one block.
export function PopItem({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={tagPop} style={{ display: 'inline-flex' }}>
      {children}
    </motion.div>
  )
}
