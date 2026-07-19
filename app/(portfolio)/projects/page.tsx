import type { Metadata } from 'next'
import { PageShell }    from '@/components/portfolio/PageShell'
import { PageIntro }    from '@/components/portfolio/PageIntro'
import { EmptyState }   from '@/components/portfolio/EmptyState'
import { ProjectCard }  from '@/components/portfolio/ProjectCard'
import { StaggerList }  from '@/components/portfolio/StaggerList'
import MiniBrain        from '@/components/brain/MiniBrain'
import { getProjects }  from '@/sanity/lib/fetch'

export const metadata: Metadata = { title: 'Projects — Likhitha Battu' }

const ACCENT = '#c084fc'

// Cycled per non-featured project so the index doesn't read as a uniform
// template grid — real content still drives which project is large (the
// `featured` flag in Sanity), this just varies the rest.
const ASPECT_RATIOS = ['4/3', '3/2', '16/10']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectsPage() {
  const projects = await getProjects()
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <PageShell title="Projects" accent={ACCENT}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <PageIntro title="Projects" subtitle="Engineering · systems · software" />

        {projects.length === 0 ? (
          <EmptyState message="No projects yet." accent={ACCENT} />
        ) : (
          <StaggerList>
            {featured.map((p) => (
              <div key={p._id} style={{ marginBottom: rest.length ? 'var(--space-2xl)' : 0 }}>
                <ProjectCard project={p} aspectRatio="21/9" large />
              </div>
            ))}

            {rest.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-xl) var(--space-lg)',
              }}>
                {rest.map((p, i) => (
                  <ProjectCard key={p._id} project={p} aspectRatio={ASPECT_RATIOS[i % ASPECT_RATIOS.length]} />
                ))}
              </div>
            )}
          </StaggerList>
        )}
      </div>
    </PageShell>
  )
}
