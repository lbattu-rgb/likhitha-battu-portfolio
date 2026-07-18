import type { Metadata } from 'next'
import Link              from 'next/link'
import { PageShell }    from '@/components/portfolio/PageShell'
import { PageIntro }    from '@/components/portfolio/PageIntro'
import { TechList }     from '@/components/portfolio/TechTag'
import { EmptyState }   from '@/components/portfolio/EmptyState'
import { getProjects }  from '@/sanity/lib/fetch'
import type { Project } from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Projects — Likhitha Battu' }

const ACCENT = '#c084fc'

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const slug = project.slug.current

  return (
    <article style={{
      position: 'relative',
      padding: '24px',
      border: '1px solid rgba(248,250,252,0.07)',
      borderRadius: '4px',
      background: 'rgba(248,250,252,0.02)',
      transition: 'border-color 0.25s, background 0.25s',
    }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${ACCENT}33`
        el.style.background  = `${ACCENT}08`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(248,250,252,0.07)'
        el.style.background  = 'rgba(248,250,252,0.02)'
      }}
    >
      {project.featured && (
        <span style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          fontSize: '9px',
          fontFamily: 'var(--font-geist-mono), monospace',
          letterSpacing: '0.14em',
          color: `${ACCENT}99`,
          border: `1px solid ${ACCENT}33`,
          padding: '2px 6px',
          borderRadius: '2px',
        }}>
          FEATURED
        </span>
      )}

      <h2 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', color: '#f8fafc' }}>
        {project.title}
      </h2>

      {project.summary && (
        <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: 'rgba(248,250,252,0.55)', maxWidth: '60ch' }}>
          {project.summary}
        </p>
      )}

      {project.technologies?.length ? (
        <div style={{ marginBottom: '20px' }}>
          <TechList tags={project.technologies} accent={ACCENT} />
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          href={`/projects/${slug}`}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: ACCENT,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          Details →
        </Link>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none', letterSpacing: '0.06em' }}
          >
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none', letterSpacing: '0.06em' }}
          >
            Live Demo
          </a>
        )}
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <PageShell title="Projects" accent={ACCENT}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <PageIntro title="Projects" subtitle="Engineering · systems · software" />

        {projects.length === 0 ? (
          <EmptyState message="No projects yet." accent={ACCENT} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
            gap: '20px',
          }}>
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
