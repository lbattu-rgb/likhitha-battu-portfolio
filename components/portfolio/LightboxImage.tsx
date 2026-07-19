'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lightbox } from '@/components/portfolio/Lightbox'
import { imageReveal } from '@/lib/motionVariants'

interface LightboxImageProps {
  src: string
  alt: string
  style?: React.CSSProperties
  sizes?: string
  /** 'cover' crops to fill the frame (grid thumbnails). 'contain' letterboxes
   *  so the full image is always visible, never cropped (project hero shots,
   *  where cropping can cut off real content). Defaults to 'cover'. */
  fit?: 'cover' | 'contain'
}

// Clickable image with fade+scale load-in, hover zoom within its frame, and
// a full-screen lightbox on click. Used for the project hero and gallery.
export function LightboxImage({ src, alt, style, sizes, fit = 'cover' }: LightboxImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={imageReveal}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open image: ${alt}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--ui-radius-md)',
          border: '1px solid var(--card-border)',
          background: fit === 'contain' ? 'var(--surface)' : undefined,
          cursor: 'zoom-in',
          ...style,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Image src={src} alt={alt} fill sizes={sizes ?? '100vw'} style={{ objectFit: fit }} />
        </motion.div>
      </motion.div>

      {open && <Lightbox image={{ src, alt }} onClose={() => setOpen(false)} />}
    </>
  )
}
