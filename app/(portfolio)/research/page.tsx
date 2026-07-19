import type { Metadata } from 'next'
import { PortableText }  from '@portabletext/react'
import { PageShell }     from '@/components/portfolio/PageShell'
import { PageIntro }     from '@/components/portfolio/PageIntro'
import { AccentLink }    from '@/components/portfolio/AccentLink'
import { TechList }      from '@/components/portfolio/TechTag'
import { EmptyState }    from '@/components/portfolio/EmptyState'
import { StaggerList }   from '@/components/portfolio/StaggerList'
import { StaggerItem }   from '@/components/portfolio/StaggerItem'
import { LightboxImage } from '@/components/portfolio/LightboxImage'
import MiniBrain         from '@/components/brain/MiniBrain'
import { getResearch }   from '@/sanity/lib/fetch'
import { urlFor }        from '@/sanity/lib/image'
import type { ResearchEntry } from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Research — Likhitha Battu' }

const ACCENT = '#00ff88'
const ONGOING_COLOR = '#22d3ee'

// Status lives in the timeline node's color/fill now, not a separate badge —
// one less UI chip, and it reads more like a lab notebook than a dashboard.
const STATUS_COLOR: Record<string, string> = {
  active: ACCENT,
  ongoing: ONGOING_COLOR,
  completed: 'var(--fg-muted)',
}

function yearOf(date?: string) {
  return date ? new Date(date).getFullYear() : null
}

// ─── Timeline entry ─────────────────────────────────────────────────────────────

function TimelineEntry({ entry, isLast }: { entry: ResearchEntry; isLast: boolean }) {
  const startYear = yearOf(entry.startDate)
  const endYear = yearOf(entry.endDate)
  const isOpenEnded = !entry.endDate && entry.status !== 'completed'
  const dateLabel = startYear
    ? isOpenEnded
      ? `${startYear} — Present`
      : endYear && endYear !== startYear ? `${startYear} — ${endYear}` : `${startYear}`
    : null

  const nodeColor = STATUS_COLOR[entry.status ?? 'active'] ?? ACCENT
  const isHollow = entry.status === 'completed'
  const meta = [entry.institution, entry.role].filter(Boolean).join(' · ')

  return (
    <StaggerItem style={{ position: 'relative', paddingLeft: '32px', paddingBottom: isLast ? 0 : 'var(--space-2xl)' }}>
      {/* Connector down to the next node — lives inside this entry so it
          never has to guess the total timeline height. */}
      {!isLast && (
        <span style={{ position: 'absolute', left: '5px', top: '18px', bottom: 0, width: '1px', background: 'var(--card-border)' }} />
      )}
      {/* Node */}
      <span style={{
        position: 'absolute',
        left: '0px',
        top: '5px',
        width: '11px',
        height: '11px',
        borderRadius: '50%',
        background: isHollow ? 'var(--bg)' : nodeColor,
        border: `2px solid ${nodeColor}`,
        boxSizing: 'border-box',
      }} />

      {dateLabel && (
        <div style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'var(--fg-muted)',
          marginBottom: '6px',
        }}>
          {dateLabel}
        </div>
      )}

      <h2 style={{
        margin: '0 0 4px',
        fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
        fontSize: 'var(--text-card)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: 'var(--fg)',
      }}>
        {entry.title}
      </h2>

      {meta && (
        <p style={{ margin: '0 0 var(--space-sm)', fontSize: '14px', color: 'var(--fg-tertiary)' }}>
          {meta}
        </p>
      )}

      {entry.subtitle && (
        <p style={{ margin: '0 0 var(--space-sm)', fontSize: '15px', fontStyle: 'italic', color: 'var(--fg-secondary)' }}>
          {entry.subtitle}
        </p>
      )}

      {/* Narrative — summary as the lead line, body (previously never
          rendered anywhere) as the fuller account underneath. */}
      {entry.summary && (
        <p style={{ margin: '0 0 var(--space-sm)', fontSize: '17px', lineHeight: 1.7, color: 'var(--fg-secondary)', maxWidth: '68ch' }}>
          {entry.summary}
        </p>
      )}
      {entry.body?.length ? (
        <div style={{ margin: '0 0 var(--space-md)', fontSize: '16px', lineHeight: 1.75, color: 'var(--fg-tertiary)', maxWidth: '68ch' }}>
          <PortableText value={entry.body} />
        </div>
      ) : null}

      {/* Supporting artifacts — a filmstrip of figures, not a photo grid */}
      {entry.images?.length ? (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', marginBottom: 'var(--space-md)', paddingBottom: '4px' }}>
          {entry.images.map((img, i) => (
            <figure key={img._key ?? i} style={{ margin: 0, flex: '0 0 auto' }}>
              <LightboxImage
                src={urlFor(img).width(360).height(260).fit('crop').url()}
                alt={img.alt ?? `${entry.title} — figure ${i + 1}`}
                style={{ width: '190px', height: '138px' }}
                sizes="190px"
              />
              {img.caption && (
                <figcaption style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.4, color: 'var(--fg-muted)', fontFamily: 'var(--font-geist-mono), monospace', maxWidth: '190px' }}>
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : null}

      {entry.technologies?.length ? (
        <div style={{ marginBottom: entry.links?.length ? 'var(--space-sm)' : 0 }}>
          <TechList tags={entry.technologies} accent={ACCENT} />
        </div>
      ) : null}

      {entry.links?.length ? (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {entry.links.map((link) => (
            <AccentLink key={link._key} href={link.url} accent={ACCENT} animateBorder>
              → {link.label}
            </AccentLink>
          ))}
        </div>
      ) : null}
    </StaggerItem>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ResearchPage() {
  const entries = await getResearch()

  // Chronological, oldest first — the page reads as an evolving story rather
  // than a curated "best work first" gallery. Undated entries fall to the
  // end rather than breaking the sort.
  const timeline = [...entries].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0
    if (!a.startDate) return 1
    if (!b.startDate) return -1
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  return (
    <PageShell title="Research" accent={ACCENT}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <PageIntro title="Research" subtitle="Computational drug discovery · molecular simulation · AI in science" />

        {timeline.length === 0 ? (
          <EmptyState message="No research entries yet." accent={ACCENT} />
        ) : (
          <StaggerList>
            {timeline.map((entry, i) => (
              <TimelineEntry key={entry._id} entry={entry} isLast={i === timeline.length - 1} />
            ))}
          </StaggerList>
        )}
      </div>
    </PageShell>
  )
}
