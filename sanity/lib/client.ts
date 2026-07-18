import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

if (!projectId) {
  // Warn loudly at startup but don't crash — pages will show empty states.
  console.warn(
    '[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. ' +
    'Content pages will be empty. See .env.local.example for setup instructions.'
  )
}

export const client = createClient({
  projectId: projectId ?? 'MISSING_PROJECT_ID',
  dataset,
  apiVersion: '2024-01-01',
  // useCdn serves cached content (fast, free). Flip to false for draft previews.
  useCdn: true,
})
