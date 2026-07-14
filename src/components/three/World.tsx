"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, chapterFloat } from "@/lib/scrollState";
import Environments, { CHAPTER_GAP } from "./environments";

// Per-chapter colour grade — the void itself shifts hue as you travel.
const PALETTE = [
  { bg: "#05060f", key: "#8ab4d8", haze: "#22406e" }, // arrival — blue
  { bg: "#060912", key: "#8ab4d8", haze: "#274a80" }, // origins
  { bg: "#080a14", key: "#aab8dd", haze: "#3a5088" }, // ascent
  { bg: "#0e0a05", key: "#d4af6a", haze: "#6b4e26" }, // command — warm
  { bg: "#0a0710", key: "#9f8ad8", haze: "#473a74" }, // artifacts — violet
  { bg: "#05070f", key: "#8ab4d8", haze: "#2c4a7c" }, // constellation
  { bg: "#0d0a06", key: "#d4af6a", haze: "#5a4626" }, // monuments — gold
  { bg: "#100c07", key: "#e0bd76", haze: "#6b5230" }, // transmission
];

function grade(out: THREE.Color, key: "bg" | "key" | "haze", a: THREE.Color, b: THREE.Color) {
  const cf = chapterFloat();
  const i = Math.min(Math.floor(cf), PALETTE.length - 1);
  const j = Math.min(i + 1, PALETTE.length - 1);
  const f = cf - Math.floor(cf);
  a.set(PALETTE[i][key]);
  b.set(PALETTE[j][key]);
  out.copy(a).lerp(b, f);
}

// The camera glides down the -Z axis; each chapter sits CHAPTER_GAP apart.
function CameraRig() {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3());

  useMemo(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (typeof window !== "undefined")
      window.addEventListener("pointermove", onMove);
    return () => {};
  }, []);

  useFrame((_, dt) => {
    const cf = chapterFloat();
    const chapterZ = -cf * CHAPTER_GAP;
    const targetZ = chapterZ + 9;

    const px = pointer.current.x * 1.4;
    const py = -pointer.current.y * 0.9;
    const bank = THREE.MathUtils.clamp(scrollState.velocity * 0.0016, -0.5, 0.5);

    target.current.set(px, py + 0.2, targetZ);
    camera.position.lerp(target.current, 1 - Math.pow(0.0018, dt));
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, bank, 0.05);
    camera.lookAt(px * 0.3, py * 0.3, chapterZ - 6);
  });

  return null;
}

function SceneGrade({
  point,
}: {
  point: React.RefObject<THREE.PointLight | null>;
}) {
  const { scene } = useThree();
  const bg = useRef(new THREE.Color(PALETTE[0].bg));
  const key = useRef(new THREE.Color(PALETTE[0].key));
  const a = useRef(new THREE.Color());
  const b = useRef(new THREE.Color());

  useFrame(() => {
    grade(bg.current, "bg", a.current, b.current);
    if (!scene.background) scene.background = bg.current.clone();
    else (scene.background as THREE.Color).copy(bg.current);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bg.current);
    grade(key.current, "key", a.current, b.current);
    if (point.current) point.current.color.copy(key.current);
  });
  return null;
}

// A floating system-architecture diagram: service nodes wired by edges with
// data packets flowing between them. Drifts in the deep background as depth.
function SystemGraph({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const spin = useRef<THREE.Group>(null);
  const nodes = useMemo<THREE.Vector3[]>(() => {
    const n = 3 + Math.floor(Math.random() * 3); // 3–5 nodes
    return Array.from({ length: n }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 2.4,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.2
      )
    );
  }, []);

  const { edges, lineGeo } = useMemo(() => {
    const e: [number, number][] = [];
    for (let i = 1; i < nodes.length; i++) e.push([i - 1, i]); // chain
    if (nodes.length > 3) e.push([nodes.length - 1, 0]); // close loop
    const seg: number[] = [];
    e.forEach(([a, b]) => seg.push(...nodes[a].toArray(), ...nodes[b].toArray()));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return { edges: e, lineGeo: g };
  }, [nodes]);

  const packets = useMemo(
    () =>
      edges.slice(0, 2).map((e, i) => ({
        edge: e,
        t: Math.random(),
        speed: 0.18 + Math.random() * 0.22,
        ref: { current: null as THREE.Object3D | null },
        key: i,
      })),
    [edges]
  );

  useFrame((s, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.06;
    packets.forEach((p) => {
      p.t = (p.t + dt * p.speed) % 1;
      const a = nodes[p.edge[0]];
      const b = nodes[p.edge[1]];
      if (p.ref.current) p.ref.current.position.lerpVectors(a, b, p.t);
    });
  });

  return (
    <group ref={spin} position={position} scale={scale}>
      {/* edges */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.32} fog />
      </lineSegments>
      {/* service nodes */}
      {nodes.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <boxGeometry args={[0.34, 0.24, 0.34]} />
            <meshStandardMaterial
              color="#0a0c14"
              emissive={color}
              emissiveIntensity={0.35}
              metalness={0.5}
              roughness={0.4}
              flatShading
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.34, 0.24, 0.34)]} />
            <lineBasicMaterial color={color} transparent opacity={0.55} fog />
          </lineSegments>
        </group>
      ))}
      {/* flowing data packets */}
      {packets.map((p) => (
        <mesh
          key={p.key}
          ref={(el) => {
            p.ref.current = el;
          }}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} />
        </mesh>
      ))}
    </group>
  );
}

// Scatters system-architecture graphs through the corridor as background depth.
function SystemField({ tier }: { tier: "low" | "high" }) {
  const count = tier === "high" ? 20 : 10;
  const graphs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          (i % 2 === 0 ? -1 : 1) * (6.5 + Math.random() * 8),
          (Math.random() - 0.5) * 12,
          3 - Math.random() * CHAPTER_GAP * 7,
        ] as [number, number, number],
        color: Math.random() > 0.5 ? "#8ab4d8" : "#d4af6a",
        scale: 1 + Math.random() * 1.4,
        key: i,
      })),
    [count]
  );
  const drift = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!drift.current) return;
    drift.current.children.forEach((m, i) => {
      m.position.y += Math.sin(s.clock.elapsedTime * 0.15 + i) * 0.0012;
    });
  });
  return (
    <group ref={drift}>
      {graphs.map((g) => (
        <SystemGraph key={g.key} position={g.position} color={g.color} scale={g.scale} />
      ))}
    </group>
  );
}

// Blueprint grid — a floor and ceiling of engineering-schematic gridlines
// running the length of the corridor. Establishes a technical, system-design
// space instead of open sky.
function BlueprintGrid() {
  const grids = useMemo(() => {
    const mid = -CHAPTER_GAP * 3.5;
    const make = (y: number, color: string, opacity: number) => {
      const g = new THREE.GridHelper(240, 96, color, color);
      const m = g.material as THREE.LineBasicMaterial;
      m.transparent = true;
      m.opacity = opacity;
      m.fog = true;
      g.position.set(0, y, mid);
      return g;
    };
    return [make(-9, "#2b6a9e", 0.16), make(9, "#7a5a24", 0.1)];
  }, []);
  return (
    <>
      {grids.map((g, i) => (
        <primitive key={i} object={g} />
      ))}
    </>
  );
}

// Circuit-trace data buses — long lines threading the corridor, each carrying a
// bright pulse that runs its length. Reads as data on a bus / PCB traces.
function CircuitTraces({ tier }: { tier: "low" | "high" }) {
  const count = tier === "high" ? 26 : 13;
  const traces = useMemo(() => {
    return Array.from({ length: count }, () => {
      const along = Math.random() > 0.4 ? "z" : "x";
      const color = Math.random() > 0.5 ? "#8ab4d8" : "#d4af6a";
      // anchor away from the centre so buses frame, not cover, the content
      const ox = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 12);
      const oy = (Math.random() - 0.5) * 16;
      const oz = 4 - Math.random() * CHAPTER_GAP * 7;
      let a: THREE.Vector3, b: THREE.Vector3;
      if (along === "z") {
        const len = 8 + Math.random() * 16;
        a = new THREE.Vector3(ox, oy, oz);
        b = new THREE.Vector3(ox, oy, oz - len);
      } else {
        const len = 6 + Math.random() * 10;
        const dir = Math.random() > 0.5 ? 1 : -1;
        a = new THREE.Vector3(ox, oy, oz);
        b = new THREE.Vector3(ox + dir * len, oy, oz);
      }
      const geo = new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute([...a.toArray(), ...b.toArray()], 3)
      );
      return {
        a,
        b,
        geo,
        color,
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.3,
        ref: { current: null as THREE.Object3D | null },
      };
    });
  }, [count]);

  useFrame((_, dt) => {
    traces.forEach((tr) => {
      tr.t = (tr.t + dt * tr.speed) % 1;
      if (tr.ref.current) tr.ref.current.position.lerpVectors(tr.a, tr.b, tr.t);
    });
  });

  return (
    <>
      {traces.map((tr, i) => (
        <group key={i}>
          <lineSegments geometry={tr.geo}>
            <lineBasicMaterial color={tr.color} transparent opacity={0.14} fog />
          </lineSegments>
          <mesh
            ref={(el) => {
              tr.ref.current = el;
            }}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={tr.color}
              emissive={tr.color}
              emissiveIntensity={2.6}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function World({ tier }: { tier: "low" | "high" }) {
  const point = useRef<THREE.PointLight>(null);
  return (
    <>
      <CameraRig />
      <SceneGrade point={point} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={0.55} color="#f4f2ee" />
      <pointLight ref={point} position={[0, 0, 4]} intensity={0.6} color="#8ab4d8" />
      <BlueprintGrid />
      <CircuitTraces tier={tier} />
      <SystemField tier={tier} />
      <Environments tier={tier} />
    </>
  );
}
