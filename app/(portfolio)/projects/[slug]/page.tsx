import type { Metadata } from 'next'
import { notFound }           from 'next/navigation'
import { PortableText }       from '@portabletext/react'
import { PageShell }          from '@/components/portfolio/PageShell'
import { TechList }           from '@/components/portfolio/TechTag'
import { ProjectLinks }       from '@/components/portfolio/ProjectLinks'
import { LightboxImage }      from '@/components/portfolio/LightboxImage'
import { Reveal }             from '@/components/portfolio/Reveal'
import { BackLink }           from '@/components/portfolio/BackLink'
import MiniBrain              from '@/components/brain/MiniBrain'
import { getProjectBySlug, getProjectSlugs } from '@/sanity/lib/fetch'
import { urlFor }             from '@/sanity/lib/image'

const ACCENT = '#c084fc'

const SECTION_LABEL_STYLE = {
  margin: '0 0 var(--space-sm)',
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: 'var(--font-geist-mono), monospace',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: 'var(--fg-tertiary)',
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project  = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Likhitha Battu`,
    description: project.summary,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project  = await getProjectBySlug(slug)
  if (!project) notFound()

  // No forced height/crop here — the source image's own proportions vary a
  // lot (screenshots, figures, etc.), so we scale width only and let
  // LightboxImage's fit="contain" show the whole thing without cutting
  // anything off.
  const heroImage = project.images?.[0]
    ? urlFor(project.images[0]).width(1400).fit('max').url()
    : null
  const hasLinks = Boolean(project.githubUrl || project.demoUrl)

  return (
    <PageShell title={project.title} accent={ACCENT}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <BackLink href="/projects" label="All Projects" accent={ACCENT} />

        {/* ── 1. Hero: image, title, summary, stack, links ──────────────────── */}
        {heroImage && (
          <LightboxImage
            src={heroImage}
            alt={project.images![0].alt ?? project.title}
            fit="contain"
            sizes="(max-width: 780px) 100vw, 780px"
            style={{ width: '100%', height: 'min(60vh, 520px)', marginBottom: 'var(--space-xl)' }}
          />
        )}

        <h1 style={{
          margin: '0 0 var(--space-sm)',
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'var(--text-section)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--fg)',
        }}>
          {project.title}
        </h1>

        {project.summary && (
          <p style={{ margin: '0 0 var(--space-md)', fontSize: '18px', fontWeight: 400, lineHeight: 1.7, color: 'var(--fg-secondary)' }}>
            {project.summary}
          </p>
        )}

        {project.technologies?.length ? (
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <TechList tags={project.technologies} accent={ACCENT} />
          </div>
        ) : null}

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <ProjectLinks githubUrl={project.githubUrl} demoUrl={project.demoUrl} accent={ACCENT} />
        </div>

        {/* ── 2–3. Problem → Solution ─────────────────────────────────────────── */}
        {(project.problem || project.solution) && (
          <Reveal style={{ display: 'grid', gridTemplateColumns: project.problem && project.solution ? '1fr 1fr' : '1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            {project.problem && (
              <div style={{ padding: 'var(--space-md)', border: '1px solid var(--card-border)', borderRadius: 'var(--ui-radius-md)', background: 'var(--surface)' }}>
                <h2 style={SECTION_LABEL_STYLE}>The Problem</h2>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'var(--fg-secondary)' }}>{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div style={{ padding: 'var(--space-md)', border: `1px solid ${ACCENT}33`, borderRadius: 'var(--ui-radius-md)', background: `${ACCENT}0a` }}>
                <h2 style={{ ...SECTION_LABEL_STYLE, color: `${ACCENT}c0` }}>The Solution</h2>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7, color: 'var(--fg-secondary)' }}>{project.solution}</p>
              </div>
            )}
          </Reveal>
        )}

        {/* ── 4. How it works — the technical deep dive ───────────────────────── */}
        {project.body?.length ? (
          <Reveal style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={SECTION_LABEL_STYLE}>How It Works</h2>
            <div style={{ fontSize: '17px', lineHeight: 1.75, color: 'var(--fg-secondary)' }}>
              <PortableText value={project.body} />
            </div>
          </Reveal>
        ) : null}

        {/* ── 5. Gallery — evidence, not an afterthought ───────────────────────── */}
        {project.images && project.images.length > 1 && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={SECTION_LABEL_STYLE}>Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
              {project.images.slice(1).map((img, i) => {
                const src = urlFor(img).width(600).height(400).fit('crop').url()
                return (
                  <figure key={img._key ?? i} style={{ margin: 0 }}>
                    <LightboxImage
                      src={src}
                      alt={img.alt ?? `${project.title} — image ${i + 2}`}
                      style={{ aspectRatio: '3/2' }}
                      sizes="(max-width: 600px) 100vw, 280px"
                    />
                    {img.caption && (
                      <figcaption style={{ margin: '8px 0 0', fontSize: '12px', lineHeight: 1.5, color: 'var(--fg-muted)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 6. Closing call to action ─────────────────────────────────────────── */}
        {hasLinks && (
          <div style={{ paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--card-border)' }}>
            <p style={{ margin: '0 0 var(--space-sm)', fontSize: '15px', color: 'var(--fg-tertiary)' }}>
              Want to dig deeper?
            </p>
            <ProjectLinks githubUrl={project.githubUrl} demoUrl={project.demoUrl} accent={ACCENT} />
          </div>
        )}
      </div>
    </PageShell>
  )
}
