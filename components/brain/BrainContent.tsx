'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { BrainParticles } from './BrainParticles'
import { BrainRegions } from './BrainRegions'
import { SHADER_UNIFORMS } from '@/lib/brainState'

const ASSEMBLY_DURATION = 5.3

// Pre-allocated temp objects — never re-created in the hot path
const _raycaster  = new THREE.Raycaster()
const _worldHit   = new THREE.Vector3()
const _frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

export function BrainContent() {
  const groupRef     = useRef<THREE.Group>(null)
  const hintRef      = useRef<HTMLDivElement>(null)
  const hintShownRef = useRef(false)
  const lastMoveRef  = useRef(-999)
  const lastPtrRef   = useRef({ x: 0, y: 0 })

  const { camera, pointer } = useThree()

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime()
    SHADER_UNIFORMS.uTime.value = now

    // ── Mouse tracking: project pointer ray to brain group's local space ────
    _raycaster.setFromCamera(pointer, camera)
    if (_raycaster.ray.intersectPlane(_frontPlane, _worldHit) && groupRef.current) {
      groupRef.current.worldToLocal(_worldHit)
      SHADER_UNIFORMS.uMouse3D.value.copy(_worldHit)
    }

    // Mouse influence: fades in on movement, decays smoothly when idle
    const moved = Math.abs(pointer.x - lastPtrRef.current.x)
                + Math.abs(pointer.y - lastPtrRef.current.y)
    if (moved > 0.0008) {
      lastMoveRef.current  = now
      lastPtrRef.current.x = pointer.x
      lastPtrRef.current.y = pointer.y
    }
    const idle         = now - lastMoveRef.current
    const targetInfl   = idle < 0.08 ? 1.0 : Math.max(0, 1 - (idle - 0.08) / 1.6)
    SHADER_UNIFORMS.uMouseInfluence.value +=
      (targetInfl - SHADER_UNIFORMS.uMouseInfluence.value) * 0.09

    if (!groupRef.current) return

    const readyAt    = SHADER_UNIFORMS.uReadyTime.value
    const sinceReady = readyAt >= 0 ? now - readyAt : 0

    // ── Pendulum rotation post-assembly ─────────────────────────────────────
    if (sinceReady >= ASSEMBLY_DURATION) {
      const t = sinceReady - ASSEMBLY_DURATION
      groupRef.current.rotation.y = Math.sin(t * 0.11) * 0.10
    }

    // ── One-shot "hover to explore" hint ────────────────────────────────────
    // Appears 1.5s after assembly completes, fades out 4s later, never returns.
    if (hintRef.current && !hintShownRef.current && sinceReady > ASSEMBLY_DURATION + 1.5) {
      hintShownRef.current = true
      hintRef.current.style.opacity = '1'
      setTimeout(() => {
        if (hintRef.current) hintRef.current.style.opacity = '0'
      }, 4000)
    }
  })

  return (
    <group ref={groupRef} scale={1.42}>
      <BrainParticles />
      <BrainRegions />

      {/* Hint anchored just below the brain, swings with pendulum */}
      <group position={[0, -1.12, 0.55]}>
        <Html center distanceFactor={4} style={{ pointerEvents: 'none' }}>
          <div
            ref={hintRef}
            style={{
              opacity: 0,
              transition: 'opacity 1.4s ease',
              textAlign: 'center',
              pointerEvents: 'none',
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, monospace',
            }}
          >
            <div style={{
              fontSize: '8px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(130, 170, 255, 0.48)',
            }}>
              hover to explore
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
