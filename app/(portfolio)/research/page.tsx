import type { Metadata } from 'next'
import { PageShell }  from '@/components/portfolio/PageShell'
import { PageIntro }  from '@/components/portfolio/PageIntro'
import { AccentLink } from '@/components/portfolio/AccentLink'
import { TechList }   from '@/components/portfolio/TechTag'
import { EmptyState } from '@/components/portfolio/EmptyState'
import { getResearch } from '@/sanity/lib/fetch'
import type { ResearchEntry } from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Research — Likhitha Battu' }

const ACCENT = '#00ff88'

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: ResearchEntry['status'] }) {
  const map: Record<string, { label: string; color: string }> = {
    active:    { label: 'ACTIVE',     color: ACCENT },
    ongoing:   { label: 'ONGOING',    color: '#22d3ee' },
    completed: { label: 'COMPLETED',  color: 'rgba(248,250,252,0.35)' },
  }
  const { label, color } = map[status ?? 'active'] ?? map['active']
  return (
    <span style={{
      fontSize: '9px',
      fontFamily: 'var(--font-geist-mono), monospace',
      fontWeight: 600,
      letterSpacing: '0.16em',
      color,
      border: `1px solid ${color}55`,
      padding: '2px 7px',
      borderRadius: '2px',
    }}>
      {label}
    </span>
  )
}

// ─── Entry card ───────────────────────────────────────────────────────────────

function ResearchCard({ entry }: { entry: ResearchEntry }) {
  const start = entry.startDate ? new Date(entry.startDate).getFullYear() : null
  const end   = entry.endDate   ? new Date(entry.endDate).getFullYear()   : null
  const dateRange = start
    ? end && end !== start ? `${start}–${end}` : `${start}–Present`
    : null

  return (
    <article style={{
      padding: '28px 0',
      borderBottom: '1px solid rgba(248,250,252,0.07)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 600, letterSpacing: '-0.01em', color: '#f8fafc' }}>
            {entry.title}
          </h2>
          {entry.subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: `${ACCENT}cc`, fontWeight: 500 }}>
              {entry.subtitle}
            </p>
          )}
        </div>
        <StatusBadge status={entry.status} />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {entry.institution && (
          <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.55)', fontFamily: 'var(--font-geist-mono), monospace' }}>
            {entry.institution}
          </span>
        )}
        {entry.role && (
          <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.40)' }}>
            {entry.role}
          </span>
        )}
        {dateRange && (
          <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.30)', fontFamily: 'var(--font-geist-mono), monospace' }}>
            {dateRange}
          </span>
        )}
      </div>

      {/* Summary */}
      {entry.summary && (
        <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.65, color: 'rgba(248,250,252,0.65)', maxWidth: '72ch' }}>
          {entry.summary}
        </p>
      )}

      {/* Technologies */}
      {entry.technologies?.length ? (
        <div style={{ marginBottom: '16px' }}>
          <TechList tags={entry.technologies} accent={ACCENT} />
        </div>
      ) : null}

      {/* Links */}
      {entry.links?.length ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {entry.links.map((link) => (
            <AccentLink key={link._key} href={link.url} accent={ACCENT} animateBorder>
              → {link.label}
            </AccentLink>
          ))}
        </div>
      ) : null}
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ResearchPage() {
  const entries = await getResearch()

  return (
    <PageShell title="Research" accent={ACCENT}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <PageIntro title="Research" subtitle="Computational drug discovery · molecular simulation · AI in science" />

        {entries.length === 0 ? (
          <EmptyState message="No research entries yet." accent={ACCENT} />
        ) : (
          <div>
            {entries.map((entry) => (
              <ResearchCard key={entry._id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
