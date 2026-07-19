'use client'

import { motion } from 'framer-motion'
import Link  from 'next/link'
import Image from 'next/image'
import { TechList } from '@/components/portfolio/TechTag'
import { cardItemVariants } from '@/lib/motionVariants'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/sanity/lib/types'

const ACCENT = '#c084fc'

interface ProjectCardProps {
  project: Project
  /** CSS aspect-ratio for the hero image frame — varies per position so the
   *  index doesn't read as a template grid (e.g. '16/9', '4/3', '3/2'). */
  aspectRatio: string
  /** Spotlight treatment for the one project marked `featured` in Sanity —
   *  real data driving the size variation, not an arbitrary choice. */
  large?: boolean
}

// Image-led entry for the project index — no card border/box. The screenshot
// is the primary anchor; title/summary/tags are captions underneath it.
export function ProjectCard({ project, aspectRatio, large = false }: ProjectCardProps) {
  const slug = project.slug.current
  const heroImage = project.images?.[0]
    ? urlFor(project.images[0]).width(large ? 1400 : 900).fit('max').url()
    : null

  return (
    <motion.article variants={cardItemVariants}>
      <Link href={`/projects/${slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          borderRadius: 'var(--ui-radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--card-border)',
          background: 'var(--surface)',
          marginBottom: 'var(--space-sm)',
        }}>
          {heroImage ? (
            <motion.div
              whileHover={{ scale: 1.045 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={heroImage}
                alt={project.title}
                fill
                sizes={large ? '(max-width: 900px) 100vw, 900px' : '(max-width: 600px) 100vw, 420px'}
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-muted)', fontSize: '13px',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}>
              No image yet
            </div>
          )}
        </div>
      </Link>

      <Link href={`/projects/${slug}`} style={{ textDecoration: 'none' }}>
        <h2 style={{
          margin: '0 0 6px',
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: large ? 'var(--text-section)' : 'var(--text-card)',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--fg)',
        }}>
          {project.title}
        </h2>
      </Link>

      {project.summary && (
        <p style={{
          margin: '0 0 var(--space-sm)',
          fontSize: large ? '17px' : '15px',
          lineHeight: 1.65,
          color: 'var(--fg-secondary)',
          maxWidth: large ? '65ch' : '46ch',
        }}>
          {project.summary}
        </p>
      )}

      {project.technologies?.length ? (
        <TechList tags={project.technologies} accent={ACCENT} />
      ) : null}
    </motion.article>
  )
}
