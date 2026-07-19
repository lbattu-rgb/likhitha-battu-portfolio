interface TechTagProps {
  name: string
  accent?: string
}

export function TechTag({ name, accent = '#8bb8ff' }: TechTagProps) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 11px',
      border: `1px solid ${accent}40`,
      borderRadius: 'var(--ui-radius-sm)',
      fontSize: 'var(--text-meta)',
      fontFamily: 'var(--font-geist-mono), monospace',
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: `${accent}e0`,
      background: `${accent}12`,
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
