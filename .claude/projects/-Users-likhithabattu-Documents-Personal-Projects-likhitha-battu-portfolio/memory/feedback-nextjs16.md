---
name: feedback-nextjs16
description: Next.js 16 breaking changes relevant to this project (ssr:false, dynamic imports)
metadata:
  type: feedback
---

**Rule:** `ssr: false` in `next/dynamic` must live inside a `'use client'` component — it is BANNED in Server Components.

**Why:** Next.js 16 enforces that dynamic import options that affect client rendering must be declared from client context.

**How to apply:** Always wrap SSR-disabled dynamic imports in a thin `'use client'` loader component:

```tsx
// components/brain/BrainSceneLoader.tsx
'use client'
import dynamic from 'next/dynamic'

const BrainScene = dynamic(() => import('./BrainScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '100vh', background: '#000' }} />,
})

export default function BrainSceneLoader() {
  return <BrainScene />
}
```

Then import `BrainSceneLoader` (not `BrainScene`) from the Server Component page.
