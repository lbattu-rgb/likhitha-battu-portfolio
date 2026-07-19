import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="Research" accent="#00ff88">
      <PageSkeleton layout="list" count={4} />
    </PageShell>
  )
}
