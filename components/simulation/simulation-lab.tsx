'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { SimulationControls } from '@/components/simulation/simulation-controls'
import { NoCVisualizer } from '@/components/simulation/noc-visualizer'
import { RoutingDecision } from '@/components/simulation/routing-decision'
import { WarningDisclosure } from '@/components/warning-disclosure'
import { computeRoute, destinationFor, type SimConfig, trafficLabels } from '@/lib/noc'
import { estimateFromBenchmarks, parseBenchmarkCsv, type BenchmarkSample } from '@/lib/benchmark-data'

const initialConfig: SimConfig = {
  topology: 'mesh',
  k: 4,
  routing: 'camar',
  traffic: 'bitcomp',
  vcs: 4,
  injectionRate: 0.15,
}

export function SimulationLab() {
  const [draft, setDraft] = useState<SimConfig>(initialConfig)
  const [config, setConfig] = useState<SimConfig>(initialConfig)
  const [source, setSource] = useState(0)
  const [seed, setSeed] = useState(1)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [benchmark, setBenchmark] = useState<{ fileName: string; samples: BenchmarkSample[] }>()
  const [benchmarkError, setBenchmarkError] = useState('')

  const safeSource = source < config.k * config.k ? source : 0
  const destination = useMemo(
    () => destinationFor(safeSource, config.k, config.traffic, seed),
    [safeSource, config.k, config.traffic, seed],
  )
  const hops = useMemo(() => computeRoute(safeSource, destination, config), [safeSource, destination, config])
  const path = useMemo(() => [safeSource, ...hops.map((h) => h.to)], [safeSource, hops])
  const estimate = useMemo(
    () => (benchmark ? estimateFromBenchmarks(benchmark.samples, config) : undefined),
    [benchmark, config],
  )
  const done = step >= hops.length

  useEffect(() => {
    if (!playing) return
    if (done) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setStep((s) => s + 1), 700)
    return () => clearTimeout(id)
  }, [playing, step, done])

  const run = () => {
    const nextSeed = seed + 1
    const nodeCount = draft.k * draft.k
    const currentSource = source < nodeCount ? source : 0
    const destinationForCurrent = destinationFor(currentSource, draft.k, draft.traffic, nextSeed)
    const nextSource =
      destinationForCurrent === currentSource
        ? Array.from({ length: nodeCount }, (_, id) => id).find(
            (id) => destinationFor(id, draft.k, draft.traffic, nextSeed) !== id,
          ) ?? currentSource
        : currentSource
    setConfig(draft)
    setSource(nextSource)
    setSeed(nextSeed)
    setStep(0)
    setPlaying(true)
  }

  const importBenchmark = async (file?: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setBenchmarkError('CSV must be 5 MB or smaller. The currently loaded dataset was not changed.')
      return
    }
    try {
      const samples = parseBenchmarkCsv(await file.text(), draft)
      setBenchmark({ fileName: file.name, samples })
      setBenchmarkError('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The selected CSV could not be read.'
      setBenchmarkError(`${message} The currently loaded dataset was not changed.`)
    }
  }

  const clearBenchmark = () => {
    setBenchmark(undefined)
    setBenchmarkError('')
  }

  const selectSource = (id: number) => {
    setSource(id)
    setStep(0)
    setPlaying(false)
  }

  const reset = () => {
    setStep(0)
    setPlaying(false)
  }

  const ctrl =
    'flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm transition hover:border-cyan-glow/60 disabled:opacity-40'

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr_320px]">
      <SimulationControls
        config={draft}
        onChange={setDraft}
        onRun={run}
        benchmarkFileName={benchmark?.fileName}
        benchmarkSampleCount={benchmark?.samples.length ?? 0}
        benchmarkError={benchmarkError}
        onBenchmarkFile={importBenchmark}
        onClearBenchmark={clearBenchmark}
      />

      <section className="rounded-2xl border border-border bg-card p-5 glow-border" aria-label="Network visualization">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="rounded-full border border-cyan-glow/50 bg-cyan-glow/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-glow">
              Interactive visualization
            </span>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {config.topology} {config.k}×{config.k} · {config.routing.toUpperCase()} · {trafficLabels[config.traffic]} ·{' '}
              {config.vcs} VC · rate {config.injectionRate.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className={ctrl} onClick={() => setPlaying(true)} disabled={playing || done || hops.length === 0}>
              <Play className="size-3.5" aria-hidden="true" /> Start
            </button>
            <button type="button" className={ctrl} onClick={() => setPlaying(false)} disabled={!playing}>
              <Pause className="size-3.5" aria-hidden="true" /> Pause
            </button>
            <button type="button" className={ctrl} onClick={reset}>
              <RotateCcw className="size-3.5" aria-hidden="true" /> Reset
            </button>
          </div>
        </div>

        <NoCVisualizer
          k={config.k}
          topology={config.topology}
          source={safeSource}
          destination={destination}
          path={path}
          hops={hops}
          step={step}
          onSelectSource={selectSource}
        />

        {hops.length === 0 && (
          <WarningDisclosure title="No route for this source" className="mt-3">
            This source maps to itself under {trafficLabels[config.traffic]}. Click another router.
          </WarningDisclosure>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
          {[
            ['Source', `Router ${safeSource}`],
            ['Destination', `Router ${destination}`],
            ['Current', `Router ${path[step] ?? safeSource}`],
            ['Hops', `${Math.min(step, hops.length)} / ${hops.length}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 overflow-x-auto whitespace-nowrap rounded-lg border border-border bg-background/40 p-3 font-mono text-sm">
          <span className="text-muted-foreground">Route: </span>
          {path.map((id, i) => (
            <span key={`${id}-${i}`}>
              <span className={i <= step ? 'text-cyan-glow' : ''}>{id}</span>
              {i < path.length - 1 && <span className="text-muted-foreground"> → </span>}
            </span>
          ))}
        </p>
        <section className="mt-5 rounded-xl border border-border bg-background/40 p-4" aria-live="polite">
          <h3 className="font-serif font-semibold">BookSim benchmark estimate</h3>
          {!benchmark ? (
            <WarningDisclosure title="No dataset loaded" className="mt-3">
              Route visualization remains available, but latency and throughput predictions are hidden until a dataset is loaded.
            </WarningDisclosure>
          ) : estimate ? (
            <>
              <dl className="mt-3 grid grid-cols-2 gap-3 font-mono text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Average packet latency</dt>
                  <dd className="mt-1">{estimate.latency.toFixed(2)} cycles</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Throughput (input units)</dt>
                  <dd className="mt-1">{estimate.throughput.toFixed(4)}</dd>
                </div>
              </dl>
              <WarningDisclosure title="About this estimate" className="mt-3">
                {estimate.kind === 'measured'
                  ? `Measured value at injection rate ${estimate.lowerRate}.`
                  : `Linear interpolation between measured rates ${estimate.lowerRate} and ${estimate.upperRate}; not a new BookSim run.`}
                {' '}Source: {benchmark.fileName}.
              </WarningDisclosure>
            </>
          ) : (
            <WarningDisclosure title="No matching benchmark" className="mt-3">
              No matching benchmark for this topology, size, routing, traffic, and VC configuration with measured rates on
              both sides of {config.injectionRate.toFixed(2)}. No estimate or extrapolation is shown.
            </WarningDisclosure>
          )}
        </section>
      </section>

      <RoutingDecision hop={hops[step]} destination={destination} routing={config.routing} />
    </div>
  )
}
