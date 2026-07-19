import { PageShell }    from '@/components/portfolio/PageShell'
import { PageSkeleton } from '@/components/portfolio/PageSkeleton'

export default function Loading() {
  return (
    <PageShell title="About" accent="#f8fafc">
      <PageSkeleton layout="detail" />
    </PageShell>
  )
}
