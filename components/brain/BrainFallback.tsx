'use client'

import Link from 'next/link'
import { BRAIN_REGIONS } from '@/lib/brainRegions'

// Shown instead of the WebGL brain when the visitor's browser can't create a
// WebGL context (hardware acceleration disabled, GPU sandboxed/blocklisted,
// etc.) — same regions, same accent colors, just plain links instead of a
// particle surface.
export default function BrainFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8%',
      }}
    >
      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 220px))',
          gap: '20px 48px',
        }}
      >
        {BRAIN_REGIONS.map((region) => (
          <Link
            key={region.id}
            href={region.route}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, monospace',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: region.color,
                boxShadow: `0 0 6px ${region.color}, 0 0 14px ${region.color}cc`,
                flexShrink: 0,
              }}
            />
            {region.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
