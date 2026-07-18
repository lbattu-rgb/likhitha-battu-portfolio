import type { Metadata } from 'next'
import { notFound }           from 'next/navigation'
import Image                  from 'next/image'
import { PortableText }       from '@portabletext/react'
import { PageShell }          from '@/components/portfolio/PageShell'
import { TechList }           from '@/components/portfolio/TechTag'
import { getProjectBySlug, getProjectSlugs } from '@/sanity/lib/fetch'
import { urlFor }             from '@/sanity/lib/image'

const ACCENT = '#c084fc'

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

  const heroImage = project.images?.[0]
    ? urlFor(project.images[0]).width(1200).height(630).fit('crop').url()
    : null

  return (
    <PageShell title={project.title} accent={ACCENT}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Hero image */}
        {heroImage && (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(248,250,252,0.08)' }}>
            <Image src={heroImage} alt={project.images![0].alt ?? project.title} fill style={{ objectFit: 'cover' }} />
          </div>
        )}

        {/* Title */}
        <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, letterSpacing: '-0.02em' }}>
          {project.title}
        </h1>

        {/* Summary */}
        {project.summary && (
          <p style={{ margin: '0 0 32px', fontSize: '16px', lineHeight: 1.65, color: 'rgba(248,250,252,0.65)' }}>
            {project.summary}
          </p>
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', color: `${ACCENT}cc`, textDecoration: 'none', border: `1px solid ${ACCENT}44`, padding: '6px 16px', borderRadius: '2px', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = ACCENT; el.style.borderColor = `${ACCENT}88` }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = `${ACCENT}cc`; el.style.borderColor = `${ACCENT}44` }}
            >
              → GitHub
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(248,250,252,0.5)', textDecoration: 'none', border: '1px solid rgba(248,250,252,0.15)', padding: '6px 16px', borderRadius: '2px', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = '#f8fafc'; el.style.borderColor = 'rgba(248,250,252,0.35)' }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = 'rgba(248,250,252,0.5)'; el.style.borderColor = 'rgba(248,250,252,0.15)' }}
            >
              → Live Demo
            </a>
          )}
        </div>

        {/* Problem / Solution */}
        {(project.problem || project.solution) && (
          <div style={{ display: 'grid', gridTemplateColumns: project.problem && project.solution ? '1fr 1fr' : '1fr', gap: '24px', marginBottom: '40px' }}>
            {project.problem && (
              <div style={{ padding: '20px', border: '1px solid rgba(248,250,252,0.07)', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '10px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)' }}>Problem</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: 'rgba(248,250,252,0.6)' }}>{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div style={{ padding: '20px', border: `1px solid ${ACCENT}22`, borderRadius: '4px', background: `${ACCENT}06` }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '10px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: `${ACCENT}88` }}>Solution</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: 'rgba(248,250,252,0.6)' }}>{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        {project.technologies?.length ? (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '10px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)' }}>Stack</h3>
            <TechList tags={project.technologies} accent={ACCENT} />
          </div>
        ) : null}

        {/* Rich text body */}
        {project.body?.length ? (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '10px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)' }}>Details</h3>
            <div style={{ fontSize: '15px', lineHeight: 1.75, color: 'rgba(248,250,252,0.65)' }}>
              <PortableText value={project.body} />
            </div>
          </div>
        ) : null}

        {/* Image gallery (remaining images after hero) */}
        {project.images && project.images.length > 1 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '10px', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)' }}>Gallery</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {project.images.slice(1).map((img, i) => {
                const src = urlFor(img).width(600).height(400).fit('crop').url()
                return (
                  <div key={i} style={{ position: 'relative', aspectRatio: '3/2', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(248,250,252,0.08)' }}>
                    <Image src={src} alt={img.alt ?? `${project.title} image ${i + 2}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
