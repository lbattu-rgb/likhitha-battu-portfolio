'use client'

import { Canvas } from '@react-three/fiber'
import { BrainContent } from './BrainContent'

export default function BrainScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 55, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      style={{ width: '100%', height: '100%', background: '#000000' }}
      frameloop="always"
    >
      <BrainContent />
    </Canvas>
  )
}
