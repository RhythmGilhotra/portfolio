"use client";

// Clean, content-first backdrop whose whole surface reads as engineering:
// a subtle full-viewport circuit / service-network field, scattered code
// fragments, and labelled corner motifs drawn from the résumé (AI/ML,
// Java/Spring Boot, Python, REST APIs, databases, data pipelines, DSA, cloud).
// Everything sits at 5–14% opacity; a soft centre mask keeps content clean.

const ICE = "#8ab4d8";
const GOLD = "#d4af6a";

// Deterministic PRNG so server and client render identical markup (no
// hydration mismatch) while still looking scattered.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- Full-viewport circuit / network field ---- */
function CircuitField() {
  const W = 1440;
  const H = 900;
  const r = rng(97);
  const nodes = Array.from({ length: 46 }, () => ({
    x: Math.round(r() * W),
    y: Math.round(r() * H),
    gold: r() > 0.78,
    d: 0.5 + r() * 1.6,
  }));
  // connect each node to its 2 nearest neighbours as right-angle traces
  const edges: { a: number; b: number }[] = [];
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((o) => {
      if (o.j > i) edges.push({ a: i, b: o.j });
    });
  });

  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.18]"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="bd-clear" cx="50%" cy="42%" r="70%">
          <stop offset="30%" stopColor="black" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" />
        </radialGradient>
        <mask id="bd-mask">
          <rect width={W} height={H} fill="url(#bd-clear)" />
        </mask>
      </defs>
      <g mask="url(#bd-mask)">
        {edges.map((e, i) => {
          const a = nodes[e.a];
          const b = nodes[e.b];
          return (
            <path
              key={i}
              d={`M${a.x} ${a.y} H${b.x} V${b.y}`}
              stroke={i % 3 === 0 ? GOLD : ICE}
              strokeWidth={1.2}
            />
          );
        })}
        {nodes.map((n, i) => (
          <rect
            key={i}
            x={n.x - 3.2}
            y={n.y - 3.2}
            width={6.4}
            height={6.4}
            fill={n.gold ? GOLD : ICE}
            className="bd-pulse"
            style={{ animationDelay: `${(i % 7) * 0.7}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

/* ---- Scattered code fragments (Java / Python / SQL) ---- */
function CodeFragments() {
  const frags: { text: string; cls: string }[] = [
    { text: "def train(model, data):", cls: "left-[6%] top-[30%]" },
    { text: "SELECT * FROM txns\n WHERE risk > .9;", cls: "right-[7%] top-[44%]" },
    { text: "kafka.consume(topic)\n  .map(infer)", cls: "left-[9%] top-[62%]" },
    { text: "@Bean\nDataSource ds() {…}", cls: "right-[10%] bottom-[26%]" },
  ];
  return (
    <>
      {frags.map((f, i) => (
        <pre
          key={i}
          className={`pointer-events-none absolute hidden select-none whitespace-pre font-mono text-[11px] leading-5 opacity-[0.14] lg:block ${f.cls} ${
            i % 2 ? "text-gold" : "text-ice"
          }`}
          aria-hidden
        >
          {f.text}
        </pre>
      ))}
    </>
  );
}

/* ---- AI / ML — neural network (top-left) ---- */
function NeuralNet() {
  const layers = [
    [40, 90, 140, 190],
    [65, 115, 165],
    [90, 140],
    [115],
  ];
  const xs = [30, 95, 160, 225];
  const nodes = layers.flatMap((ys, li) => ys.map((y) => ({ x: xs[li], y, li })));
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    layers[li].forEach((y1) =>
      layers[li + 1].forEach((y2) =>
        edges.push({ x1: xs[li], y1, x2: xs[li + 1], y2 })
      )
    );
  }
  return (
    <svg
      className="pointer-events-none absolute -left-6 -top-6 h-[240px] w-[260px] opacity-[0.22] md:h-[300px] md:w-[320px]"
      viewBox="0 0 260 230"
      fill="none"
      aria-hidden
    >
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={ICE}
          strokeWidth={0.5}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={4}
          fill={n.li === 3 ? GOLD : ICE}
          className="bd-pulse"
          style={{ animationDelay: `${(i % 6) * 0.5}s` }}
        />
      ))}
    </svg>
  );
}

/* ---- Java / Spring Boot — code snippet (top-right) ---- */
function CodeSnippet() {
  const lines = [
    "@RestController",
    '@RequestMapping("/api/v1")',
    "class RiskService {",
    '  @GetMapping("/score")',
    "  Mono<Score> score(Txn t) {",
    "    return pipeline.stream(t)",
    "      .map(model::infer);",
    "  }",
    "}",
  ];
  return (
    <pre
      className="pointer-events-none absolute right-4 top-16 hidden select-none font-mono text-[11px] leading-5 text-ice opacity-[0.2] md:block"
      aria-hidden
    >
      {lines.join("\n")}
    </pre>
  );
}

/* ---- Databases (SQL/NoSQL) — cylinders (bottom-left) ---- */
function Database() {
  const cyl = (x: number, color: string) => (
    <g stroke={color} strokeWidth={1} fill="none">
      <ellipse cx={x} cy={20} rx={22} ry={7} />
      <path d={`M${x - 22} 20 v34 a22 7 0 0 0 44 0 v-34`} />
      <path d={`M${x - 22} 37 a22 7 0 0 0 44 0`} />
    </g>
  );
  return (
    <svg
      className="pointer-events-none absolute -bottom-4 left-2 h-[120px] w-[160px] opacity-[0.2] md:h-[150px] md:w-[200px]"
      viewBox="0 0 160 90"
      aria-hidden
    >
      {cyl(34, ICE)}
      {cyl(96, GOLD)}
      <line x1={56} y1={40} x2={74} y2={40} stroke={ICE} strokeWidth={0.6} strokeDasharray="3 3" />
    </svg>
  );
}

/* ---- REST API flow — client → gateway → service → db (bottom-right) ---- */
function ApiFlow() {
  const box = (x: number, label: string) => (
    <g>
      <rect x={x} y={20} width={42} height={22} rx={3} stroke={ICE} strokeWidth={0.8} fill="none" />
      <text x={x + 21} y={34} textAnchor="middle" fontSize={7} fill={ICE} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
  return (
    <svg
      className="pointer-events-none absolute -bottom-2 right-2 hidden h-[130px] w-[300px] opacity-[0.22] md:block"
      viewBox="0 0 300 70"
      fill="none"
      aria-hidden
    >
      {box(4, "GET")}
      {box(84, "API")}
      {box(164, "SVC")}
      {box(244, "DB")}
      {[46, 126, 206].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={31} x2={x + 38} y2={31} stroke={GOLD} strokeWidth={0.8} />
          <path d={`M${x + 34} 28 l4 3 -4 3`} stroke={GOLD} strokeWidth={0.8} />
          <circle
            r={2}
            fill={GOLD}
            className="bd-packet"
            style={{ offsetPath: `path("M${x} 31 H${x + 38}")` } as React.CSSProperties}
          />
        </g>
      ))}
    </svg>
  );
}

/* ---- DSA — a small binary tree (left edge, mid) ---- */
function DsaTree() {
  const n = (x: number, y: number, c = ICE) => <circle cx={x} cy={y} r={3.2} fill={c} />;
  return (
    <svg
      className="pointer-events-none absolute left-0 top-[18%] hidden h-[150px] w-[110px] opacity-[0.2] lg:block"
      viewBox="0 0 120 160"
      aria-hidden
    >
      <g stroke={ICE} strokeWidth={0.6}>
        <line x1={60} y1={20} x2={30} y2={70} />
        <line x1={60} y1={20} x2={90} y2={70} />
        <line x1={30} y1={70} x2={14} y2={120} />
        <line x1={30} y1={70} x2={46} y2={120} />
        <line x1={90} y1={70} x2={106} y2={120} />
      </g>
      {n(60, 20, GOLD)}
      {n(30, 70)}
      {n(90, 70)}
      {n(14, 120)}
      {n(46, 120)}
      {n(106, 120)}
    </svg>
  );
}

export default function TechBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* neutral canvas */}
      <div className="absolute inset-0 bg-void" />
      {/* faint blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(138,180,216,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(138,180,216,0.6) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />
      {/* whole-surface circuit / network field */}
      <CircuitField />
      <CodeFragments />
      {/* labelled corner accents */}
      <NeuralNet />
      <CodeSnippet />
      <Database />
      <ApiFlow />
      <DsaTree />
      {/* soft vignette so the centre stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_42%,transparent_48%,rgba(5,5,8,0.42)_100%)]" />
    </div>
  );
}
