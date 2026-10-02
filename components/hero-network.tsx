const K = 4
const GAP = 100
const OFFSET = 50
const pos = (id: number) => ({ x: OFFSET + (id % K) * GAP, y: OFFSET + Math.floor(id / K) * GAP })

const highlighted = [0, 1, 5, 6, 10, 14, 15]
const secondary = [
  [12, 8, 9, 5, 4],
  [3, 7, 11, 10, 9],
]

const toPath = (ids: number[]) =>
  ids.map((id, i) => `${i === 0 ? 'M' : 'L'}${pos(id).x} ${pos(id).y}`).join(' ')

const links: [number, number][] = []
for (let id = 0; id < K * K; id++) {
  if (id % K < K - 1) links.push([id, id + 1])
  if (id + K < K * K) links.push([id, id + K])
}

export function HeroNetwork() {
  const mainPath = toPath(highlighted)
  return (
    <figure className="relative" aria-label="Animated 4 by 4 mesh Network-on-Chip with packets travelling between routers">
      <svg viewBox="0 0 400 400" className="h-auto w-full" role="img">
        <title>4×4 mesh NoC with an highlighted route from R0 to R15</title>
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--electric)" stopOpacity="0.2" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={pos(a).x}
            y1={pos(a).y}
            x2={pos(b).x}
            y2={pos(b).y}
            stroke="var(--electric)"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
        ))}

        <path
          d={mainPath}
          fill="none"
          stroke="var(--amber)"
          strokeWidth="3"
          strokeDasharray="8 4"
          className="animate-dash"
          filter="url(#glow)"
        />

        {Array.from({ length: K * K }, (_, id) => {
          const { x, y } = pos(id)
          const onPath = highlighted.includes(id)
          return (
            <g key={id}>
              <rect
                x={x - 22}
                y={y - 22}
                width="44"
                height="44"
                rx="8"
                fill="#081a36"
                stroke={onPath ? 'var(--cyan)' : 'var(--electric)'}
                strokeOpacity={onPath ? 1 : 0.6}
                strokeWidth="1.5"
              />
              <rect
                x={x - 11}
                y={y - 11}
                width="22"
                height="22"
                rx="4"
                fill="url(#core)"
                className="animate-router-pulse"
                style={{ animationDelay: `${(id % 5) * 0.4}s` }}
              />
              <text x={x} y={y + 36} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="10">
                R{id}
              </text>
            </g>
          )
        })}

        <circle r="6" fill="var(--cyan)" filter="url(#glow)">
          <animateMotion dur="4s" repeatCount="indefinite" path={mainPath} />
        </circle>
        {secondary.map((ids, i) => (
          <circle key={i} r="4" fill="var(--violet)" filter="url(#glow)">
            <animateMotion dur={`${3 + i}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" path={toPath(ids)} />
          </circle>
        ))}
      </svg>
      <figcaption className="mt-2 flex items-center justify-center gap-4 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-cyan-glow" /> packet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-amber-glow" /> route R0 → R15
        </span>
      </figcaption>
    </figure>
  )
}
