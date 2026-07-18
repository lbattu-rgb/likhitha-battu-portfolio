import type { Metadata }   from 'next'
import { PageShell }       from '@/components/portfolio/PageShell'
import { PageIntro }       from '@/components/portfolio/PageIntro'
import { AccentLink }      from '@/components/portfolio/AccentLink'
import { TechList }        from '@/components/portfolio/TechTag'
import { EmptyState }      from '@/components/portfolio/EmptyState'
import { getHackathons }   from '@/sanity/lib/fetch'
import type { Hackathon }  from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Hackathons — Likhitha Battu' }

const ACCENT = '#fb923c'

// ─── Hackathon card ───────────────────────────────────────────────────────────

function HackathonCard({ entry }: { entry: Hackathon }) {
  return (
    <article style={{
      padding: '28px 0',
      borderBottom: '1px solid rgba(248,250,252,0.07)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 600, letterSpacing: '-0.01em', color: '#f8fafc' }}>
            {entry.title}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: `${ACCENT}cc` }}>
            {entry.event}{entry.year ? ` · ${entry.year}` : ''}
          </p>
        </div>

        {entry.placement && (
          <span style={{
            flexShrink: 0,
            fontSize: '10px',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: ACCENT,
            border: `1px solid ${ACCENT}55`,
            padding: '3px 9px',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
          }}>
            {entry.placement}
          </span>
        )}
      </div>

      {entry.summary && (
        <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.65, color: 'rgba(248,250,252,0.60)', maxWidth: '72ch' }}>
          {entry.summary}
        </p>
      )}

      {entry.technologies?.length ? (
        <div style={{ marginBottom: entry.links?.length ? '16px' : 0 }}>
          <TechList tags={entry.technologies} accent={ACCENT} />
        </div>
      ) : null}

      {entry.links?.length ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {entry.links.map((link) => (
            <AccentLink key={link._key} href={link.url} accent={ACCENT}>
              → {link.label}
            </AccentLink>
          ))}
        </div>
      ) : null}
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HackathonsPage() {
  const entries = await getHackathons()

  return (
    <PageShell title="Hackathons" accent={ACCENT}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <PageIntro title="Hackathons" subtitle="Rapid prototyping · innovation under pressure" />

        {entries.length === 0 ? (
          <EmptyState message="No hackathon entries yet." accent={ACCENT} />
        ) : (
          <div>
            {entries.map((e) => (
              <HackathonCard key={e._id} entry={e} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
