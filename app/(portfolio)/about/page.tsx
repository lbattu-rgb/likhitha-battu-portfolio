import type { Metadata }  from 'next'
import { PortableText }    from '@portabletext/react'
import { PageShell }       from '@/components/portfolio/PageShell'
import { PageIntro }       from '@/components/portfolio/PageIntro'
import { AccentLink }      from '@/components/portfolio/AccentLink'
import { TechTag }         from '@/components/portfolio/TechTag'
import { EmptyState }      from '@/components/portfolio/EmptyState'
import { Reveal }          from '@/components/portfolio/Reveal'
import { AboutPhoto }      from '@/components/portfolio/AboutPhoto'
import { WordReveal }      from '@/components/portfolio/WordReveal'
import { DrawLine }        from '@/components/portfolio/DrawLine'
import { StaggerList }     from '@/components/portfolio/StaggerList'
import { PopItem }         from '@/components/portfolio/PopItem'
import MiniBrain           from '@/components/brain/MiniBrain'
import { getAbout }        from '@/sanity/lib/fetch'
import { urlFor }          from '@/sanity/lib/image'

export const metadata: Metadata = { title: 'About — Likhitha Battu' }

const ACCENT = '#f8fafc'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <PageShell title="About" accent={ACCENT}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <PageIntro title="About" subtitle="Background · values · story" />

        {!about ? (
          <EmptyState message="About page content not added yet." accent={ACCENT} />
        ) : (
          <>
            {about.photo && (
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <AboutPhoto
                  src={urlFor(about.photo).width(600).height(600).fit('crop').url()}
                  alt={about.photo.alt ?? 'Likhitha Battu'}
                  accent={ACCENT}
                />
              </div>
            )}

            <h2 style={{
              margin: '0 0 var(--space-xl)',
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 'var(--text-card)',
              fontWeight: 600,
              lineHeight: 1.4,
              color: 'var(--fg-secondary)',
              maxWidth: '52ch',
            }}>
              <WordReveal text={about.headline} />
            </h2>

            {about.bio?.length ? (
              <Reveal trigger="scroll" style={{ position: 'relative', marginBottom: 'var(--space-xl)', paddingLeft: 'var(--space-md)' }}>
                <DrawLine color={`${ACCENT}44`} />
                <div style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--fg-secondary)' }}>
                  <PortableText value={about.bio} />
                </div>
              </Reveal>
            ) : null}

            {about.values?.length ? (
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h3 style={{ margin: '0 0 var(--space-sm)', fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-tertiary)' }}>
                  Values
                </h3>
                <StaggerList trigger="scroll" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {about.values.map((v) => (
                    <PopItem key={v}>
                      <TechTag name={v} accent={ACCENT} />
                    </PopItem>
                  ))}
                </StaggerList>
              </div>
            ) : null}

            {about.links?.length ? (
              <Reveal trigger="scroll" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {about.links.map((link) => (
                  <AccentLink key={link._key} href={link.url} accent={ACCENT} animateBorder>
                    → {link.label}
                  </AccentLink>
                ))}
              </Reveal>
            ) : null}
          </>
        )}
      </div>
    </PageShell>
  )
}
