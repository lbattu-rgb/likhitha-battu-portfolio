// Shared mutable animation state — module-level so all brain components
// read/write the same values without React hook tracking.
// Only used inside useFrame callbacks (never during render).
//
// uReadyTime:       -1 while OBJ binary is loading; set to uTime.value when ready.
// uMouse3D:         Mouse cursor projected into the brain group's local space.
// uMouseInfluence:  0–1 scalar; fades in as mouse moves, fades out when idle.
// uHoveredLobe:     -1 when no lobe hovered; 0–5 for the active lobe.
// uHoverTransition: 0–1 spring value; lerps to 1 on hover, 0 on leave.
//                   Drives the outward lift displacement in the particle shader.

import * as THREE from 'three'

export const SHADER_UNIFORMS = {
  uTime:            { value: 0  as number },
  uReadyTime:       { value: -1 as number },
  uMouse3D:         { value: new THREE.Vector3(0, 0, 10) },
  uMouseInfluence:  { value: 0  as number },
  uHoveredLobe:     { value: -1 as number },
  uHoverTransition: { value: 0  as number },
}
