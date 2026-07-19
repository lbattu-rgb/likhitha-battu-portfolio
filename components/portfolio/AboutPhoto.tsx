'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface AboutPhotoProps {
  src: string
  alt: string
  accent: string
}

// A bigger, livelier treatment for the one personal photo on the site — a
// soft pulsing halo in the page's accent color (the same quiet-breathing
// motif as the mini brain above it), plus a gentle hover lift. Everything
// else on the site is fairly restrained by design; this is the one place
// meant to feel warm and a little more alive, since it's the About page.
export function AboutPhoto({ src, alt, accent }: AboutPhotoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', width: '300px', height: '300px', maxWidth: '70vw' }}
    >
      {/* Soft halo — same breathing rhythm as the mini brain's accent pulse */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '-22px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}35 0%, transparent 72%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        whileHover={{ scale: 1.035 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `1px solid ${accent}44`,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
        }}
      >
        <Image src={src} alt={alt} fill sizes="300px" style={{ objectFit: 'cover' }} priority />
      </motion.div>
    </motion.div>
  )
}
