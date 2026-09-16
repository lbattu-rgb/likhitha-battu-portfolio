// Cheap synchronous probe for WebGL support. Mirrors exactly what
// THREE.WebGLRenderer does internally when Canvas mounts — if this fails,
// so would the real renderer (with an uncaught promise rejection R3F
// doesn't surface, and no React error boundary can catch since it isn't a
// render-time throw). Checking up front lets us skip mounting the Canvas
// entirely and show real navigation instead of a dead black screen.
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}
