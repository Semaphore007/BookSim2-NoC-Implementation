'use client'

import { useState } from 'react'
import { ChevronDown, Play, SlidersHorizontal } from 'lucide-react'
import { type SimConfig, type Traffic, trafficLabels } from '@/lib/noc'
import { cn } from '@/lib/utils'

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm transition',
              value === o.value
                ? 'border-cyan-glow bg-cyan-glow/15 text-cyan-glow'
                : 'border-border text-muted-foreground hover:border-cyan-glow/40 hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function SimulationControls({
  config,
  onChange,
  onRun,
}: {
  config: SimConfig
  onChange: (c: SimConfig) => void
  onRun: () => void
}) {
  const [open, setOpen] = useState(true)
  const set = <K extends keyof SimConfig>(key: K, value: SimConfig[K]) => onChange({ ...config, [key]: value })

  return (
    <aside className="rounded-2xl border border-border bg-card/70" aria-label="Simulation controls">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sim-controls"
        className="flex w-full items-center justify-between gap-2 p-5 text-left lg:pointer-events-none"
      >
        <span className="flex items-center gap-2 font-medium">
          <SlidersHorizontal className="size-4 text-cyan-glow" aria-hidden="true" /> Configuration
        </span>
        <ChevronDown className={cn('size-4 transition lg:hidden', open && 'rotate-180')} aria-hidden="true" />
      </button>

      <div id="sim-controls" className={cn('space-y-5 px-5 pb-5', !open && 'hidden lg:block')}>
        <Segmented
          label="Topology"
          value={config.topology}
          options={[
            { value: 'mesh', label: 'Mesh' },
            { value: 'torus', label: 'Torus' },
          ]}
          onChange={(v) => set('topology', v)}
        />
        <Segmented
          label="Network"
          value={config.k}
          options={[4, 6, 8].map((k) => ({ value: k, label: `${k} × ${k}` }))}
          onChange={(v) => set('k', v)}
        />
        <Segmented
          label="Routing"
          value={config.routing}
          options={[
            { value: 'xy', label: 'XY' },
            { value: 'camar', label: 'CAMAR' },
          ]}
          onChange={(v) => set('routing', v)}
        />
        <div>
          <label htmlFor="traffic" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Traffic
          </label>
          <select
            id="traffic"
            value={config.traffic}
            onChange={(e) => set('traffic', e.target.value as Traffic)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-cyan-glow"
          >
            {(Object.keys(trafficLabels) as Traffic[]).map((t) => (
              <option key={t} value={t}>
                {trafficLabels[t]}
              </option>
            ))}
          </select>
        </div>
        <Segmented
          label="Virtual Channels"
          value={config.vcs}
          options={[1, 2, 4, 8].map((v) => ({ value: v, label: String(v) }))}
          onChange={(v) => set('vcs', v)}
        />
        <div>
          <label htmlFor="rate" className="mb-2 flex justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Injection Rate <span className="font-mono text-cyan-glow">{config.injectionRate.toFixed(2)}</span>
          </label>
          <input
            id="rate"
            type="range"
            min={0.01}
            max={0.5}
            step={0.01}
            value={config.injectionRate}
            onChange={(e) => set('injectionRate', Number(e.target.value))}
            className="w-full accent-[var(--cyan)]"
          />
        </div>
        <button
          type="button"
          onClick={onRun}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_-6px_var(--electric)] transition hover:bg-[#3d7bff]"
        >
          <Play className="size-4 fill-current" aria-hidden="true" /> Run Visualization
        </button>
        <p className="text-xs text-muted-foreground">Tip: click any router to set it as the source.</p>
      </div>
    </aside>
  )
}
