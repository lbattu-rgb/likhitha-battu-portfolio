import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="Projects" accent="#c084fc">
      <PageSkeleton layout="grid" count={4} />
    </PageShell>
  )
}
