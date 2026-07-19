import type { Metadata }  from 'next'
import { PageShell }      from '@/components/portfolio/PageShell'
import { PageIntro }      from '@/components/portfolio/PageIntro'
import { TechTag }        from '@/components/portfolio/TechTag'
import { EmptyState }     from '@/components/portfolio/EmptyState'
import { StaggerList }    from '@/components/portfolio/StaggerList'
import { StaggerItem }    from '@/components/portfolio/StaggerItem'
import MiniBrain          from '@/components/brain/MiniBrain'
import { getSkills }      from '@/sanity/lib/fetch'
import type { Skill, SkillCategory } from '@/sanity/lib/types'

export const metadata: Metadata = { title: 'Skills — Likhitha Battu' }

const ACCENT = '#22d3ee'

const CATEGORY_ORDER: SkillCategory[] = ['languages', 'frameworks', 'ml-ai', 'scientific', 'tools']

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages:  'Languages',
  frameworks: 'Frameworks & Libraries',
  tools:      'Tools & Platforms',
  'ml-ai':    'ML / AI',
  scientific: 'Scientific Computing',
}

// ─── Category group ───────────────────────────────────────────────────────────

function SkillGroup({ category, skills }: { category: SkillCategory; skills: Skill[] }) {
  return (
    <StaggerItem style={{ marginBottom: 'var(--space-xl)' }}>
      <h2 style={{
        margin: '0 0 var(--space-sm)',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-geist-mono), monospace',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--fg-tertiary)',
      }}>
        {CATEGORY_LABELS[category]}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {skills.map((s) => (
          <TechTag key={s._id} name={s.name} accent={ACCENT} />
        ))}
      </div>
    </StaggerItem>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SkillsPage() {
  const skills = await getSkills()

  const byCategory = new Map<SkillCategory, Skill[]>()
  for (const s of skills) {
    const group = byCategory.get(s.category)
    if (group) group.push(s)
    else byCategory.set(s.category, [s])
  }

  return (
    <PageShell title="Skills" accent={ACCENT}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <MiniBrain accent={ACCENT} />
        </div>

        <PageIntro title="Skills" subtitle="Languages · frameworks · scientific computing" />

        {skills.length === 0 ? (
          <EmptyState message="No skills added yet." accent={ACCENT} />
        ) : (
          <StaggerList>
            {CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => (
              <SkillGroup key={category} category={category} skills={byCategory.get(category)!} />
            ))}
          </StaggerList>
        )}
      </div>
    </PageShell>
  )
}
