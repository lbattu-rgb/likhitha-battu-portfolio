'use client'

import dynamic from 'next/dynamic'

// ssr:false must live inside a Client Component in Next.js 16
const BrainScene = dynamic(() => import('./BrainScene'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }} />
  ),
})

export default function BrainSceneLoader() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <BrainScene />
    </div>
  )
}
