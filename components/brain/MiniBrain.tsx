'use client'

import dynamic from 'next/dynamic'

const MINI_BRAIN_HEIGHT = '320px'

// ssr:false must live inside a Client Component in Next.js 16 (same rule as
// the homepage's BrainSceneLoader). Fully separate component/bundle from the
// homepage brain — this never touches components/brain/BrainScene.tsx etc.
const MiniBrainScene = dynamic(() => import('./MiniBrainScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: MINI_BRAIN_HEIGHT }} />,
})

interface MiniBrainProps {
  accent: string
}

// Small always-assembled brain shown at the top of every content page,
// tinted entirely in that page's accent color so it doubles as a map of
// where you are in the site. Unlike the homepage brain, this one respects
// the light/dark toggle since it lives inside content pages.
export default function MiniBrain({ accent }: MiniBrainProps) {
  return (
    <div style={{ width: '100%', height: MINI_BRAIN_HEIGHT, position: 'relative' }}>
      <MiniBrainScene accent={accent} />
    </div>
  )
}
