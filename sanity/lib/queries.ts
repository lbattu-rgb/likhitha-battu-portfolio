// ─── GROQ query strings ───────────────────────────────────────────────────────
// Centralised here so pages never contain raw query strings.

// Shared image projection reused across queries.
const IMAGE_FIELDS = `
  asset,
  hotspot,
  alt,
  caption
`

const LINK_FIELDS = `label, url`

// ─── Research ─────────────────────────────────────────────────────────────────

export const RESEARCH_QUERY = `
  *[_type == "research"] | order(featured desc, displayOrder asc, startDate desc) {
    _id,
    _createdAt,
    title,
    subtitle,
    institution,
    role,
    startDate,
    endDate,
    status,
    summary,
    body,
    technologies,
    images[] { ${IMAGE_FIELDS} },
    links[] { _key, ${LINK_FIELDS} },
    featured,
    displayOrder,
  }
`

// ─── Projects ─────────────────────────────────────────────────────────────────

export const PROJECTS_QUERY = `
  *[_type == "project"] | order(featured desc, displayOrder asc, _createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    summary,
    technologies,
    images[] { ${IMAGE_FIELDS} },
    githubUrl,
    demoUrl,
    featured,
    displayOrder,
  }
`

export const PROJECT_SLUGS_QUERY = `
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    summary,
    problem,
    solution,
    body,
    technologies,
    images[] { ${IMAGE_FIELDS} },
    githubUrl,
    demoUrl,
    featured,
    displayOrder,
  }
`

// ─── Hackathons ───────────────────────────────────────────────────────────────

export const HACKATHONS_QUERY = `
  *[_type == "hackathon"] | order(displayOrder asc, year desc) {
    _id,
    _createdAt,
    title,
    event,
    year,
    placement,
    summary,
    technologies,
    images[] { ${IMAGE_FIELDS} },
    links[] { _key, ${LINK_FIELDS} },
    displayOrder,
  }
`

// ─── Obsessions ───────────────────────────────────────────────────────────────

export const OBSESSIONS_QUERY = `
  *[_type == "obsession"] | order(status asc, displayOrder asc) {
    _id,
    _createdAt,
    topic,
    whyInterested,
    notes,
    resources[] { _key, title, url, type },
    status,
    displayOrder,
  }
`
