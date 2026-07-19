import type { PortableTextBlock } from '@portabletext/react'

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface SanityImage {
  _key: string
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  alt?: string
  caption?: string
}

export interface SanityLink {
  _key: string
  label: string
  url: string
}

// ─── Research ─────────────────────────────────────────────────────────────────

export type ResearchStatus = 'active' | 'ongoing' | 'completed'

export interface ResearchEntry {
  _id: string
  _createdAt: string
  title: string
  subtitle?: string
  institution: string
  role: string
  startDate?: string
  endDate?: string
  status?: ResearchStatus
  summary?: string
  body?: PortableTextBlock[]
  technologies?: string[]
  images?: SanityImage[]
  links?: SanityLink[]
  featured?: boolean
  displayOrder: number
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  _id: string
  _createdAt: string
  title: string
  slug: { current: string }
  summary?: string
  problem?: string
  solution?: string
  body?: PortableTextBlock[]
  technologies?: string[]
  githubUrl?: string
  demoUrl?: string
  images?: SanityImage[]
  featured?: boolean
  displayOrder: number
}

// ─── Hackathon ────────────────────────────────────────────────────────────────

export interface Hackathon {
  _id: string
  _createdAt: string
  title: string
  event: string
  year?: number
  placement?: string
  summary?: string
  technologies?: string[]
  images?: SanityImage[]
  links?: SanityLink[]
  displayOrder: number
}

// ─── Obsession ────────────────────────────────────────────────────────────────

export type ObsessionStatus = 'active' | 'archived'

export interface Obsession {
  _id: string
  _createdAt: string
  topic: string
  whyInterested?: string
  notes?: PortableTextBlock[]
  resources?: Array<{
    _key: string
    title: string
    url: string
    type: 'paper' | 'article' | 'video' | 'repo' | 'other'
  }>
  status?: ObsessionStatus
  displayOrder: number
}

// ─── Skill ────────────────────────────────────────────────────────────────────

export type SkillCategory = 'languages' | 'frameworks' | 'tools' | 'ml-ai' | 'scientific'
export type SkillProficiency = 'familiar' | 'proficient' | 'expert'

export interface Skill {
  _id: string
  _createdAt: string
  name: string
  category: SkillCategory
  proficiency?: SkillProficiency
  displayOrder: number
}

// ─── About ────────────────────────────────────────────────────────────────────

export interface About {
  _id: string
  headline: string
  bio?: PortableTextBlock[]
  values?: string[]
  photo?: SanityImage
  links?: SanityLink[]
}
