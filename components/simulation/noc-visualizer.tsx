'use client'

import { coords, type Hop, type Topology } from '@/lib/noc'

const GAP = 64
const M = 40

export function NoCVisualizer({
  k,
  topology,
  source,
  destination,
  path,
  hops,
  step,
  onSelectSource,
}: {
  k: number
  topology: Topology
  source: number
  destination: number
  path: number[]
  hops: Hop[]
  step: number
  onSelectSource: (id: number) => void
}) {
  const size = (k - 1) * GAP + M * 2
  const p = (id: number) => {
    const { x, y } = coords(id, k)
    return { x: M + x * GAP, y: M + y * GAP }
  }
  const node = k <= 4 ? 30 : k <= 6 ? 26 : 22
  const current = path[step] ?? source
  const travelled = new Set<string>()
  hops.slice(0, step).forEach((h) => travelled.add(`${Math.min(h.from, h.to)}-${Math.max(h.from, h.to)}`))
  const onRoute = new Set(path)
  const prevHop = hops[step - 1]
  const packet = p(current)

  const links: [number, number][] = []
  for (let id = 0; id < k * k; id++) {
    if (id % k < k - 1) links.push([id, id + 1])
    if (id + k < k * k) links.push([id, id + k])
  }

  const routeKey = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`
  const routeLinks = new Set(hops.map((h) => routeKey(h.from, h.to)))

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto h-auto w-full min-w-[320px] max-w-[560px]"
        role="img"
        aria-label={`${k} by ${k} ${topology} network. Packet from router ${source} to router ${destination}, currently at router ${current}.`}
      >
        <defs>
          <filter id="pkt-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {topology === 'torus' &&
          Array.from({ length: k }, (_, i) => {
            const rowWrap = routeLinks.has(routeKey(i * k, i * k + k - 1))
            const colWrap = routeLinks.has(routeKey(i, i + (k - 1) * k))
            const y = M + i * GAP
            const x = M + i * GAP
            const end = M + (k - 1) * GAP
            return (
              <g key={`wrap-${i}`} fill="none" strokeDasharray="3 4">
                <path
                  d={`M${M} ${y} Q ${M - 30} ${y - 18}, ${M - 8} ${y - 26} M${end} ${y} Q ${end + 30} ${y - 18}, ${end + 8} ${y - 26}`}
                  stroke={rowWrap ? 'var(--amber)' : 'var(--violet)'}
                  strokeOpacity={rowWrap ? 1 : 0.45}
                />
                <path
                  d={`M${x} ${M} Q ${x - 18} ${M - 30}, ${x - 26} ${M - 8} M${x} ${end} Q ${x - 18} ${end + 30}, ${x - 26} ${end + 8}`}
                  stroke={colWrap ? 'var(--amber)' : 'var(--violet)'}
                  strokeOpacity={colWrap ? 1 : 0.45}
                />
              </g>
            )
          })}

        {links.map(([a, b]) => {
          const key = routeKey(a, b)
          const isRoute = routeLinks.has(key)
          const done = travelled.has(key)
          return (
            <line
              key={key}
              x1={p(a).x}
              y1={p(a).y}
              x2={p(b).x}
              y2={p(b).y}
              stroke={done ? 'var(--cyan)' : isRoute ? 'var(--amber)' : 'var(--electric)'}
              strokeOpacity={isRoute ? 1 : 0.3}
              strokeWidth={isRoute ? 3 : 1.5}
              strokeDasharray={isRoute && !done ? '6 4' : undefined}
            />
          )
        })}

        {Array.from({ length: k * k }, (_, id) => {
          const { x, y } = p(id)
          const isSrc = id === source
          const isDst = id === destination
          const isCur = id === current
          const strokeColor = isSrc ? 'var(--cyan)' : isDst ? 'var(--violet)' : onRoute.has(id) ? 'var(--amber)' : 'var(--electric)'
          return (
            <g
              key={id}
              role="button"
              tabIndex={0}
              aria-label={`Set router ${id} as source`}
              onClick={() => onSelectSource(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectSource(id)
                }
              }}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-white"
            >
              <rect
                x={x - node / 2}
                y={y - node / 2}
                width={node}
                height={node}
                rx="5"
                fill={isCur ? '#0b2a52' : '#081a36'}
                stroke={strokeColor}
                strokeOpacity={onRoute.has(id) || isSrc || isDst ? 1 : 0.6}
                strokeWidth={isSrc || isDst ? 2.5 : 1.5}
              />
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize={k <= 4 ? 11 : 9} className="pointer-events-none fill-foreground font-mono">
                {id}
              </text>
            </g>
          )
        })}

        <g
          style={{
            transform: `translate(${packet.x}px, ${packet.y - node / 2 - 8}px)`,
            transition: prevHop?.wrap ? 'none' : 'transform 450ms ease-in-out',
          }}
        >
          <circle r="6" fill="var(--cyan)" filter="url(#pkt-glow)" />
        </g>
      </svg>

      <ul className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border-2 border-cyan-glow" /> Source
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border-2 border-violet-glow" /> Destination
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-amber-glow" /> Selected route
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-cyan-glow shadow-[0_0_6px_var(--cyan)]" /> Packet
        </li>
      </ul>
    </div>
  )
}
