'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

// Force dynamic so the studio is never statically exported.
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
