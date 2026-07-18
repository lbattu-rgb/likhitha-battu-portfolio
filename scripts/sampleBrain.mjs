/**
 * Preprocessing script: Brain.obj → curvature-biased surface sampling →
 * public/brain-surface.bin
 *
 * KEY IDEA: gyri (convex ridges) receive far more particles than sulci
 * (concave valleys). This makes the fold structure clearly readable —
 * gyri appear as bright clusters, sulci as dark empty gaps.
 *
 * Algorithm:
 *   1. Build vertex adjacency graph from mesh faces
 *   2. Compute uniform Laplacian at every vertex: L(v) = avg(neighbours) − v
 *   3. Signed curvature: K(v) = −dot(L, N) / |L|
 *      → positive K = convex = gyrus crown
 *      → negative K = concave = sulcal floor
 *   4. Normalise K to zero-mean unit-std, then clamp to [−1, +1]
 *   5. Weighted CDF:  w(triangle) = max(ε, 1 + BIAS × avgK)
 *      → gyral triangles sampled much more often than sulcal ones
 *   6. Standard area-weighted Barycentric sampling on the biased CDF
 *
 * Output format: interleaved Float32 [px py pz nx ny nz] per sample
 *
 * Run once: node scripts/sampleBrain.mjs
 */

import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.join(__dirname, '..')
const OBJ_PATH  = path.join(ROOT, 'uploads_files_4417378_Brain.obj')
const OUT_PATH  = path.join(ROOT, 'public', 'brain-surface.bin')

const SAMPLE_COUNT    = 30_000
const CURVATURE_BIAS  = 2.8   // higher → stronger gyral clustering (try 2–4)
const SULCUS_FLOOR    = 0.04  // minimum relative sampling weight for sulci

// ─── 1. Parse OBJ ─────────────────────────────────────────────────────────────

const raw = fs.readFileSync(OBJ_PATH, 'utf8').split('\n')

const verts  = []   // [x, y, z, ...]
const vnorms = []   // [nx, ny, nz, ...]
// Per triangle: [vi0, vi1, vi2, ni0, ni1, ni2]
const faces  = []

for (const line of raw) {
  const t = line.trimStart()
  if (t.startsWith('vn ')) {
    const p = t.split(/\s+/)
    vnorms.push(parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3]))
    continue
  }
  if (t.startsWith('v ') && t[1] === ' ') {
    const p = t.split(/\s+/)
    verts.push(parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3]))
    continue
  }
  if (t.startsWith('f ')) {
    const tokens = t.split(/\s+/).slice(1).filter(Boolean)
    const vIdx = [], nIdx = []
    for (const tok of tokens) {
      const parts = tok.split('/')
      vIdx.push(parseInt(parts[0], 10) - 1)
      nIdx.push(parts[2] ? parseInt(parts[2], 10) - 1 : 0)
    }
    for (let i = 1; i < vIdx.length - 1; i++) {
      faces.push(
        vIdx[0], vIdx[i], vIdx[i + 1],
        nIdx[0], nIdx[i], nIdx[i + 1],
      )
    }
  }
}

const numVerts   = verts.length / 3
const faceCount  = faces.length / 6
console.log(`Vertices: ${numVerts}  Normals: ${vnorms.length/3}  Triangles: ${faceCount}`)

// ─── 2. Bounding box, centroid, scale ─────────────────────────────────────────

let minX = Infinity, maxX = -Infinity
let minY = Infinity, maxY = -Infinity
let minZ = Infinity, maxZ = -Infinity
for (let i = 0; i < verts.length; i += 3) {
  const x = verts[i], y = verts[i+1], z = verts[i+2]
  if (x < minX) minX = x; if (x > maxX) maxX = x
  if (y < minY) minY = y; if (y > maxY) maxY = y
  if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
}
const cx = (minX + maxX) / 2
const cy = (minY + maxY) / 2
const cz = (minZ + maxZ) / 2
const maxSpan = Math.max(maxX-minX, maxY-minY, maxZ-minZ)
const scale   = (1.15 * 2) / maxSpan
console.log(`Centre: (${cx.toFixed(3)}, ${cy.toFixed(3)}, ${cz.toFixed(3)})  Scale: ${scale.toFixed(4)}`)

// ─── 3. Vertex adjacency graph ────────────────────────────────────────────────

// Map each vertex to its first associated normal index (for curvature)
const vertToNorm = new Int32Array(numVerts).fill(-1)
const adjSets    = Array.from({ length: numVerts }, () => new Set())

for (let fi = 0; fi < faceCount; fi++) {
  const a = faces[fi*6], b = faces[fi*6+1], c = faces[fi*6+2]
  const na = faces[fi*6+3], nb = faces[fi*6+4], nc = faces[fi*6+5]
  if (vertToNorm[a] < 0) vertToNorm[a] = na
  if (vertToNorm[b] < 0) vertToNorm[b] = nb
  if (vertToNorm[c] < 0) vertToNorm[c] = nc
  adjSets[a].add(b); adjSets[a].add(c)
  adjSets[b].add(a); adjSets[b].add(c)
  adjSets[c].add(a); adjSets[c].add(b)
}

// ─── 4. Laplacian mean curvature ─────────────────────────────────────────────
//
// K(v) = −dot( L(v), N(v) ) / |L(v)|
// where L(v) = avg(neighbours) − v  (uniform Laplacian)
//
// K > 0: convex surface → gyral crown
// K < 0: concave surface → sulcal floor

const rawK = new Float64Array(numVerts)

for (let vi = 0; vi < numVerts; vi++) {
  const nbrs = adjSets[vi]
  if (nbrs.size === 0) continue

  let lx = 0, ly = 0, lz = 0
  for (const ni of nbrs) {
    lx += verts[ni*3]; ly += verts[ni*3+1]; lz += verts[ni*3+2]
  }
  lx = lx/nbrs.size - verts[vi*3]
  ly = ly/nbrs.size - verts[vi*3+1]
  lz = lz/nbrs.size - verts[vi*3+2]

  const len = Math.sqrt(lx*lx + ly*ly + lz*lz) || 1

  const ni = vertToNorm[vi] >= 0 ? vertToNorm[vi] : vi
  const nx = vnorms[ni*3] || 0
  const ny = vnorms[ni*3+1] || 0
  const nz = vnorms[ni*3+2] || 0

  // Negative dot because inward-pointing Laplacian on convex surface
  rawK[vi] = -( lx*nx + ly*ny + lz*nz ) / len
}

// Normalise to zero mean, unit std, then clamp to [−1, +1]
let kSum = 0, kSum2 = 0
for (let vi = 0; vi < numVerts; vi++) { kSum += rawK[vi]; kSum2 += rawK[vi]*rawK[vi] }
const kMean = kSum / numVerts
const kStd  = Math.sqrt(kSum2/numVerts - kMean*kMean) || 1

const curvature = new Float32Array(numVerts)
for (let vi = 0; vi < numVerts; vi++) {
  curvature[vi] = Math.max(-1, Math.min(1, (rawK[vi] - kMean) / kStd))
}

// Quick stats
let kMin = Infinity, kMax = -Infinity, kPos = 0
for (let vi = 0; vi < numVerts; vi++) {
  if (curvature[vi] < kMin) kMin = curvature[vi]
  if (curvature[vi] > kMax) kMax = curvature[vi]
  if (curvature[vi] > 0) kPos++
}
console.log(`Curvature normalised range: [${kMin.toFixed(3)}, ${kMax.toFixed(3)}]`)
console.log(`Gyral vertices (K > 0): ${kPos} / ${numVerts}  (${(100*kPos/numVerts).toFixed(1)}%)`)

// ─── 5. Triangle areas + curvature-biased CDF ────────────────────────────────

const geoArea    = new Float64Array(faceCount)
const wArea      = new Float64Array(faceCount)
let   totalWArea = 0

for (let fi = 0; fi < faceCount; fi++) {
  const ai = faces[fi*6]   * 3
  const bi = faces[fi*6+1] * 3
  const ci = faces[fi*6+2] * 3

  const ex = verts[bi]-verts[ai], ey = verts[bi+1]-verts[ai+1], ez = verts[bi+2]-verts[ai+2]
  const fx = verts[ci]-verts[ai], fy = verts[ci+1]-verts[ai+1], fz = verts[ci+2]-verts[ai+2]
  const area = 0.5 * Math.sqrt(
    (ey*fz-ez*fy)**2 + (ez*fx-ex*fz)**2 + (ex*fy-ey*fx)**2
  )
  geoArea[fi] = area

  // Average curvature of triangle's 3 vertices
  const avgK = ( curvature[faces[fi*6]]
               + curvature[faces[fi*6+1]]
               + curvature[faces[fi*6+2]] ) / 3

  // Gyral triangles get weight up to (1 + BIAS), sulcal triangles clamped to SULCUS_FLOOR
  const w = Math.max(SULCUS_FLOOR, 1.0 + CURVATURE_BIAS * avgK)
  wArea[fi]    = area * w
  totalWArea  += wArea[fi]
}

// Weighted CDF
const cdf = new Float64Array(faceCount)
cdf[0] = wArea[0] / totalWArea
for (let fi = 1; fi < faceCount; fi++) cdf[fi] = cdf[fi-1] + wArea[fi] / totalWArea

// How many times more likely is a strong gyrus vs a strong sulcus?
const exampleGyrus  = Math.max(SULCUS_FLOOR, 1.0 + CURVATURE_BIAS *  0.8)
const exampleSulcus = Math.max(SULCUS_FLOOR, 1.0 + CURVATURE_BIAS * -0.8)
console.log(`Sampling bias: gyral crown is ${(exampleGyrus/exampleSulcus).toFixed(1)}× more likely than sulcal floor`)

// ─── 6. Coordinate transforms ─────────────────────────────────────────────────
// OBJ X (medial-lateral)     → Three.js Z  (depth, right hemi faces camera)
// OBJ Y (inferior-superior)  → Three.js Y  (up = up)
// OBJ Z (anterior-posterior) → Three.js X  (negated: frontal on screen-left)

function transformPoint(ox, oy, oz) {
  return [
    -(oz - cz) * scale,
     (oy - cy) * scale,
    -(ox - cx) * scale,
  ]
}
function transformNormal(nx, ny, nz) {
  // Same rotation as position; no translation or scale
  const tx = -nz, ty = ny, tz = -nx
  const len = Math.sqrt(tx*tx + ty*ty + tz*tz) || 1
  return [tx/len, ty/len, tz/len]
}

// ─── 7. Curvature-biased surface sampling ─────────────────────────────────────

let lcgS = 12345
function lcg() {
  lcgS = (Math.imul(1664525, lcgS) + 1013904223) | 0
  return ((lcgS >>> 0) + 0.5) / 0x100000000
}
function pickTriangle(r) {
  let lo = 0, hi = faceCount - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (cdf[mid] < r) lo = mid + 1
    else hi = mid
  }
  return lo
}

// Output: [px, py, pz, nx, ny, nz] per sample
const output = new Float32Array(SAMPLE_COUNT * 6)

for (let si = 0; si < SAMPLE_COUNT; si++) {
  const fi  = pickTriangle(lcg())
  const vi0 = faces[fi*6]   * 3
  const vi1 = faces[fi*6+1] * 3
  const vi2 = faces[fi*6+2] * 3
  const ni0 = faces[fi*6+3] * 3
  const ni1 = faces[fi*6+4] * 3
  const ni2 = faces[fi*6+5] * 3

  const r1 = lcg(), r2 = lcg()
  const sr1 = Math.sqrt(r1)
  const u = 1 - sr1, v = sr1*(1-r2), w = sr1*r2

  const px = u*verts[vi0] + v*verts[vi1] + w*verts[vi2]
  const py = u*verts[vi0+1] + v*verts[vi1+1] + w*verts[vi2+1]
  const pz = u*verts[vi0+2] + v*verts[vi1+2] + w*verts[vi2+2]

  const onx = u*vnorms[ni0] + v*vnorms[ni1] + w*vnorms[ni2]
  const ony = u*vnorms[ni0+1] + v*vnorms[ni1+1] + w*vnorms[ni2+1]
  const onz = u*vnorms[ni0+2] + v*vnorms[ni1+2] + w*vnorms[ni2+2]

  const [tx, ty, tz] = transformPoint(px, py, pz)
  const [nx, ny, nz] = transformNormal(onx, ony, onz)

  output[si*6]   = tx; output[si*6+1] = ty; output[si*6+2] = tz
  output[si*6+3] = nx; output[si*6+4] = ny; output[si*6+5] = nz
}

// ─── 8. Write ─────────────────────────────────────────────────────────────────

fs.writeFileSync(OUT_PATH, Buffer.from(output.buffer))
const kb = (output.buffer.byteLength / 1024).toFixed(1)
console.log(`\nWrote ${SAMPLE_COUNT} samples → ${OUT_PATH}  (${kb} KB)`)
console.log(`Format: [px py pz nx ny nz] × ${SAMPLE_COUNT}`)
