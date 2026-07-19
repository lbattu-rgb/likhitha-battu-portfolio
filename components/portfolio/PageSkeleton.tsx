interface PageSkeletonProps {
  layout?: 'list' | 'grid' | 'tags' | 'detail'
  count?: number
}

function Block({ width, height }: { width: string; height: string }) {
  return <div className="skeleton-block" style={{ width, height }} />
}

// Route-level loading UI (used by loading.tsx files). Mirrors PageIntro's
// title/subtitle dimensions so there's no layout shift once real content lands.
export function PageSkeleton({ layout = 'list', count = 4 }: PageSkeletonProps) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Block width="220px" height="38px" />
      <div style={{ marginTop: '10px', marginBottom: '48px' }}>
        <Block width="320px" height="14px" />
      </div>

      {layout === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ padding: '28px 0', borderBottom: '1px solid var(--card-border)' }}>
              <Block width="240px" height="20px" />
              <div style={{ margin: '12px 0' }}><Block width="70%" height="13px" /></div>
              <Block width="45%" height="13px" />
            </div>
          ))}
        </div>
      )}

      {layout === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '20px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ padding: '24px', border: '1px solid var(--card-border)', borderRadius: 'var(--ui-radius-md)' }}>
              <Block width="65%" height="18px" />
              <div style={{ margin: '14px 0' }}><Block width="90%" height="12px" /></div>
              <Block width="60%" height="12px" />
            </div>
          ))}
        </div>
      )}

      {layout === 'tags' && (
        <div>
          {Array.from({ length: 3 }).map((_, row) => (
            <div key={row} style={{ marginBottom: '36px' }}>
              <div style={{ marginBottom: '14px' }}><Block width="140px" height="10px" /></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Block key={i} width={`${50 + (i % 3) * 20}px`} height="24px" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === 'detail' && (
        <div>
          <div style={{ marginBottom: '32px' }}><Block width="100%" height="280px" /></div>
          <div style={{ marginBottom: '24px' }}><Block width="60%" height="32px" /></div>
          <Block width="100%" height="14px" />
          <div style={{ margin: '10px 0' }}><Block width="85%" height="14px" /></div>
          <Block width="70%" height="14px" />
        </div>
      )}
    </div>
  )
}
