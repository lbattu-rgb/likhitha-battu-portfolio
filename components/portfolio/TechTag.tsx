interface TechTagProps {
  name: string
  accent?: string
}

export function TechTag({ name, accent = '#8bb8ff' }: TechTagProps) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 9px',
      border: `1px solid ${accent}33`,
      borderRadius: '2px',
      fontSize: '10px',
      fontFamily: 'var(--font-geist-mono), monospace',
      fontWeight: 400,
      letterSpacing: '0.08em',
      color: `${accent}cc`,
      background: `${accent}0a`,
      whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  )
}

interface TechListProps {
  tags: string[]
  accent?: string
}

export function TechList({ tags, accent }: TechListProps) {
  if (!tags?.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {tags.map((t) => <TechTag key={t} name={t} accent={accent} />)}
    </div>
  )
}
