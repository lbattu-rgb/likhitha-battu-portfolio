import type { Variants } from 'framer-motion'

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Page load: fade in + 20px upward offset, 0.6s.
export const pageFadeIn: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

// Wraps a list of Cards (or any staggered children) — 0.08s stagger delay.
export const staggerContainer: Variants = {
  hidden:  { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

// Individual card entrance — pairs with staggerContainer on the parent.
export const cardItemVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
}

// Section reveal on scroll — fade + slight upward motion.
export const sectionReveal: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
}

// Image fade + scale-up from 0.97 → 1.
export const imageReveal: Variants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
}

// Shared button/link gesture motion — hover 1.03, tap 0.97.
export const buttonTap = {
  whileHover: { scale: 1.03 },
  whileTap:   { scale: 0.97 },
}

// Individual "pop" entrance — spring scale-up, for tags/chips that should
// feel like they're landing one at a time rather than fading in as a block.
export const tagPop: Variants = {
  hidden:  { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
}
