"use client";

// Clean, content-first backdrop. A near-black canvas with subtle, edge-anchored
// technology motifs drawn from the résumé (AI/ML, Java/Spring Boot, Python,
// REST APIs, databases, data pipelines, DSA, cloud). Everything sits at
// 5–14% opacity around the corners/edges; the centre stays clear for content.

const ICE = "#8ab4d8";
const GOLD = "#d4af6a";

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
      className="pointer-events-none absolute -left-6 -top-6 h-[240px] w-[260px] opacity-[0.11] md:h-[300px] md:w-[320px]"
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

/* ---- Java / Spring Boot / Python — code snippet (top-right) ---- */
function CodeSnippet() {
  const lines = [
    "@RestController",
    '@RequestMapping("/api/v1")',
    "class RiskService {",
    "  @GetMapping(\"/score\")",
    "  Mono<Score> score(Txn t) {",
    "    return pipeline.stream(t)",
    "      .map(model::infer);",
    "  }",
    "}",
  ];
  return (
    <pre
      className="pointer-events-none absolute right-4 top-16 hidden select-none font-mono text-[11px] leading-5 text-ice opacity-[0.10] md:block"
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
      className="pointer-events-none absolute -bottom-4 left-2 h-[120px] w-[160px] opacity-[0.10] md:h-[150px] md:w-[200px]"
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
      className="pointer-events-none absolute -bottom-2 right-2 hidden h-[130px] w-[300px] opacity-[0.11] md:block"
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
          <circle r={2} fill={GOLD} className="bd-packet" style={{ offsetPath: `path("M${x} 31 H${x + 38}")` } as React.CSSProperties} />
        </g>
      ))}
    </svg>
  );
}

/* ---- Circuit traces along the right edge + data-flow dots ---- */
function EdgeTraces() {
  return (
    <svg
      className="pointer-events-none absolute right-0 top-1/2 hidden h-[420px] w-[70px] -translate-y-1/2 opacity-[0.09] lg:block"
      viewBox="0 0 70 420"
      fill="none"
      aria-hidden
    >
      <path d="M70 40 H40 V120 H55 V210 H30 V300 H50 V380 H70" stroke={ICE} strokeWidth={0.8} />
      <path d="M70 90 H20 V180 H45 V270 H15 V360" stroke={GOLD} strokeWidth={0.6} />
      {[40, 120, 210, 300].map((y, i) => (
        <circle key={i} cx={i % 2 ? 55 : 40} cy={y} r={2.5} fill={ICE} className="bd-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </svg>
  );
}

/* ---- DSA — a small binary tree (left edge, mid) ---- */
function DsaTree() {
  const n = (x: number, y: number, c = ICE) => <circle cx={x} cy={y} r={3.2} fill={c} />;
  return (
    <svg
      className="pointer-events-none absolute left-0 top-1/2 hidden h-[160px] w-[120px] -translate-y-1/2 opacity-[0.08] lg:block"
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
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      {/* neutral canvas with a soft vignette so edge motifs never fight content */}
      <div className="absolute inset-0 bg-void" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_35%,rgba(5,5,8,0.85)_100%)]" />
      {/* faint blueprint grid, very low opacity */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(138,180,216,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(138,180,216,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(120% 90% at 50% 40%, transparent 45%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 40%, transparent 45%, black 100%)",
        }}
      />
      <NeuralNet />
      <CodeSnippet />
      <Database />
      <ApiFlow />
      <EdgeTraces />
      <DsaTree />
    </div>
  );
}
