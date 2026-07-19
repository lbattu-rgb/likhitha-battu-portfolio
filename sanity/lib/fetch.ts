import { unstable_cache } from 'next/cache'
import { client }         from './client'
import {
  RESEARCH_QUERY,
  PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  HACKATHONS_QUERY,
  OBSESSIONS_QUERY,
  SKILLS_QUERY,
  ABOUT_QUERY,
} from './queries'
import type { ResearchEntry, Project, Hackathon, Obsession, Skill, About } from './types'

// Re-validate every 5 minutes. On-demand revalidation can be triggered via
// the /api/revalidate route using Sanity webhooks (see that file for setup).
const REVALIDATE = 300

export const getResearch = unstable_cache(
  () => client.fetch<ResearchEntry[]>(RESEARCH_QUERY),
  ['research'],
  { revalidate: REVALIDATE, tags: ['research'] },
)

export const getProjects = unstable_cache(
  () => client.fetch<Project[]>(PROJECTS_QUERY),
  ['projects'],
  { revalidate: REVALIDATE, tags: ['projects'] },
)

export const getProjectSlugs = unstable_cache(
  () => client.fetch<Array<{ slug: string }>>(PROJECT_SLUGS_QUERY),
  ['project-slugs'],
  { revalidate: REVALIDATE, tags: ['projects'] },
)

export const getProjectBySlug = unstable_cache(
  (slug: string) => client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug }),
  ['project-by-slug'],
  { revalidate: REVALIDATE, tags: ['projects'] },
)

export const getHackathons = unstable_cache(
  () => client.fetch<Hackathon[]>(HACKATHONS_QUERY),
  ['hackathons'],
  { revalidate: REVALIDATE, tags: ['hackathons'] },
)

export const getObsessions = unstable_cache(
  () => client.fetch<Obsession[]>(OBSESSIONS_QUERY),
  ['obsessions'],
  { revalidate: REVALIDATE, tags: ['obsessions'] },
)

export const getSkills = unstable_cache(
  () => client.fetch<Skill[]>(SKILLS_QUERY),
  ['skills'],
  { revalidate: REVALIDATE, tags: ['skills'] },
)

export const getAbout = unstable_cache(
  () => client.fetch<About | null>(ABOUT_QUERY),
  ['about'],
  { revalidate: REVALIDATE, tags: ['about'] },
)
