import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="Skills" accent="#22d3ee">
      <PageSkeleton layout="tags" />
    </PageShell>
  )
}
