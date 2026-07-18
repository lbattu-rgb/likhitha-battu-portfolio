---
name: feedback-react19-lint
description: Pattern that satisfies react-hooks/refs and react-hooks/immutability rules in React 19 / Next.js 16 for R3F / Three.js code
metadata:
  type: feedback
---

React 19 + `eslint-plugin-react-hooks` v5 adds two strict new rules:
- **`react-hooks/refs`**: Cannot read or write `ref.current` during render (only in useFrame/useEffect/event handlers)
- **`react-hooks/immutability`**: Cannot mutate values returned by hooks (useMemo, useState) or passed as hook deps

**Why:** These rules enforce the React Compiler's purity model — render must be deterministic and free of side effects.

**How to apply:** For R3F / Three.js components that need per-frame mutation, use this pattern:

1. **Module-level constants** for all Three.js data that never changes (Float32Arrays, shader strings, uniforms objects)
2. **Module-level uniforms** (e.g. `SHADER_UNIFORMS = { uTime: { value: 0 } }`) — mutate freely in useFrame
3. **Module-level imperative Three.js objects** — create `THREE.BufferGeometry` and `THREE.ShaderMaterial` at module level using `geo.setAttribute()` (NOT `<bufferAttribute attach="attributes-X" args={...}>`). The JSX attach-path mechanism is unreliable in R3F v9 for custom attributes: if `aSize` or `aChaosPos` silently miss attachment, `gl_PointSize = 0` and ALL particles become invisible.
4. **Pass geometry/material as JSX props**: `<points geometry={_geo} material={_mat} />` — R3F sets them directly, bypassing reconciler attach ambiguity.
5. **useRef access only in useFrame/useEffect** — never in the render body

Example pattern from this project: `components/brain/BrainParticles.tsx`
