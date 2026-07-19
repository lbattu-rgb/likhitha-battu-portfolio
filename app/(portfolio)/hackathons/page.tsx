import type { Metadata }   from 'next'
import { PageShell }       from '@/components/portfolio/PageShell'
import { PageIntro }       from '@/components/portfolio/PageIntro'
import { AccentLink }      from '@/components/portfolio/AccentLink'
import { TechList }        from '@/components/portfolio/TechTag'
import { EmptyState }      from '@/components/portfolio/EmptyState'
import { Card }            from '@/components/portfolio/Card'
import { StaggerList }     from '@/components/portfolio/StaggerList'
import { LightboxImage }   from '@/components/portfolio/LightboxImage'
import MiniBrain           from '@/components/brain/MiniBrain'
import { getHackathons }   from '@/sanity/lib/fetch'
import { urlFor }          from '@/sanity/lib/image'
import type { Hackathon }  from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Hackathons — Likhitha Battu' }

const ACCENT = '#fb923c'

// ─── Hackathon card ───────────────────────────────────────────────────────────

function HackathonCard({ entry }: { entry: Hackathon }) {
  return (
    <Card accent={ACCENT} style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-xs)' }}>
        <div>
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 'var(--text-card)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--fg)',
          }}>
            {entry.title}
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '14px', fontWeight: 500, color: 'var(--fg-secondary)' }}>
            {entry.event}{entry.year ? ` · ${entry.year}` : ''}
          </p>
        </div>

        {entry.placement && (
          <span style={{
            flexShrink: 0,
            fontSize: '11px',
            fontFamily: 'var(--font-geist-mono), monospace',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: ACCENT,
            border: `1px solid ${ACCENT}66`,
            padding: '4px 10px',
            borderRadius: 'var(--ui-radius-sm)',
            whiteSpace: 'nowrap',
          }}>
            {entry.placement}
          </span>
        )}
      </div>

      {entry.summary && (
        <p style={{ margin: '0 0 var(--space-md)', fontSize: '17px', fontWeight: 400, lineHeight: 1.7, color: 'var(--fg-secondary)', maxWidth: '72ch' }}>
          {entry.summary}
        </p>
      )}

      {entry.images?.length ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
        }}>
          {entry.images.map((img, i) => (
            <LightboxImage
              key={img._key ?? i}
              src={urlFor(img).width(500).height(360).fit('crop').url()}
              alt={img.alt ?? `${entry.title} image ${i + 1}`}
              style={{ aspectRatio: '4/3' }}
              sizes="(max-width: 600px) 50vw, 200px"
            />
          ))}
        </div>
      ) : null}

      {entry.technologies?.length ? (
        <div style={{ marginBottom: entry.links?.length ? 'var(--space-md)' : 0 }}>
          <TechList tags={entry.technologies} accent={ACCENT} />
        </div>
      ) : null}

      {entry.links?.length ? (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {entry.links.map((link) => (
            <AccentLink key={link._key} href={link.url} accent={ACCENT}>
              → {link.label}
            </AccentLink>
          ))}
        </div>
      ) : null}
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HackathonsPage() {
  const entries = await getHackathons()

  return (
    <PageShell title="Hackathons" accent={ACCENT}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <PageIntro title="Hackathons" subtitle="Rapid prototyping · innovation under pressure" />

        {entries.length === 0 ? (
          <EmptyState message="No hackathon entries yet." accent={ACCENT} />
        ) : (
          <StaggerList>
            {entries.map((e) => (
              <HackathonCard key={e._id} entry={e} />
            ))}
          </StaggerList>
        )}
      </div>
    </PageShell>
  )
}
