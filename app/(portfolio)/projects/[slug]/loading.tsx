import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="Project" accent="#c084fc">
      <PageSkeleton layout="detail" />
    </PageShell>
  )
}
