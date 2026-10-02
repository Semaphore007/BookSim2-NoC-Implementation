import type { Routing, SimConfig, Topology, Traffic } from '@/lib/noc'

export type BenchmarkSample = {
  topology: Topology
  k: number
  routing: Routing
  traffic: Traffic
  vcs: number
  injectionRate: number
  avgPacketLatency: number
  throughput: number
}

export type BenchmarkEstimate = {
  latency: number
  throughput: number
  kind: 'measured' | 'interpolated'
  lowerRate: number
  upperRate: number
}

const configColumns = ['topology', 'k', 'routing', 'traffic', 'vcs'] as const
const trafficOptions: Traffic[] = ['uniform', 'transpose', 'bitcomp', 'bitrev', 'hotspot']

function isTraffic(value: string | undefined): value is Traffic {
  return value !== undefined && trafficOptions.some((traffic) => traffic === value)
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"' && field.length === 0) {
      quoted = true
    } else if (char === ',') {
      row.push(field.trim())
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field.trim())
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (quoted) throw new Error('CSV contains an unterminated quoted field.')
  row.push(field.trim())
  if (row.some((cell) => cell.length > 0)) rows.push(row)
  return rows
}

function numberCell(value: string, column: string, row: number) {
  const parsed = Number(value)
  if (!value || !Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Row ${row}: "${column}" must be a finite, non-negative number.`)
  }
  return parsed
}

function requiredColumn(column: string | undefined, name: string) {
  if (!column) throw new Error(`CSV is missing required measurement column "${name}".`)
  return column
}

function sampleKey(sample: BenchmarkSample) {
  return [
    sample.topology,
    sample.k,
    sample.routing,
    sample.traffic,
    sample.vcs,
    sample.injectionRate,
  ].join('|')
}

export function parseBenchmarkCsv(
  text: string,
  defaultConfig?: Pick<SimConfig, 'topology' | 'k' | 'routing' | 'traffic' | 'vcs'>,
): BenchmarkSample[] {
  const rows = parseCsv(text)
  if (rows.length < 2) throw new Error('CSV must include a header and at least one data row.')

  const headers = rows[0].map((header, index) => (index === 0 ? header.replace(/^\uFEFF/, '') : header).toLowerCase())
  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index)
  if (duplicates.length > 0) throw new Error(`CSV contains duplicate column "${duplicates[0]}".`)
  const injectionRateColumn = ['injection_rate', 'rate'].find((column) => headers.includes(column))
  const latencyColumn = ['avg_packet_latency', 'avg_latency', 'latency'].find((column) => headers.includes(column))
  const throughputColumn = ['throughput', 'accepted_throughput', 'avg_accepted_rate'].find((column) =>
    headers.includes(column),
  )
  const rateColumn = requiredColumn(injectionRateColumn, 'injection_rate')
  const latencyValueColumn = requiredColumn(latencyColumn, 'avg_packet_latency')
  const throughputValueColumn = requiredColumn(throughputColumn, 'throughput')

  const hasConfigColumns = configColumns.some((column) => headers.includes(column))
  const missingConfig = hasConfigColumns ? configColumns.filter((column) => !headers.includes(column)) : []
  if (missingConfig.length > 0) {
    throw new Error(`CSV must include all configuration columns or none: ${missingConfig.join(', ')}.`)
  }
  if (!hasConfigColumns && !defaultConfig) {
    throw new Error('CSV has no configuration columns. Select the configuration that these measurements belong to and try again.')
  }

  const columnIndex: Record<string, number> = Object.fromEntries(headers.map((header, index) => [header, index]))
  const seen = new Set<string>()
  return rows.slice(1).map((cells, index) => {
    const rowNumber = index + 2
    if (cells.length !== headers.length) {
      throw new Error(`Row ${rowNumber}: expected ${headers.length} columns, found ${cells.length}.`)
    }
    const value = (column: string) => {
      const cell = cells[columnIndex[column]]
      if (cell === undefined) throw new Error(`Row ${rowNumber}: missing "${column}" value.`)
      return cell
    }
    const topology = hasConfigColumns ? value('topology').toLowerCase() : defaultConfig?.topology
    const routing = hasConfigColumns ? value('routing').toLowerCase() : defaultConfig?.routing
    const traffic = hasConfigColumns ? value('traffic').toLowerCase() : defaultConfig?.traffic
    if (topology !== 'mesh' && topology !== 'torus') {
      throw new Error(`Row ${rowNumber}: topology must be "mesh" or "torus".`)
    }
    if (routing !== 'xy' && routing !== 'camar') {
      throw new Error(`Row ${rowNumber}: routing must be "xy" or "camar".`)
    }
    if (!isTraffic(traffic)) {
      throw new Error(`Row ${rowNumber}: traffic must be uniform, transpose, bitcomp, bitrev, or hotspot.`)
    }

    const k = hasConfigColumns ? numberCell(value('k'), 'k', rowNumber) : defaultConfig?.k
    const vcs = hasConfigColumns ? numberCell(value('vcs'), 'vcs', rowNumber) : defaultConfig?.vcs
    if (k === undefined || vcs === undefined) throw new Error('A configuration is required for these measurements.')
    if (!Number.isInteger(k) || k < 2) throw new Error(`Row ${rowNumber}: "k" must be an integer greater than 1.`)
    if (!Number.isInteger(vcs) || vcs < 1) throw new Error(`Row ${rowNumber}: "vcs" must be a positive integer.`)

    const sample: BenchmarkSample = {
      topology,
      k,
      routing,
      traffic,
      vcs,
      injectionRate: numberCell(value(rateColumn), rateColumn, rowNumber),
      avgPacketLatency: numberCell(value(latencyValueColumn), latencyValueColumn, rowNumber),
      throughput: numberCell(value(throughputValueColumn), throughputValueColumn, rowNumber),
    }
    const key = sampleKey(sample)
    if (seen.has(key)) throw new Error(`Row ${rowNumber}: duplicate configuration and injection_rate entry.`)
    seen.add(key)
    return sample
  })
}

export function estimateFromBenchmarks(
  samples: BenchmarkSample[],
  config: SimConfig,
): BenchmarkEstimate | undefined {
  const matching = samples
    .filter(
      (sample) =>
        sample.topology === config.topology &&
        sample.k === config.k &&
        sample.routing === config.routing &&
        sample.traffic === config.traffic &&
        sample.vcs === config.vcs,
    )
    .sort((a, b) => a.injectionRate - b.injectionRate)

  const exact = matching.find((sample) => sample.injectionRate === config.injectionRate)
  if (exact) {
    return {
      latency: exact.avgPacketLatency,
      throughput: exact.throughput,
      kind: 'measured',
      lowerRate: exact.injectionRate,
      upperRate: exact.injectionRate,
    }
  }

  const lower = [...matching].reverse().find((sample) => sample.injectionRate < config.injectionRate)
  const upper = matching.find((sample) => sample.injectionRate > config.injectionRate)
  if (!lower || !upper) return undefined

  const ratio = (config.injectionRate - lower.injectionRate) / (upper.injectionRate - lower.injectionRate)
  return {
    latency: lower.avgPacketLatency + ratio * (upper.avgPacketLatency - lower.avgPacketLatency),
    throughput: lower.throughput + ratio * (upper.throughput - lower.throughput),
    kind: 'interpolated',
    lowerRate: lower.injectionRate,
    upperRate: upper.injectionRate,
  }
}
