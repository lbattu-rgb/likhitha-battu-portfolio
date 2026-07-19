import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="Hackathons" accent="#fb923c">
      <PageSkeleton layout="list" count={3} />
    </PageShell>
  )
}
