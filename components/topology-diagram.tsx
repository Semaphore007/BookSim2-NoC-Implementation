type Kind = 'mesh' | 'torus' | 'butterfly' | 'fattree'

const stroke = 'var(--cyan)'

function Node({ x, y }: { x: number; y: number }) {
  return <rect x={x - 7} y={y - 7} width="14" height="14" rx="3" fill="#081a36" stroke={stroke} strokeWidth="1.5" />
}

function Mesh({ torus }: { torus?: boolean }) {
  const p = [25, 60, 95]
  return (
    <>
      {p.map((y) =>
        p.slice(0, -1).map((x, i) => <line key={`h${x}${y}`} x1={x} y1={y} x2={p[i + 1]} y2={y} stroke={stroke} strokeOpacity=".5" />),
      )}
      {p.map((x) =>
        p.slice(0, -1).map((y, i) => <line key={`v${x}${y}`} x1={x} y1={y} x2={x} y2={p[i + 1]} stroke={stroke} strokeOpacity=".5" />),
      )}
      {torus &&
        p.map((v) => (
          <g key={`w${v}`} fill="none" stroke="var(--violet)" strokeOpacity=".8" strokeDasharray="3 3">
            <path d={`M25 ${v} C 5 ${v - 14}, 115 ${v - 14}, 95 ${v}`} />
            <path d={`M${v} 25 C ${v - 14} 5, ${v - 14} 115, ${v} 95`} />
          </g>
        ))}
      {p.flatMap((y) => p.map((x) => <Node key={`${x}${y}`} x={x} y={y} />))}
    </>
  )
}

function Butterfly() {
  const cols = [20, 60, 100]
  const rows = [25, 50, 75, 100]
  return (
    <>
      {cols.slice(0, -1).flatMap((x, c) =>
        rows.flatMap((y, r) => {
          const partner = rows[r ^ (c === 0 ? 2 : 1)]
          return [
            <line key={`s${x}${y}`} x1={x} y1={y} x2={cols[c + 1]} y2={y} stroke={stroke} strokeOpacity=".5" />,
            <line key={`c${x}${y}`} x1={x} y1={y} x2={cols[c + 1]} y2={partner} stroke={stroke} strokeOpacity=".5" />,
          ]
        }),
      )}
      {cols.flatMap((x) => rows.map((y) => <Node key={`${x}${y}`} x={x} y={y} />))}
    </>
  )
}

function FatTree() {
  const top = [60]
  const mid = [35, 85]
  const leaf = [20, 47, 73, 100]
  return (
    <>
      {mid.map((x) => (
        <g key={x}>
          <line x1={60} y1={22} x2={x} y2={60} stroke={stroke} strokeOpacity=".5" strokeWidth="2.5" />
        </g>
      ))}
      {leaf.map((x, i) => (
        <line key={x} x1={mid[i < 2 ? 0 : 1]} y1={60} x2={x} y2={98} stroke={stroke} strokeOpacity=".5" />
      ))}
      {top.map((x) => <Node key={x} x={x} y={22} />)}
      {mid.map((x) => <Node key={x} x={x} y={60} />)}
      {leaf.map((x) => <Node key={x} x={x} y={98} />)}
    </>
  )
}

const labels: Record<Kind, string> = { mesh: 'Mesh', torus: 'Torus', butterfly: 'Butterfly', fattree: 'Fat Tree' }

export function TopologyDiagram({ kind }: { kind: Kind }) {
  return (
    <figure className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
      <svg viewBox="0 0 120 120" className="size-28" role="img" aria-label={`${labels[kind]} topology diagram`}>
        {kind === 'mesh' && <Mesh />}
        {kind === 'torus' && <Mesh torus />}
        {kind === 'butterfly' && <Butterfly />}
        {kind === 'fattree' && <FatTree />}
      </svg>
      <figcaption className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">{labels[kind]}</figcaption>
    </figure>
  )
}
