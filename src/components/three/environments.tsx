"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { streamVert, streamFrag } from "./shaders";

export const CHAPTER_GAP = 22;

const GOLD = "#d4af6a";
const ICE = "#8ab4d8";
const MIST = "#f4f2ee";

/* ---------- helpers ---------- */

function useSpin(speed = 0.1) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return ref;
}

function Wire({
  children,
  color = MIST,
  opacity = 0.4,
}: {
  children: React.ReactNode;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh>
      {children}
      <meshBasicMaterial wireframe color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Glow({
  children,
  color = GOLD,
  intensity = 2,
}: {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
}) {
  return (
    <mesh>
      {children}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ---------- 00 · Arrival ---------- */
// A gyroscopic crystalline core — edge-lit octahedron, nested wire cage, and
// two counter-rotating gimbal rings. Reads as a precise technological artifact.
function CoreArtifact() {
  const spin = useRef<THREE.Group>(null);
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const octaGeo = useMemo(() => new THREE.OctahedronGeometry(0.5, 0), []);
  const cageGeo = useMemo(() => new THREE.IcosahedronGeometry(0.78, 0), []);

  useFrame((s, dt) => {
    if (spin.current) {
      spin.current.rotation.y += dt * 0.35;
      spin.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.25;
    }
    if (g1.current) g1.current.rotation.z += dt * 0.5;
    if (g2.current) g2.current.rotation.x -= dt * 0.4;
  });

  return (
    <group ref={spin}>
      {/* faceted crystal core with glowing edges */}
      <mesh geometry={octaGeo}>
        <meshStandardMaterial
          color="#141824"
          emissive={GOLD}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.25}
          flatShading
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[octaGeo]} />
        <lineBasicMaterial color={GOLD} transparent opacity={0.95} />
      </lineSegments>
      {/* bright inner spark */}
      <Glow color={MIST} intensity={2.6}>
        <icosahedronGeometry args={[0.14, 0]} />
      </Glow>
      {/* nested wire cage */}
      <lineSegments>
        <edgesGeometry args={[cageGeo]} />
        <lineBasicMaterial color={ICE} transparent opacity={0.4} />
      </lineSegments>
      {/* counter-rotating gimbal rings */}
      <group ref={g1}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.006, 8, 120]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.65} />
        </mesh>
      </group>
      <group ref={g2}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.25, 0.005, 8, 120]} />
          <meshBasicMaterial color={ICE} transparent opacity={0.45} />
        </mesh>
      </group>
    </group>
  );
}

function Arrival() {
  const ring = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.06;
    if (inner.current) inner.current.rotation.y += dt * 0.08;
  });
  return (
    <group position={[0, 0, 0]}>
      <group ref={ring}>
        <Wire color={GOLD} opacity={0.5}>
          <torusGeometry args={[4.5, 0.02, 8, 120]} />
        </Wire>
        <Wire color={ICE} opacity={0.25}>
          <torusGeometry args={[5.6, 0.01, 8, 120]} />
        </Wire>
      </group>
      <group ref={inner} position={[0, 1.6, -0.5]}>
        <Wire color={MIST} opacity={0.22}>
          <icosahedronGeometry args={[1.5, 1]} />
        </Wire>
        <CoreArtifact />
      </group>
    </group>
  );
}

/* ---------- 01 · Origins (compute lattice — the kernel) ---------- */
// A 3D voxel grid of nodes wired by traces: memory / compute as architecture.
function Origins() {
  const spin = useSpin(0.1);
  const { nodes, lines } = useMemo(() => {
    const g = 3; // 3x3x3 grid
    const s = 1.5;
    const pts: [number, number, number][] = [];
    for (let x = -g; x <= g; x += g)
      for (let y = -g; y <= g; y += g)
        for (let z = -g; z <= g; z += g) pts.push([(x / g) * s, (y / g) * s, (z / g) * s]);
    const seg: number[] = [];
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(
          pts[i][0] - pts[j][0],
          pts[i][1] - pts[j][1],
          pts[i][2] - pts[j][2]
        );
        if (d <= s + 0.01) seg.push(...pts[i], ...pts[j]);
      }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return { nodes: pts, lines: lg };
  }, []);

  const pulse = useRef<THREE.Group>(null);
  useFrame((st) => {
    if (pulse.current) {
      const k = 1 + Math.sin(st.clock.elapsedTime * 1.5) * 0.04;
      pulse.current.scale.setScalar(k);
    }
  });

  return (
    <group position={[0, 0, -CHAPTER_GAP]}>
      <group ref={spin}>
        <group ref={pulse}>
          {nodes.map((p, i) => (
            <mesh key={i} position={p}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshStandardMaterial
                color={MIST}
                emissive={i % 4 === 0 ? GOLD : ICE}
                emissiveIntensity={i % 4 === 0 ? 1.6 : 0.9}
              />
            </mesh>
          ))}
          <lineSegments geometry={lines}>
            <lineBasicMaterial color={ICE} transparent opacity={0.28} fog />
          </lineSegments>
        </group>
        <Wire color={MIST} opacity={0.12}>
          <boxGeometry args={[3.3, 3.3, 3.3]} />
        </Wire>
      </group>
    </group>
  );
}

/* ---------- 02 · The Stack (server racks rising) ---------- */
// Each role is a taller rack of stacked units with lit status strips — the
// tech stack growing layer by layer.
function Rack({ x, units, color }: { x: number; units: number; color: string }) {
  const uh = 0.5; // unit height
  const gap = 0.08;
  const rows = Array.from({ length: units });
  return (
    <group position={[x, -2.4, 0]}>
      {rows.map((_, i) => {
        const y = i * (uh + gap) + uh / 2;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[1.3, uh, 1.0]} />
              <meshStandardMaterial
                color="#0c0e16"
                emissive={color}
                emissiveIntensity={0.15}
                metalness={0.5}
                roughness={0.5}
                flatShading
              />
            </mesh>
            {/* lit status strip on the front face */}
            <mesh position={[0.66, 0, 0.4]}>
              <boxGeometry args={[0.02, uh * 0.6, 0.12]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} />
            </mesh>
          </group>
        );
      })}
      {/* beacon on top unit */}
      <mesh position={[0, units * (uh + gap) + 0.15, 0]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.6} />
      </mesh>
    </group>
  );
}
function Ascent() {
  return (
    <group position={[0, 0, -CHAPTER_GAP * 2]}>
      <Rack x={-3.6} units={3} color={ICE} />
      <Rack x={0} units={5} color={MIST} />
      <Rack x={3.6} units={8} color={GOLD} />
    </group>
  );
}

/* ---------- 03 · Command Center (data streams) ---------- */
function DataStreams({ lanes = 5, perLane = 60 }: { lanes?: number; perLane?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const count = lanes * perLane;
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count);
    const lane = new Float32Array(count);
    let k = 0;
    for (let l = 0; l < lanes; l++) {
      const y = (l - (lanes - 1) / 2) * 0.9;
      for (let p = 0; p < perLane; p++) {
        pos[k * 3] = 0;
        pos[k * 3 + 1] = y + (Math.random() - 0.5) * 0.12;
        pos[k * 3 + 2] = (Math.random() - 0.5) * 0.4;
        off[k] = Math.random();
        lane[k] = l;
        k++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aOffset", new THREE.BufferAttribute(off, 1));
    g.setAttribute("aLane", new THREE.BufferAttribute(lane, 1));
    return g;
  }, [lanes, perLane]);

  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        ref={mat}
        vertexShader={streamVert}
        fragmentShader={streamFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(ICE) } }}
      />
    </points>
  );
}
function CommandCenter() {
  const rings = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    if (rings.current) rings.current.rotation.z += dt * 0.2;
    if (core.current) {
      const p = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.08;
      core.current.scale.setScalar(p);
    }
  });
  return (
    <group position={[0, 0, -CHAPTER_GAP * 3]}>
      <DataStreams />
      <mesh ref={core}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.6}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>
      <group ref={rings}>
        {[2.2, 2.9, 3.6].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.3, 0]}>
            <torusGeometry args={[r, 0.015, 8, 100]} />
            <meshBasicMaterial color={i === 1 ? GOLD : ICE} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- 04 · Artifacts (deployed system modules) ---------- */
// Floating compute modules: a chassis with a glowing core and an orbiting
// data ring — self-contained systems humming in space.
function Module({ x, color }: { x: number; color: string }) {
  const ref = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.6 + x) * 0.4;
      ref.current.rotation.y += dt * 0.12;
    }
    if (ring.current) ring.current.rotation.x += dt * 0.6;
  });
  return (
    <group ref={ref} position={[x, 0, 0]}>
      {/* chassis */}
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="#0c0e16"
          emissive={color}
          emissiveIntensity={0.25}
          metalness={0.6}
          roughness={0.4}
          flatShading
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)]} />
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>
      {/* exposed glowing core */}
      <Glow color={color} intensity={2.4}>
        <icosahedronGeometry args={[0.3, 0]} />
      </Glow>
      {/* orbiting data ring */}
      <group ref={ring}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.012, 8, 100]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}
function Artifacts() {
  return (
    <group position={[0, 0, -CHAPTER_GAP * 4]}>
      <Module x={-2.7} color={ICE} />
      <Module x={2.7} color={GOLD} />
    </group>
  );
}

/* ---------- 05 · Constellation (skills) ---------- */
function Constellation() {
  const spin = useSpin(0.05);
  const { points, lines } = useMemo(() => {
    const N = 30;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        )
      );
    }
    const seg: number[] = [];
    for (let i = 0; i < N; i++) {
      let best = -1;
      let bd = Infinity;
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const d = pts[i].distanceTo(pts[j]);
        if (d < bd) {
          bd = d;
          best = j;
        }
      }
      if (best >= 0) {
        seg.push(pts[i].x, pts[i].y, pts[i].z, pts[best].x, pts[best].y, pts[best].z);
      }
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return { points: pts, lines: lg };
  }, []);
  return (
    <group position={[0, 0, -CHAPTER_GAP * 5]} ref={spin}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? GOLD : ICE}
            emissive={i % 4 === 0 ? GOLD : ICE}
            emissiveIntensity={2.2}
          />
        </mesh>
      ))}
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={MIST} transparent opacity={0.14} />
      </lineSegments>
    </group>
  );
}

/* ---------- 06 · Monuments (circuit obelisks) ---------- */
// Tall edge-lit monoliths, each carrying a glowing microchip — achievements
// etched into silicon.
function Obelisk({ x, h, color }: { x: number; h: number; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25;
  });
  const geo = useMemo(() => new THREE.BoxGeometry(0.7, h, 0.4), [h]);
  return (
    <group ref={ref} position={[x, 0, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#0b0d15"
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
          flatShading
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[geo]} />
        <lineBasicMaterial color={color} transparent opacity={0.85} />
      </lineSegments>
      {/* embedded chip */}
      <mesh position={[0, 0, 0.21]}>
        <boxGeometry args={[0.34, 0.34, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} />
      </mesh>
    </group>
  );
}
function Monuments() {
  return (
    <group position={[0, 0, -CHAPTER_GAP * 6]}>
      <Obelisk x={-3} h={2.2} color={ICE} />
      <Obelisk x={0} h={3.4} color={GOLD} />
      <Obelisk x={3} h={2.2} color={ICE} />
    </group>
  );
}

/* ---------- 07 · Transmission ---------- */
function Transmission() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = (s.clock.elapsedTime * 0.3) % 1;
      ref.current.scale.setScalar(1 + t * 4);
    }
  });
  return (
    <group position={[0, 2.6, -CHAPTER_GAP * 7]}>
      <Glow color={GOLD} intensity={2.6}>
        <sphereGeometry args={[0.32, 24, 24]} />
      </Glow>
      <group ref={ref}>
        <Wire color={GOLD} opacity={0.4}>
          <torusGeometry args={[1, 0.01, 8, 80]} />
        </Wire>
      </group>
    </group>
  );
}

export default function Environments({ tier }: { tier: "low" | "high" }) {
  return (
    <>
      <Arrival />
      <Origins />
      <Ascent />
      <CommandCenter />
      <Artifacts />
      <Constellation />
      <Monuments />
      <Transmission />
    </>
  );
}
