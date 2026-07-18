import type { Metadata }    from 'next'
import { PortableText }      from '@portabletext/react'
import { PageShell }         from '@/components/portfolio/PageShell'
import { PageIntro }         from '@/components/portfolio/PageIntro'
import { EmptyState }        from '@/components/portfolio/EmptyState'
import { getObsessions }     from '@/sanity/lib/fetch'
import type { Obsession }    from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Current Obsessions — Likhitha Battu' }

const ACCENT = '#fb2379'

const RESOURCE_ICONS: Record<string, string> = {
  paper:   '📄',
  article: '📰',
  video:   '▶',
  repo:    '⌥',
  other:   '→',
}

// ─── Obsession card ───────────────────────────────────────────────────────────

function ObsessionCard({ entry }: { entry: Obsession }) {
  const isActive = !entry.status || entry.status === 'active'

  return (
    <article style={{
      padding: '28px',
      border: `1px solid ${isActive ? `${ACCENT}22` : 'rgba(248,250,252,0.06)'}`,
      borderRadius: '4px',
      background: isActive ? `${ACCENT}05` : 'transparent',
      opacity: isActive ? 1 : 0.5,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isActive ? ACCENT : 'rgba(248,250,252,0.25)',
            boxShadow: isActive ? `0 0 8px ${ACCENT}` : 'none',
            flexShrink: 0,
          }} />
          <h2 style={{ margin: 0, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 600, letterSpacing: '-0.01em', color: '#f8fafc' }}>
            {entry.topic}
          </h2>
        </div>
        {!isActive && (
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.14em',
            color: 'rgba(248,250,252,0.25)',
            border: '1px solid rgba(248,250,252,0.1)',
            padding: '2px 7px',
            borderRadius: '2px',
          }}>
            ARCHIVED
          </span>
        )}
      </div>

      {/* Why interested */}
      {entry.whyInterested && (
        <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.65, color: 'rgba(248,250,252,0.60)' }}>
          {entry.whyInterested}
        </p>
      )}

      {/* Portable text notes */}
      {entry.notes?.length ? (
        <div style={{
          margin: '0 0 16px',
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'rgba(248,250,252,0.45)',
          borderLeft: `2px solid ${ACCENT}33`,
          paddingLeft: '14px',
        }}>
          <PortableText value={entry.notes} />
        </div>
      ) : null}

      {/* Resources */}
      {entry.resources?.length ? (
        <div>
          <p style={{ margin: '0 0 10px', fontSize: '10px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.25)' }}>
            Resources
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {entry.resources.map((r) => (
              <a
                key={r._key}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: `${ACCENT}aa`,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = ACCENT }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = `${ACCENT}aa` }}
              >
                <span style={{ fontSize: '10px', opacity: 0.7 }}>{RESOURCE_ICONS[r.type] ?? '→'}</span>
                <span>{r.title}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ObsessionsPage() {
  const entries = await getObsessions()
  const active   = entries.filter((e) => !e.status || e.status === 'active')
  const archived = entries.filter((e) => e.status === 'archived')

  return (
    <PageShell title="Current Obsessions" accent={ACCENT}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <PageIntro title="Current Obsessions" subtitle="What I can't stop thinking about right now" />

        {entries.length === 0 ? (
          <EmptyState message="No obsessions added yet." accent={ACCENT} />
        ) : (
          <>
            {active.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '16px', marginBottom: archived.length ? '48px' : 0 }}>
                {active.map((e) => <ObsessionCard key={e._id} entry={e} />)}
              </div>
            )}

            {archived.length > 0 && (
              <>
                <h2 style={{ margin: '0 0 20px', fontSize: '11px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.20)' }}>
                  Archived
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '16px' }}>
                  {archived.map((e) => <ObsessionCard key={e._id} entry={e} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
