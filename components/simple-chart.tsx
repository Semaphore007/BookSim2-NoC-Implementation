import type { Series } from '@/lib/demo-data'

const W = 520
const H = 300
const P = { l: 52, r: 16, t: 16, b: 44 }

const niceMax = (v: number) => {
  if (v <= 0) return 1
  const mag = 10 ** Math.floor(Math.log10(v))
  const n = v / mag
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag
}

export function SimpleChart({
  title,
  series,
  xLabel,
  yLabel,
  badge,
}: {
  title: string
  series: Series[]
  xLabel: string
  yLabel: string
  badge?: React.ReactNode
}) {
  const all = series.flatMap((s) => s.points)
  const xMax = niceMax(Math.max(...all.map((p) => p.x), 0.01))
  const yMax = niceMax(Math.max(...all.map((p) => p.y), 0.01) * 1.05)
  const sx = (x: number) => P.l + (x / xMax) * (W - P.l - P.r)
  const sy = (y: number) => H - P.b - (Math.min(y, yMax) / yMax) * (H - P.t - P.b)
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  const fmt = (v: number) => (v >= 10 ? Math.round(v).toString() : Number(v.toFixed(2)).toString())

  return (
    <figure className="rounded-2xl border border-border bg-card/60 p-5">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-serif text-lg font-semibold">{title}</span>
        {badge}
      </figcaption>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[440px]" role="img" aria-label={`${title} line chart`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={P.l} x2={W - P.r} y1={sy(t * yMax)} y2={sy(t * yMax)} stroke="var(--border)" />
              <text x={P.l - 8} y={sy(t * yMax) + 4} textAnchor="end" fontSize="11" className="fill-muted-foreground font-mono">
                {fmt(t * yMax)}
              </text>
              <text x={sx(t * xMax)} y={H - P.b + 18} textAnchor="middle" fontSize="11" className="fill-muted-foreground font-mono">
                {fmt(t * xMax)}
              </text>
            </g>
          ))}
          <line x1={P.l} x2={P.l} y1={P.t} y2={H - P.b} stroke="var(--muted-foreground)" strokeOpacity=".5" />
          <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="var(--muted-foreground)" strokeOpacity=".5" />
          <text x={(W + P.l) / 2} y={H - 6} textAnchor="middle" fontSize="12" className="fill-foreground">
            {xLabel}
          </text>
          <text x={14} y={(H - P.b) / 2} textAnchor="middle" fontSize="12" className="fill-foreground" transform={`rotate(-90 14 ${(H - P.b) / 2})`}>
            {yLabel}
          </text>
          {series.map((s) => (
            <g key={s.name}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                points={s.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
              />
              {s.points.map((p) => (
                <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill="var(--background)" stroke={s.color} strokeWidth="2">
                  <title>{`${s.name}: x=${p.x}, y=${p.y}`}</title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded" style={{ background: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
    </figure>
  )
}
