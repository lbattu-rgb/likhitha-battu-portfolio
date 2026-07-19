'use client'

import { useRef, useMemo } from 'react'
import { useFrame }  from '@react-three/fiber'
import { Html }      from '@react-three/drei'
import * as THREE    from 'three'
import { useRouter } from 'next/navigation'
import { BRAIN_REGIONS, type BrainRegion } from '@/lib/brainRegions'
import { SHADER_UNIFORMS } from '@/lib/brainState'

// ─── Layout ───────────────────────────────────────────────────────────────────
// anchor : entry node ON the brain surface (must sit inside the lobe's color region)
// bend   : quadratic-bezier control point — governs the organic curve
// label  : annotation text position (outside the brain)
// phase  : per-region stagger for the floating animation
// lobeId : matches LOBE_COLORS index — this is the source of truth for hover state.
//          Animation reads SHADER_UNIFORMS.uHoveredLobe directly, no React state.

type Layout = {
  anchor: [number, number, number]
  bend:   [number, number, number]
  label:  [number, number, number]
  phase:  number
  lobeId: number
}

// Anchors verified against the new 3-band × 2-column assignLobeId:
//   Bottom (y < -0.10):   x < 0.10 → pink(5),  x ≥ 0.10 → white(4)
//   Top    (y >  0.32):   x < 0.00 → green(0), x ≥ 0.00 → violet(1)
//   Middle (else):        x < 0.06 → cyan(2),  x ≥ 0.06 → orange(3)
//
//   research   [-0.65, 0.52, 0.52]: y=0.52>0.32, x=-0.65<0.00 → green(0)   ✓
//   obsessions [-0.20,-0.42, 0.52]: y=-0.42<-0.10, x=-0.20<0.10 → pink(5)  ✓
//   projects   [ 0.05, 0.72, 0.58]: y=0.72>0.32, x=0.05≥0.00  → violet(1) ✓
//   hackathons [ 0.76, 0.18, 0.42]: middle band, x=0.76≥0.06   → orange(3) ✓
//   skills     [-0.45, 0.18, 0.68]: middle band, x=-0.45<0.06  → cyan(2)   ✓
//   about      [ 0.58,-0.44, 0.52]: y=-0.44<-0.10, x=0.58≥0.10 → white(4) ✓
//
// Label layout — 3 left / 3 right mirrors the X-split of the regions. Each
// side's labels stay stacked in the SAME top-to-bottom order as their
// anchors (research above skills above obsessions on the left; projects
// above hackathons above about on the right) so the connector curves never
// cross each other — a label whose curve dips into a neighboring region's
// vertical band reads as ambiguous about which region it belongs to.
//   LEFT  (screen-left regions):  research↑, skills→(middle), obsessions↓
//   RIGHT (screen-right regions): projects↑, hackathons→(middle), about↓
const LAYOUT: Record<string, Layout> = {
  research:   { anchor: [-0.65,  0.52,  0.52], bend: [-1.38,  0.58,  0.22], label: [-1.90,  0.62, 0], phase: 0.00, lobeId: 0 },
  obsessions: { anchor: [-0.20, -0.42,  0.52], bend: [-0.72, -0.48,  0.32], label: [-1.28, -0.52, 0], phase: 1.05, lobeId: 5 },
  projects:   { anchor: [ 0.05,  0.72,  0.58], bend: [ 1.00,  0.96,  0.22], label: [ 1.82,  1.08, 0], phase: 2.10, lobeId: 1 },
  hackathons: { anchor: [ 0.76,  0.18,  0.42], bend: [ 1.45,  0.20,  0.14], label: [ 1.88,  0.26, 0], phase: 3.15, lobeId: 3 },
  skills:     { anchor: [-0.45,  0.18,  0.68], bend: [-1.15,  0.05,  0.35], label: [-1.85, -0.05, 0], phase: 4.20, lobeId: 2 },
  about:      { anchor: [ 0.58, -0.44,  0.52], bend: [ 1.22, -0.80,  0.24], label: [ 1.72, -1.26, 0], phase: 5.25, lobeId: 4 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function smoothstep(lo: number, hi: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)))
  return t * t * (3 - 2 * t)
}

function bezierLineGeo(
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
  segments = 32,
): THREE.BufferGeometry {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...a),
    new THREE.Vector3(...b),
    new THREE.Vector3(...c),
  )
  const pts = curve.getPoints(segments)
  const buf = new Float32Array(pts.length * 3)
  pts.forEach((p, i) => { buf[i * 3] = p.x; buf[i * 3 + 1] = p.y; buf[i * 3 + 2] = p.z })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(buf, 3))
  return geo
}

// ─── Single callout ───────────────────────────────────────────────────────────

interface CalloutProps {
  region:  BrainRegion
  layout:  Layout
  onEnter: () => void
  onLeave: () => void
  onClick: () => void
}

function RegionCallout({ region, layout, onEnter, onLeave, onClick }: CalloutProps) {
  const { anchor, bend, label, phase, lobeId } = layout
  const hex = region.color

  // Anchor core — neuron-scale: r=0.018
  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(hex),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [hex])
  const coreGeo = useMemo(() => new THREE.SphereGeometry(0.018, 10, 7), [])
  const coreRef = useRef<THREE.Mesh>(null)

  // Anchor halo — small breathing glow: r=0.045
  const haloMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(hex),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [hex])
  const haloGeo = useMemo(() => new THREE.SphereGeometry(0.045, 8, 6), [])
  const haloRef = useRef<THREE.Mesh>(null)

  // Connector — thin organic bezier
  const lineGeo = useMemo(() => bezierLineGeo(anchor, bend, label), [anchor, bend, label])
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(hex),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [hex])
  const lineObj = useMemo(() => new THREE.Line(lineGeo, lineMat), [lineGeo, lineMat])

  const labelGroupRef = useRef<THREE.Group>(null)
  const divRef        = useRef<HTMLDivElement>(null)

  useFrame(() => {
    const t         = SHADER_UNIFORMS.uTime.value
    const readyAt   = SHADER_UNIFORMS.uReadyTime.value
    const assemblyT = readyAt >= 0 ? t - readyAt : 0

    const appear  = smoothstep(5.4, 6.3, assemblyT)
    const pulse   = 0.5 + 0.5 * Math.sin(t * 1.4 + phase)

    // Read hover state directly from the uniform — no React state needed.
    // Particle onPointerMove, anchor onPointerEnter, and label onPointerEnter
    // all write to this uniform; we read it here to drive all animations.
    const hovered = SHADER_UNIFORMS.uHoveredLobe.value === lobeId

    // Anchor core: continues pulsing on hover (feels alive, not frozen)
    const coreM = coreRef.current?.material as THREE.MeshBasicMaterial | undefined
    if (coreM) coreM.opacity = appear * (hovered ? 0.80 + 0.20 * pulse : 0.50 + 0.22 * pulse)

    // Anchor halo: expands faster on hover
    if (haloRef.current) {
      const haloM = haloRef.current.material as THREE.MeshBasicMaterial
      haloRef.current.scale.setScalar(1.0 + (hovered ? 0.90 : 0.55) * pulse)
      haloM.opacity = appear * (hovered ? 0.36 + 0.16 * pulse : 0.10 + 0.07 * pulse)
    }

    // Connector: 0.32 rest → 0.80 hover
    lineMat.opacity = appear * (hovered ? 0.80 : 0.32 + 0.06 * pulse)

    // Label gentle float
    if (labelGroupRef.current) {
      labelGroupRef.current.position.y = label[1] + Math.sin(t * 0.36 + phase) * 0.020
    }

    // Label opacity: 0.94 rest → 1.0 hover
    if (divRef.current) {
      const breathe = 0.96 + 0.04 * Math.sin(t * 0.44 + phase)
      divRef.current.style.opacity = String(appear * (hovered ? 1.0 : 0.94 * breathe))
    }
  })

  return (
    <>
      {/* Anchor node — visual only; hover is handled by the particle cloud */}
      <group position={anchor}>
        <mesh ref={coreRef} geometry={coreGeo} material={coreMat} />
        <mesh ref={haloRef} geometry={haloGeo} material={haloMat} />
      </group>

      {/* Thin organic connector */}
      <primitive object={lineObj} />

      {/* Minimal scientific annotation — dot · name only (no subtitle) */}
      <group ref={labelGroupRef} position={[label[0], label[1], label[2]]}>
        <Html center distanceFactor={5} style={{ pointerEvents: 'none' }}>
          <div
            ref={divRef}
            style={{
              opacity: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", system-ui, monospace',
            }}
            onPointerEnter={() => { onEnter(); document.body.style.cursor = 'pointer' }}
            onPointerLeave={() => { onLeave(); document.body.style.cursor = 'default' }}
            onClick={onClick}
          >
            {/* Accent dot */}
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: hex,
              boxShadow: `0 0 6px ${hex}, 0 0 14px ${hex}cc, 0 0 28px ${hex}55`,
              flexShrink: 0,
            }} />
            {/* Region name */}
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1.15,
              textShadow: `0 0 8px ${hex}, 0 0 20px ${hex}bb`,
            }}>
              {region.label}
            </div>
          </div>
        </Html>
      </group>
    </>
  )
}

// ─── Scene root ───────────────────────────────────────────────────────────────

export function BrainRegions() {
  const router = useRouter()

  // Spring-animate uHoverTransition: lerps 0→1 on hover, 1→0 on leave.
  // Drives the outward lift displacement in the particle vertex shader.
  useFrame(() => {
    const target  = SHADER_UNIFORMS.uHoveredLobe.value >= 0 ? 1 : 0
    const current = SHADER_UNIFORMS.uHoverTransition.value
    SHADER_UNIFORMS.uHoverTransition.value = current + (target - current) * 0.12
  })

  return (
    <>
      {BRAIN_REGIONS.map((region) => {
        const layout = LAYOUT[region.id]
        if (!layout) return null
        return (
          <RegionCallout
            key={region.id}
            region={region}
            layout={layout}
            onEnter={() => {
              SHADER_UNIFORMS.uHoveredLobe.value = layout.lobeId
              document.body.style.cursor = 'pointer'
              router.prefetch(region.route)
            }}
            onLeave={() => {
              SHADER_UNIFORMS.uHoveredLobe.value = -1
              document.body.style.cursor = 'default'
            }}
            onClick={() => router.push(region.route)}
          />
        )
      })}
    </>
  )
}
