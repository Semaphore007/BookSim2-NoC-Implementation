'use client'

import { useId, useState } from 'react'
import { RotateCcw, Upload } from 'lucide-react'
import { SimpleChart } from '@/components/simple-chart'
import { MetricCard } from '@/components/metric-card'
import { DemoBadge } from '@/components/section-title'
import { demoLatencyData, demoMetrics, demoThroughputData, type Series } from '@/lib/demo-data'

type Imported = { name: string; latency: Series[]; throughput: Series[] }

function parseCsv(text: string, fileName: string): Imported {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const xi = header.findIndex((h) => h.includes('injection') || h === 'rate' || h === 'x')
  const li = header.findIndex((h) => h.includes('latency'))
  const ti = header.findIndex((h) => h.includes('throughput') || h.includes('accepted'))
  if (xi < 0 || (li < 0 && ti < 0)) {
    throw new Error('CSV needs an injection_rate column and a latency and/or throughput column.')
  }
  const rows = lines
    .slice(1)
    .map((l) => l.split(',').map((c) => Number(c.trim())))
    .filter((r) => Number.isFinite(r[xi]))
    .sort((a, b) => a[xi] - b[xi])
  const name = fileName.replace(/\.csv$/i, '')
  const mk = (i: number, color: string): Series[] =>
    i < 0 ? [] : [{ name, color, points: rows.filter((r) => Number.isFinite(r[i])).map((r) => ({ x: r[xi], y: r[i] })) }]
  return { name, latency: mk(li, 'var(--cyan)'), throughput: mk(ti, 'var(--amber)') }
}

export function ResultsDashboard() {
  const inputId = useId()
  const [data, setData] = useState<Imported | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onFile = async (file?: File) => {
    if (!file) return
    try {
      setData(parseCsv(await file.text(), file.name))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not parse file.')
    }
  }

  const badge = data ? (
    <span className="rounded-full border border-cyan-glow/50 bg-cyan-glow/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-glow">
      Imported: {data.name}
    </span>
  ) : (
    <DemoBadge />
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {badge}
          <span className="text-sm text-muted-foreground">
            {data ? 'Showing data from your CSV (parsed locally in the browser).' : 'Placeholder curves — not experimental results.'}
          </span>
        </div>
        <div className="flex gap-2">
          <label
            htmlFor={inputId}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-electric px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3d7bff] focus-within:outline-2 focus-within:outline-cyan-glow"
          >
            <Upload className="size-4" aria-hidden="true" /> Import Real Results
            <input
              id={inputId}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => {
                onFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
          {data && (
            <button
              type="button"
              onClick={() => setData(null)}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-cyan-glow/60"
            >
              <RotateCcw className="size-4" aria-hidden="true" /> Demo data
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}

      {!data && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {demoMetrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {(!data || data.latency.length > 0) && (
          <SimpleChart
            title="Latency vs Injection Rate"
            series={data ? data.latency : demoLatencyData}
            xLabel="Injection rate"
            yLabel="Latency (cycles)"
            badge={badge}
          />
        )}
        {(!data || data.throughput.length > 0) && (
          <SimpleChart
            title="Throughput vs Injection Rate"
            series={data ? data.throughput : demoThroughputData}
            xLabel="Injection rate"
            yLabel="Accepted throughput"
            badge={badge}
          />
        )}
      </div>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Expected CSV header: injection_rate,latency,throughput
      </p>
    </div>
  )
}
