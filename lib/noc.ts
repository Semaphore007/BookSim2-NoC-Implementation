export type Topology = 'mesh' | 'torus'
export type Routing = 'xy' | 'camar'
export type Traffic = 'uniform' | 'transpose' | 'bitcomp' | 'bitrev' | 'hotspot'
export type Direction = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'

export type SimConfig = {
  topology: Topology
  k: number
  routing: Routing
  traffic: Traffic
  vcs: number
  injectionRate: number
}

export type Candidate = { dir: Direction; next: number; credit: number; maxCredit: number }

export type Hop = {
  from: number
  to: number
  wrap: boolean
  candidates: Candidate[]
  selected: Direction
}

export const trafficLabels: Record<Traffic, string> = {
  uniform: 'Uniform',
  transpose: 'Transpose',
  bitcomp: 'Bit Complement',
  bitrev: 'Bit Reverse',
  hotspot: 'Hotspot',
}

export const coords = (id: number, k: number) => ({ x: id % k, y: Math.floor(id / k) })

const hash = (...values: number[]) => {
  let h = 2166136261
  for (const v of values) {
    h ^= v + 0x9e3779b9
    h = Math.imul(h, 16777619)
    h ^= h >>> 13
  }
  return ((h >>> 0) % 10000) / 10000
}

export function destinationFor(src: number, k: number, traffic: Traffic, seed: number) {
  const n = k * k
  const { x, y } = coords(src, k)
  switch (traffic) {
    case 'transpose':
      return x * k + y
    case 'bitcomp':
      return n - 1 - src
    case 'bitrev': {
      const bits = Math.ceil(Math.log2(n))
      let r = 0
      for (let i = 0; i < bits; i++) if (src & (1 << i)) r |= 1 << (bits - 1 - i)
      return r % n
    }
    case 'hotspot':
      return Math.floor(k / 2) * k + Math.floor(k / 2)
    default: {
      const d = Math.floor(hash(src, seed, 7) * (n - 1))
      return d >= src ? d + 1 : d
    }
  }
}

function minimalDirections(cur: number, dst: number, k: number, topology: Topology): Direction[] {
  const a = coords(cur, k)
  const b = coords(dst, k)
  const dirs: Direction[] = []
  if (topology === 'mesh') {
    if (b.x > a.x) dirs.push('EAST')
    if (b.x < a.x) dirs.push('WEST')
    if (b.y > a.y) dirs.push('SOUTH')
    if (b.y < a.y) dirs.push('NORTH')
    return dirs
  }
  const fx = (b.x - a.x + k) % k
  if (fx !== 0) dirs.push(fx <= k - fx ? 'EAST' : 'WEST')
  const fy = (b.y - a.y + k) % k
  if (fy !== 0) dirs.push(fy <= k - fy ? 'SOUTH' : 'NORTH')
  return dirs
}

function step(cur: number, dir: Direction, k: number) {
  const { x, y } = coords(cur, k)
  const nx = dir === 'EAST' ? (x + 1) % k : dir === 'WEST' ? (x - 1 + k) % k : x
  const ny = dir === 'SOUTH' ? (y + 1) % k : dir === 'NORTH' ? (y - 1 + k) % k : y
  const wrap = Math.abs(nx - x) > 1 || Math.abs(ny - y) > 1
  return { next: ny * k + nx, wrap }
}

const dirIndex: Record<Direction, number> = { EAST: 0, WEST: 1, NORTH: 2, SOUTH: 3 }

function creditFor(node: number, dir: Direction, cfg: SimConfig, seed: number, hotspot: number) {
  const maxCredit = cfg.vcs * 4
  const { x, y } = coords(node, cfg.k)
  const h = coords(hotspot, cfg.k)
  const nearHotspot = cfg.traffic === 'hotspot' ? Math.max(0, 1 - (Math.abs(x - h.x) + Math.abs(y - h.y)) / cfg.k) * 0.5 : 0
  const load = Math.min(0.95, hash(node, dirIndex[dir], seed) * cfg.injectionRate * 2.2 + nearHotspot)
  return { credit: Math.round(maxCredit * (1 - load)), maxCredit }
}

/** Illustrative path computation — not BookSim. Credits are synthetic. */
export function computeRoute(src: number, dst: number, cfg: SimConfig, seed: number): Hop[] {
  const hops: Hop[] = []
  const hotspot = Math.floor(cfg.k / 2) * cfg.k + Math.floor(cfg.k / 2)
  let cur = src
  let guard = 0
  while (cur !== dst && guard++ < cfg.k * 4) {
    const dirs = minimalDirections(cur, dst, cfg.k, cfg.topology)
    const candidates: Candidate[] = dirs.map((dir) => ({
      dir,
      next: step(cur, dir, cfg.k).next,
      ...creditFor(cur, dir, cfg, seed, hotspot),
    }))
    let selected = candidates[0]
    if (cfg.routing === 'camar' && candidates.length > 1) {
      selected = candidates.reduce((best, c) => (c.credit > best.credit ? c : best), candidates[0])
    }
    const { next, wrap } = step(cur, selected.dir, cfg.k)
    hops.push({ from: cur, to: next, wrap, candidates, selected: selected.dir })
    cur = next
  }
  return hops
}
