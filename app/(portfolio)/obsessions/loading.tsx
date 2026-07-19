import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="Current Obsessions" accent="#fb2379">
      <PageSkeleton layout="grid" count={4} />
    </PageShell>
  )
}
