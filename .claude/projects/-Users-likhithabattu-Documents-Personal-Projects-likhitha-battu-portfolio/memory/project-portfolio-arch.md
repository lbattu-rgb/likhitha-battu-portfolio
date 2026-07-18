---
name: project-portfolio-arch
description: Phase 1 portfolio landing — 3D particle brain architecture, file structure, and component map
metadata:
  type: project
---

Phase 1 (landing experience only) is fully implemented and passes lint + tsc.

**Why:** Portfolio represents Likhitha's mind; the centerpiece is a cinematic 3D particle brain built without any external mesh assets.

**How to apply:** Future phases add /research, /projects, /skills, /hackathons, /about, /obsessions routes — the region system in `lib/brainRegions.ts` is already wired for routing.

## Key files

| File | Role |
|---|---|
| `lib/brainGeometry.ts` | Fibonacci-sphere mathematical brain, chaos scatter, region color assignment |
| `lib/brainRegions.ts` | Region definitions (id, color, route, thetaRange, phiRange) |
| `lib/brainState.ts` | Shared `SHADER_UNIFORMS` — mutated in useFrame, read by Three.js each frame |
| `components/brain/BrainContent.tsx` | Single useFrame driver: advances uTime uniform + rotates group |
| `components/brain/BrainParticles.tsx` | Pure rendering: 15k particles, custom GLSL glow shader, module-level data |
| `components/brain/BrainRegions.tsx` | Invisible hit spheres + drei `<Html>` region labels on hover |
| `components/brain/BrainScene.tsx` | R3F Canvas wrapper (ssr:false in BrainSceneLoader) |
| `components/overlay/HeroOverlay.tsx` | Framer Motion staggered text — fades in at t=5.5s after assembly |

## Animation sequence
- 0.0–0.5s: Particles fade in at scattered chaos positions (cold grey-blue)
- 0.5–5.0s: GPU-lerp assembly into brain (ease-in-out-cubic), region colors bloom
- 5.0s+: Brain fully assembled, slow Y-axis rotation (0.08 rad/s)
- 5.5s: Hero text overlay staggers in

## Particle count
15,000 particles — 7,500 per hemisphere. All position data is module-level Float32Arrays.

## 6 brain regions and their colors
- Research: #00ff88 (left frontal)
- Projects: #c084fc (right parietal)
- Skills: #22d3ee (left temporal)
- Hackathons: #fb923c (right frontal)
- About: #f8fafc (posterior occipital)
- Obsessions: #fb2379 (medial prefrontal)
