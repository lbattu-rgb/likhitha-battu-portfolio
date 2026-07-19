'use client'

import { motion, type Variants } from 'framer-motion'
import type { CSSProperties } from 'react'

interface WordRevealProps {
  text: string
  style?: CSSProperties
}

const container: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.045 } },
}

const word: Variants = {
  hidden:  { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// Splits text into words and reveals them one at a time (fade + rise +
// unblur) as the element scrolls into view — a heavier, more considered
// entrance than a plain fade, reserved for the one headline on this page.
export function WordReveal({ text, style }: WordRevealProps) {
  const words = text.split(' ')

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={container}
      style={{ display: 'inline', ...style }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} style={{ display: 'inline-block', marginRight: '0.28em' }}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  )
}
