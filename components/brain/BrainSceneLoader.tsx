'use client'

import { useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { isWebGLAvailable } from '@/lib/webgl'
import BrainFallback from './BrainFallback'

// ssr:false must live inside a Client Component in Next.js 16
const BrainScene = dynamic(() => import('./BrainScene'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }} />
  ),
})

function subscribe() {
  return () => {}
}

// SSR/hydration always sees true (matches BrainScene's original unconditional
// render) until useSyncExternalStore re-syncs to the real client value right
// after mount — same hydration handoff as lib/useTheme.ts, no manual effect
// needed.
function getServerSnapshot() {
  return true
}

export default function BrainSceneLoader() {
  const webglOk = useSyncExternalStore(subscribe, isWebGLAvailable, getServerSnapshot)

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {webglOk ? <BrainScene /> : <BrainFallback />}
    </div>
  )
}
