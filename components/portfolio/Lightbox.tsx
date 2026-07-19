'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface LightboxProps {
  image: { src: string; alt: string }
  onClose: () => void
}

export function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={image.alt}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(20px, 6vw, 64px)',
          cursor: 'zoom-out',
        }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', width: '100%', maxWidth: '1100px', height: '80vh', cursor: 'default' }}
        >
          <Image src={image.src} alt={image.alt} fill sizes="100vw" style={{ objectFit: 'contain' }} />
        </motion.div>

        <button
          onClick={onClose}
          aria-label="Close image"
          style={{
            position: 'absolute',
            top: 'clamp(16px, 3vw, 32px)',
            right: 'clamp(16px, 3vw, 32px)',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--ui-radius-sm)',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.06)',
            color: '#f8fafc',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
