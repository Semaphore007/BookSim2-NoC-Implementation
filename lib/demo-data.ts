/**
 * DEMO DATA — illustrative curves only.
 * These values are NOT experimental results and were not produced by BookSim.
 */

export type Point = { x: number; y: number }
export type Series = { name: string; color: string; points: Point[] }

const rates = [0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]

const latencyCurve = (base: number, sat: number) =>
  rates.map((x) => ({
    x,
    y: Number((base + base * 0.9 * (x / sat) ** 2 + (x > sat * 0.85 ? (x - sat * 0.85) * 900 : 0)).toFixed(1)),
  }))

const throughputCurve = (sat: number) =>
  rates.map((x) => ({ x, y: Number(Math.min(x, sat - (x > sat ? 0 : (sat - x) * 0.04)).toFixed(3)) }))

export const demoLatencyData: Series[] = [
  { name: 'Mesh 8×8 (demo)', color: 'var(--cyan)', points: latencyCurve(22, 0.34) },
  { name: 'Torus 8×8 (demo)', color: 'var(--amber)', points: latencyCurve(17, 0.42) },
]

export const demoThroughputData: Series[] = [
  { name: 'Mesh 8×8 (demo)', color: 'var(--cyan)', points: throughputCurve(0.34) },
  { name: 'Torus 8×8 (demo)', color: 'var(--amber)', points: throughputCurve(0.42) },
]

export const demoMetrics = [
  { label: 'Avg. Packet Latency', value: '~22 cycles', note: 'Low-load, demo' },
  { label: 'Throughput', value: '~0.34', note: 'flits/node/cycle, demo' },
  { label: 'Saturation Point', value: '~0.34', note: 'injection rate, demo' },
  { label: 'Avg. Hop Count', value: '~5.3', note: '8×8 mesh, uniform, demo' },
]
