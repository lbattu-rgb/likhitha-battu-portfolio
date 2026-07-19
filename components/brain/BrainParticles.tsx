'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import {
  generateChaosPositions,
  generateParticleSizes,
  generatePulseOffsets,
  generateNeuralConnections,
  assignLobeId,
  LOBE_COLORS,
} from '@/lib/brainGeometry'
import { SHADER_UNIFORMS } from '@/lib/brainState'
import { LOBE_ROUTES } from '@/lib/brainRegions'

// ─── Module-level data (computed once, geometry mutated on load) ──────────────

const PARTICLE_COUNT = 13_000

const _chaos   = generateChaosPositions(PARTICLE_COUNT)
const _sizes   = generateParticleSizes(PARTICLE_COUNT)
const _pulses  = generatePulseOffsets(PARTICLE_COUNT)

const _colors   = new Float32Array(PARTICLE_COUNT * 3).fill(0.25)
const _normals  = new Float32Array(PARTICLE_COUNT * 3)
const _lobeIds  = new Float32Array(PARTICLE_COUNT)   // 0-5 per particle

const _brainPos = _chaos.slice()

// ─── Particle shaders ─────────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3  aColor;
  attribute vec3  aChaosPos;
  attribute float aPulse;
  attribute vec3  aNormal;
  attribute float aLobeId;

  uniform float uTime;
  uniform float uReadyTime;
  uniform vec3  uMouse3D;
  uniform float uMouseInfluence;
  uniform float uHoveredLobe;
  uniform float uHoverTransition;

  varying vec3  vColor;
  varying float vAlpha;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) * 0.5;
  }

  void main() {
    bool loaded = uReadyTime >= 0.0;

    // ── Loading state: dim twinkling chaos cloud ──
    if (!loaded) {
      vec4 mv  = modelViewMatrix * vec4(aChaosPos, 1.0);
      gl_PointSize = aSize * (550.0 / -mv.z);
      gl_Position  = projectionMatrix * mv;
      vColor = vec3(0.10, 0.18, 0.38);
      vAlpha = 0.10 + 0.06 * sin(uTime * 1.6 + aPulse);
      return;
    }

    // ── Assembly animation (chaos → brain) ──
    float assemblyT = uTime - uReadyTime;
    float rawP      = clamp((assemblyT - 0.3) / 4.8, 0.0, 1.0);
    float easedP    = easeInOutCubic(rawP);
    float bloom     = smoothstep(0.20, 0.85, easedP);

    // ── Ridge/sulcus detection via surface normal ──
    // nNorm is reused for the hover-lift displacement below.
    vec3  nNorm       = normalize(aNormal);
    float rf          = max(0.0, dot(nNorm, normalize(position)));
    float ridgeFactor = mix(1.0, 0.35 + 0.65 * rf, bloom);  // raised floor: fewer dark concave particles
    float ridgeSize   = mix(1.0, 0.68 + 0.32 * rf, bloom);

    // Neural pulse: gentle post-assembly breathing
    float assembled = smoothstep(4.5, 5.5, assemblyT);
    float pulseRate = 0.50 + aPulse * 0.18;
    float pulseVal  = 0.74 + 0.26 * sin(uTime * pulseRate + aPulse);
    float brightMul = mix(1.0, pulseVal, assembled * 0.45);

    // Very subtle per-node biological drift
    float driftAmt = assembled * 0.006;
    vec3 drift = vec3(
      sin(uTime * 0.20 + aPulse * 1.30) * driftAmt,
      cos(uTime * 0.16 + aPulse * 0.95) * driftAmt,
      sin(uTime * 0.12 + aPulse * 1.10) * driftAmt
    );

    vec3 basePos = mix(aChaosPos, position + drift, easedP);

    // ── Mouse flow displacement ──
    // Magnetic field / fluid feel: particles flow and swirl around cursor,
    // return smoothly when the mouse moves away.
    vec3  toMouse   = basePos - uMouse3D;
    float mDist     = length(toMouse);
    float mPull     = uMouseInfluence * smoothstep(0.42, 0.015, mDist);
    vec3  mDir      = mDist > 0.001 ? toMouse / mDist : vec3(0.0, 1.0, 0.0);
    vec3  mUp       = abs(mDir.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3  mSwirl    = normalize(cross(mDir, mUp));
    float mWave     = 0.5 + 0.5 * sin(mDist * 14.0 - uTime * 3.2);
    vec3  mouseDisp = (mDir * 0.55 + mSwirl * 0.45) * mWave * mPull * 0.095 * assembled;

    // ── Lobe hover ──
    // Brain stays fully vibrant — no global dimming.
    // Hovered lobe gets a clear brightness boost (42% = noticeable but not cartoonish).
    float lobeHovered = step(0.0, uHoveredLobe);
    float isMyLobe    = 1.0 - step(0.5, abs(aLobeId - uHoveredLobe));
    float lobeBright  = 1.0 + lobeHovered * bloom * isMyLobe * 0.42;

    // ── Hover lift: hovered region pushes outward along surface normal ──
    // Exploded-slice separation — physical, not gimmicky.
    float liftAmt  = lobeHovered * isMyLobe * uHoverTransition * 0.024 * assembled;
    vec3  liftDisp = nNorm * liftAmt;

    vec3 chaosCol = vec3(0.18, 0.32, 0.62);
    vColor = mix(chaosCol, aColor * brightMul, bloom);
    vAlpha = smoothstep(0.0, 0.5, assemblyT) * 0.90 * ridgeFactor * lobeBright;

    vec3 pos   = basePos + mouseDisp + liftDisp;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * ridgeSize * (1200.0 / -mvPos.z);  // larger points fill gaps
    gl_Position  = projectionMatrix * mvPos;
  }
`

const PARTICLE_FRAG = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.44) discard;

    float core  = 1.0 - smoothstep(0.00, 0.16, d);
    float halo  = 1.0 - smoothstep(0.16, 0.42, d);

    float alpha = (core * 0.95 + halo * 0.12) * vAlpha;
    vec3  col   = mix(vColor, vec3(1.0), core * 0.38);
    gl_FragColor = vec4(col, alpha);
  }
`

// ─── Line shaders ─────────────────────────────────────────────────────────────

const LINE_VERT = /* glsl */ `
  attribute vec3  aLineColor;
  attribute float aLineBright;

  uniform float uTime;
  uniform float uReadyTime;

  varying vec3  vLineColor;
  varying float vLineAlpha;

  void main() {
    float assemblyT = uReadyTime >= 0.0 ? uTime - uReadyTime : 0.0;
    float progress  = clamp((assemblyT - 4.0) / 2.5, 0.0, 1.0);
    vLineAlpha  = progress * aLineBright;
    vLineColor  = aLineColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const LINE_FRAG = /* glsl */ `
  varying vec3  vLineColor;
  varying float vLineAlpha;
  void main() {
    gl_FragColor = vec4(vLineColor, vLineAlpha);
  }
`

// ─── Geometry + Material (module-level, mutated after binary loads) ───────────

const _geo = new THREE.BufferGeometry()
_geo.setAttribute('position',  new THREE.BufferAttribute(_brainPos, 3))
_geo.setAttribute('aChaosPos', new THREE.BufferAttribute(_chaos,    3))
_geo.setAttribute('aSize',     new THREE.BufferAttribute(_sizes,    1))
_geo.setAttribute('aColor',    new THREE.BufferAttribute(_colors,   3))
_geo.setAttribute('aPulse',    new THREE.BufferAttribute(_pulses,   1))
_geo.setAttribute('aNormal',   new THREE.BufferAttribute(_normals,  3))
_geo.setAttribute('aLobeId',   new THREE.BufferAttribute(_lobeIds,  1))

const _mat = new THREE.ShaderMaterial({
  uniforms:       SHADER_UNIFORMS,
  vertexShader:   PARTICLE_VERT,
  fragmentShader: PARTICLE_FRAG,
  transparent:    true,
  depthWrite:     false,
  blending:       THREE.AdditiveBlending,
})

const _lineGeo = new THREE.BufferGeometry()
_lineGeo.setAttribute('position',    new THREE.BufferAttribute(new Float32Array(6), 3))
_lineGeo.setAttribute('aLineColor',  new THREE.BufferAttribute(new Float32Array(6), 3))
_lineGeo.setAttribute('aLineBright', new THREE.BufferAttribute(new Float32Array(2), 1))

const _lineMat = new THREE.ShaderMaterial({
  uniforms:       SHADER_UNIFORMS,
  vertexShader:   LINE_VERT,
  fragmentShader: LINE_FRAG,
  transparent:    true,
  depthWrite:     false,
  blending:       THREE.AdditiveBlending,
})

// ─── Binary loader (runs once at mount) ──────────────────────────────────────

let _loaded = false

async function loadBrainBinary(): Promise<void> {
  if (_loaded) return
  _loaded = true

  const res = await fetch('/brain-surface.bin')
  if (!res.ok) throw new Error(`Failed to fetch brain-surface.bin: ${res.status}`)
  const buf = await res.arrayBuffer()

  const raw      = new Float32Array(buf, 0, PARTICLE_COUNT * 6)
  const brainPos = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    brainPos[i*3]   = raw[i*6]
    brainPos[i*3+1] = raw[i*6+1]
    brainPos[i*3+2] = raw[i*6+2]
    _normals[i*3]   = raw[i*6+3]
    _normals[i*3+1] = raw[i*6+4]
    _normals[i*3+2] = raw[i*6+5]
  }

  const lobeIds = new Uint8Array(PARTICLE_COUNT)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    lobeIds[i] = assignLobeId(brainPos[i*3], brainPos[i*3+1], brainPos[i*3+2])
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const c = LOBE_COLORS[lobeIds[i]]
    _colors[i*3] = c[0]; _colors[i*3+1] = c[1]; _colors[i*3+2] = c[2]
    _lobeIds[i]  = lobeIds[i]
  }

  _brainPos.set(brainPos)
  _geo.attributes.position.needsUpdate = true
  _geo.attributes.aColor.needsUpdate   = true
  _geo.attributes.aNormal.needsUpdate  = true
  _geo.attributes.aLobeId.needsUpdate  = true

  const { linePositions, lineColors, lineBright } = generateNeuralConnections(
    brainPos, _colors, lobeIds, PARTICLE_COUNT,
  )
  _lineGeo.setAttribute('position',    new THREE.BufferAttribute(linePositions, 3))
  _lineGeo.setAttribute('aLineColor',  new THREE.BufferAttribute(lineColors,    3))
  _lineGeo.setAttribute('aLineBright', new THREE.BufferAttribute(lineBright,    1))

  SHADER_UNIFORMS.uReadyTime.value = SHADER_UNIFORMS.uTime.value
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BrainParticles() {
  const mountedRef = useRef(false)
  const { raycaster } = useThree()
  const router = useRouter()

  // Enable point-cloud hit detection with a comfortable radius (local-space units).
  // At group scale 1.42 this is ~0.057 world units — large enough to reliably hit
  // individual particles while scrolling across the surface.
  useEffect(() => {
    raycaster.params.Points = { threshold: 0.04 }
  }, [raycaster])

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    loadBrainBinary().catch(console.error)
  }, [])

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    if (!_loaded || e.index === undefined || e.index >= PARTICLE_COUNT) return
    SHADER_UNIFORMS.uHoveredLobe.value = _lobeIds[e.index]
    document.body.style.cursor = 'pointer'
  }

  function handlePointerLeave() {
    SHADER_UNIFORMS.uHoveredLobe.value = -1
    document.body.style.cursor = 'default'
  }

  function handleClick(e: ThreeEvent<PointerEvent>) {
    if (!_loaded || e.index === undefined || e.index >= PARTICLE_COUNT) return
    const route = LOBE_ROUTES[_lobeIds[e.index]]
    if (route) router.push(route)
  }

  return (
    <>
      <points
        geometry={_geo}
        material={_mat}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      />
      <lineSegments geometry={_lineGeo} material={_lineMat} />
    </>
  )
}
