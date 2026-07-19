'use client'

import { Canvas } from '@react-three/fiber'
import { MiniBrainContent } from './MiniBrainContent'

interface MiniBrainSceneProps {
  accent: string
}

export default function MiniBrainScene({ accent }: MiniBrainSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45, near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: 'low-power',
        alpha: true,
      }}
      style={{ width: '100%', height: '100%' }}
      frameloop="always"
    >
      <MiniBrainContent accent={accent} />
    </Canvas>
  )
}
