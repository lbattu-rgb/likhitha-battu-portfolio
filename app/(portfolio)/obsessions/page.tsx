import type { Metadata }    from 'next'
import { PortableText }      from '@portabletext/react'
import { PageShell }         from '@/components/portfolio/PageShell'
import { PageIntro }         from '@/components/portfolio/PageIntro'
import { EmptyState }        from '@/components/portfolio/EmptyState'
import { Card }              from '@/components/portfolio/Card'
import { StaggerList }       from '@/components/portfolio/StaggerList'
import MiniBrain             from '@/components/brain/MiniBrain'
import { ObsessionResourceLink } from '@/components/portfolio/ObsessionResourceLink'
import { getObsessions }     from '@/sanity/lib/fetch'
import type { Obsession }    from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Current Obsessions — Likhitha Battu' }

const ACCENT = '#fb2379'

const GRID_STYLE = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: 'var(--space-md)' }

// ─── Obsession card ───────────────────────────────────────────────────────────

function ObsessionCard({ entry }: { entry: Obsession }) {
  const isActive = !entry.status || entry.status === 'active'

  return (
    <Card
      accent={ACCENT}
      style={{
        padding: 'var(--space-lg)',
        background: isActive ? `${ACCENT}07` : 'var(--surface)',
        opacity: isActive ? 1 : 0.6,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isActive ? ACCENT : 'var(--fg-muted)',
            boxShadow: isActive ? `0 0 8px ${ACCENT}` : 'none',
            flexShrink: 0,
          }} />
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 'var(--text-card)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--fg)',
          }}>
            {entry.topic}
          </h2>
        </div>
        {!isActive && (
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.12em',
            fontWeight: 500,
            color: 'var(--fg-tertiary)',
            border: '1px solid var(--card-border)',
            padding: '3px 9px',
            borderRadius: 'var(--ui-radius-sm)',
          }}>
            ARCHIVED
          </span>
        )}
      </div>

      {/* Why interested */}
      {entry.whyInterested && (
        <p style={{ margin: '0 0 var(--space-sm)', fontSize: '16px', lineHeight: 1.7, color: 'var(--fg-secondary)' }}>
          {entry.whyInterested}
        </p>
      )}

      {/* Portable text notes */}
      {entry.notes?.length ? (
        <div style={{
          margin: '0 0 var(--space-sm)',
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--fg-tertiary)',
          borderLeft: `2px solid ${ACCENT}44`,
          paddingLeft: '14px',
        }}>
          <PortableText value={entry.notes} />
        </div>
      ) : null}

      {/* Resources */}
      {entry.resources?.length ? (
        <div>
          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 500, fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
            Resources
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {entry.resources.map((r) => (
              <ObsessionResourceLink key={r._key} href={r.url} title={r.title} type={r.type} accent={ACCENT} />
            ))}
          </div>
        </div>
      ) : null}
    </Card>
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
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <PageIntro title="Current Obsessions" subtitle="What I can't stop thinking about right now" />

        {entries.length === 0 ? (
          <EmptyState message="No obsessions added yet." accent={ACCENT} />
        ) : (
          <>
            {active.length > 0 && (
              <StaggerList style={{ ...GRID_STYLE, marginBottom: archived.length ? 'var(--space-2xl)' : 0 }}>
                {active.map((e) => <ObsessionCard key={e._id} entry={e} />)}
              </StaggerList>
            )}

            {archived.length > 0 && (
              <>
                <h2 style={{ margin: '0 0 var(--space-md)', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                  Archived
                </h2>
                <StaggerList style={GRID_STYLE}>
                  {archived.map((e) => <ObsessionCard key={e._id} entry={e} />)}
                </StaggerList>
              </>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
