export interface BrainRegion {
  id: string
  label: string
  color: string
  route: string
}

export const BRAIN_REGIONS: BrainRegion[] = [
  { id: 'research', label: 'Research', color: '#00ff88', route: '/research' },
  { id: 'projects', label: 'Projects', color: '#c084fc', route: '/projects' },
  { id: 'skills', label: 'Skills', color: '#22d3ee', route: '/skills' },
  { id: 'hackathons', label: 'Hackathons', color: '#fb923c', route: '/hackathons' },
  { id: 'about', label: 'About', color: '#f8fafc', route: '/about' },
  { id: 'obsessions', label: 'Current Obsessions', color: '#fb2379', route: '/obsessions' },
]

// lobeId (0–5), as classified by assignLobeId() in lib/brainGeometry.ts, maps 1:1
// to BRAIN_REGIONS in array order (see BrainRegions.tsx LAYOUT for the verified
// per-region lobeId assignments). Used to route brain-surface clicks to pages.
export const LOBE_ROUTES: string[] = BRAIN_REGIONS.map((r) => r.route)
