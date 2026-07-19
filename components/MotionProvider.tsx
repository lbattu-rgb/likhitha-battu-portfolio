'use client'

import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

// Wraps the whole app so every motion.* component automatically respects
// prefers-reduced-motion — Framer strips translate/scale but keeps opacity
// crossfades, which is the recommended reduced-motion behavior (not just
// snapping to zero-duration). The CSS @media rule in globals.css only
// catches CSS transitions/animations, not Framer's JS-driven ones, so this
// is needed separately.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
