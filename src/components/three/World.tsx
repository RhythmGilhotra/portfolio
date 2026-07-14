"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, chapterFloat } from "@/lib/scrollState";
import { particleVert, particleFrag } from "./shaders";
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

// Soft radial sprite used for the nebula haze.
function useHazeTexture() {
  return useMemo(() => {
    const s = 128;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.4, "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

// Colored volumetric haze drifting in the deep background. Normal-blended and
// fog-enabled so it fades with distance instead of punching through.
function Nebula({ tier }: { tier: "low" | "high" }) {
  const tex = useHazeTexture();
  const count = tier === "high" ? 14 : 7;
  const items = useMemo(() => {
    const arr: {
      pos: [number, number, number];
      scale: number;
      color: THREE.Color;
      rot: number;
      speed: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const chapter = Math.floor((i / count) * PALETTE.length);
      arr.push({
        pos: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          6 - Math.random() * CHAPTER_GAP * 7,
        ],
        scale: 12 + Math.random() * 20,
        color: new THREE.Color(PALETTE[chapter].haze),
        rot: Math.random() * Math.PI,
        speed: 0.02 + Math.random() * 0.05,
      });
    }
    return arr;
  }, [count]);

  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      m.rotation.z = items[i].rot + s.clock.elapsedTime * items[i].speed;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} scale={it.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={tex}
            color={it.color}
            transparent
            opacity={0.42}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog
          />
        </mesh>
      ))}
    </group>
  );
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
  const count = tier === "high" ? 12 : 6;
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

function StarField({ count = 2600, tier }: { count?: number; tier: "low" | "high" }) {
  const n = tier === "high" ? count : Math.floor(count * 0.5);
  const ref = useRef<THREE.ShaderMaterial>(null);

  const { geo } = useMemo(() => {
    const positions = new Float32Array(n * 3);
    const scales = new Float32Array(n);
    const seeds = new Float32Array(n);
    const depth = CHAPTER_GAP * 8;
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 46;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 2] = 12 - Math.random() * depth;
      scales[i] = 0.4 + Math.random() * 1.6;
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return { geo: g };
  }, [n]);

  useFrame((state) => {
    if (ref.current) ref.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={ref}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uSize: { value: 2.4 },
          uSpread: { value: 1 },
          uColorA: { value: new THREE.Color("#8ab4d8") },
          uColorB: { value: new THREE.Color("#d4af6a") },
        }}
      />
    </points>
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
      <Nebula tier={tier} />
      <SystemField tier={tier} />
      <StarField tier={tier} />
      <Environments tier={tier} />
    </>
  );
}
