'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { assignLobeId, LOBE_COLORS } from '@/lib/brainGeometry'
import { useTheme } from '@/lib/useTheme'

// A decimated subset of the homepage's 13,000-sample surface — this is a
// small nav widget, not the hero visualization, so it runs fewer particles.
// Sampling was randomized (see scripts/sampleBrain.mjs), so striding through
// the array yields an unbiased spatial subset — still the whole brain shape,
// just less dense.
const FULL_COUNT = 13_000
const STRIDE     = 2
const MINI_COUNT = Math.floor(FULL_COUNT / STRIDE)

// Same glow technique as the homepage's PARTICLE_VERT/PARTICLE_FRAG
// (components/brain/BrainParticles.tsx) — core+halo falloff, white-hot
// center, additive blending — just with whole-brain accent tinting added on
// top instead of the assembly/mouse-interaction machinery, which this
// static nav widget doesn't need.
const VERT = /* glsl */ `
  attribute vec3  aColor;
  attribute float aLobeId;

  uniform float uTime;
  uniform vec3  uAccentColor;
  uniform float uHighlightBlend;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Quiet breathing + a slow traveling shimmer — an orientation cue you'd
    // only notice after looking, not an attention-grabbing animation. Kept
    // shallow on purpose: vibrancy here comes from color/size, not motion.
    // aLobeId offsets the phase per-particle so it isn't perfectly uniform.
    float breathe = 0.95 + 0.05 * sin(uTime * 1.0 + aLobeId * 1.7);
    float travel  = 0.92 + 0.08 * sin(uTime * 0.8 - (position.x + position.y + position.z) * 2.0);
    vec3 accentColor = uAccentColor * breathe * travel;

    // Eases from a neutral grayscale brain into the full page-accent color
    // on mount/page-switch, rather than snapping.
    float gray = dot(aColor, vec3(0.299, 0.587, 0.114));
    vec3  neutralColor = vec3(gray) * 0.4;
    vColor = mix(neutralColor, accentColor, uHighlightBlend);
    vAlpha = mix(0.60, 1.0, uHighlightBlend);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float size = mix(2.4, 3.2, uHighlightBlend);
    gl_PointSize = size * (9.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.44) discard;

    float core = 1.0 - smoothstep(0.00, 0.16, d);
    float halo = 1.0 - smoothstep(0.16, 0.42, d);

    float alpha = (core * 0.95 + halo * 0.12) * vAlpha;
    vec3  col   = mix(vColor, vec3(1.0), core * 0.38);
    gl_FragColor = vec4(col, alpha);
  }
`

// ─── Module-level cache — decimated once, reused across every page mount ──────

let _positions: Float32Array | null = null
let _colors:    Float32Array | null = null
let _lobeIds:   Float32Array | null = null
let _loadPromise: Promise<void> | null = null

function loadMiniBrainData(): Promise<void> {
  if (_positions) return Promise.resolve()
  if (_loadPromise) return _loadPromise

  _loadPromise = (async () => {
    const res = await fetch('/brain-surface.bin')
    if (!res.ok) throw new Error(`Failed to fetch brain-surface.bin: ${res.status}`)
    const buf = await res.arrayBuffer()
    const raw = new Float32Array(buf, 0, FULL_COUNT * 6)

    const positions = new Float32Array(MINI_COUNT * 3)
    const colors    = new Float32Array(MINI_COUNT * 3)
    const lobeIds   = new Float32Array(MINI_COUNT)

    for (let i = 0; i < MINI_COUNT; i++) {
      const src = i * STRIDE
      const px = raw[src * 6], py = raw[src * 6 + 1], pz = raw[src * 6 + 2]
      positions[i * 3] = px
      positions[i * 3 + 1] = py
      positions[i * 3 + 2] = pz

      const lobeId = assignLobeId(px, py, pz)
      lobeIds[i] = lobeId
      const c = LOBE_COLORS[lobeId]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }

    _positions = positions
    _colors = colors
    _lobeIds = lobeIds
  })()

  return _loadPromise
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MiniBrainContentProps {
  accent: string
}

export function MiniBrainContent({ accent }: MiniBrainContentProps) {
  const [ready, setReady] = useState(!!_positions)
  const groupRef  = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const startRef  = useRef<number | null>(null)
  const theme = useTheme()

  useEffect(() => {
    let cancelled = false
    loadMiniBrainData()
      .then(() => { if (!cancelled) setReady(true) })
      .catch(console.error)
    return () => { cancelled = true }
  }, [])

  const geometry = useMemo(() => {
    if (!ready || !_positions || !_colors || !_lobeIds) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(_positions, 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(_colors, 3))
    geo.setAttribute('aLobeId',  new THREE.BufferAttribute(_lobeIds, 1))
    return geo
  }, [ready])

  // Material is only recreated when the theme changes (blending mode swap);
  // accent updates go through pointsRef in useFrame below instead of closing
  // over this variable, matching the ref-indirection pattern already used
  // for coreMat/haloMat in BrainRegions.tsx.
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:           { value: 0 },
      uAccentColor:    { value: new THREE.Color(accent) },
      uHighlightBlend: { value: 0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [theme])

  // accent is synced every frame (rather than via useEffect) alongside
  // uTime/uHighlightBlend — reading refs from more than one hook in the
  // same component trips react-hooks/immutability, so everything that
  // touches pointsRef lives in this single useFrame callback.
  useFrame(({ clock }) => {
    const now = clock.getElapsedTime()
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined
    if (mat) {
      mat.uniforms.uTime.value = now
      ;(mat.uniforms.uAccentColor.value as THREE.Color).set(accent)

      if (startRef.current === null) startRef.current = now
      const since = now - startRef.current
      // Ease the highlight in over ~0.6s on mount/page-switch rather than snapping.
      mat.uniforms.uHighlightBlend.value = Math.min(1, since / 0.6)
    }

    if (groupRef.current) {
      // Gentle sway within ±5.7°, not a continuous spin — and a small float.
      groupRef.current.rotation.y = Math.sin(now * 0.4) * 0.10
      groupRef.current.position.y = Math.sin(now * 0.4) * 0.04
    }
  })

  if (!geometry) return null

  return (
    <group ref={groupRef} scale={1.1}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  )
}
