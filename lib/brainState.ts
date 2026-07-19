// Shared mutable animation state — module-level so all brain components
// read/write the same values without React hook tracking, and so the state
// survives BrainContent unmounting/remounting when the user navigates away
// from and back to "/" (the brain should stay assembled, not replay intro).
// Only used inside useFrame callbacks (never during render).
//
// uTime:            Persistent session clock — accumulated via per-frame delta
//                    rather than a per-Canvas-instance clock, so it keeps
//                    counting up across remounts instead of resetting to 0.
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

// One-shot "hover to explore" hint — module-level so it doesn't replay
// every time BrainContent remounts (e.g. navigating back to "/").
export const HINT_STATE = { shown: false }

// Same idea for the HeroOverlay name/text intro (components/overlay/HeroOverlay.tsx).
// That component's entrance timing is driven by Framer Motion's own mount
// timer, not SHADER_UNIFORMS.uTime, so without this it would replay its full
// ~3s delayed reveal every time you navigate back to "/" — even though the
// brain itself is already instantly reassembled by then.
export const HERO_STATE = { introPlayed: false }
