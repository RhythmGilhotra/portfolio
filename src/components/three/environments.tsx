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

/* ---------- 01 · Origins (observatory lattice) ---------- */
function Origins() {
  const spin = useSpin(0.08);
  const dots = useMemo(() => {
    const arr: [number, number, number][] = [];
    const N = 42;
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.2;
      arr.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ]);
    }
    return arr;
  }, []);
  return (
    <group position={[0, 0, -CHAPTER_GAP]}>
      <group ref={spin}>
        <Wire color={ICE} opacity={0.22}>
          <sphereGeometry args={[3.2, 20, 20]} />
        </Wire>
        {dots.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color={MIST}
              emissive={i % 5 === 0 ? GOLD : ICE}
              emissiveIntensity={i % 5 === 0 ? 1.3 : 0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- 02 · The Ascent (three peaks) ---------- */
function Peak({
  x,
  h,
  color,
}: {
  x: number;
  h: number;
  color: string;
}) {
  return (
    <group position={[x, -2.2, 0]}>
      <mesh position={[0, h / 2, 0]}>
        <coneGeometry args={[h * 0.5, h, 4]} />
        <meshStandardMaterial
          color="#0c0e16"
          emissive={color}
          emissiveIntensity={0.25}
          flatShading
          roughness={0.9}
        />
      </mesh>
      <mesh position={[0, h, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} />
      </mesh>
    </group>
  );
}
function Ascent() {
  return (
    <group position={[0, 0, -CHAPTER_GAP * 2]}>
      <Peak x={-3.4} h={2.6} color={ICE} />
      <Peak x={0} h={4.2} color={MIST} />
      <Peak x={3.6} h={6.2} color={GOLD} />
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

/* ---------- 04 · Artifacts (floating structures) ---------- */
function Island({
  x,
  color,
}: {
  x: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current)
      ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.6 + x) * 0.4;
  });
  return (
    <group ref={ref} position={[x, 0, 0]}>
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[1.1, 1.6, 6]} />
        <meshStandardMaterial color="#0c0e16" emissive={color} emissiveIntensity={0.3} flatShading />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.25, 6]} />
        <meshStandardMaterial color="#12141d" emissive={color} emissiveIntensity={0.4} flatShading />
      </mesh>
      <group position={[0, 0.9, 0]}>
        <Wire color={color} opacity={0.6}>
          <boxGeometry args={[0.7, 0.9, 0.7]} />
        </Wire>
        <Glow color={color} intensity={2.2}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
        </Glow>
      </group>
    </group>
  );
}
function Artifacts() {
  return (
    <group position={[0, 0, -CHAPTER_GAP * 4]}>
      <Island x={-2.6} color={ICE} />
      <Island x={2.6} color={GOLD} />
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

/* ---------- 06 · Monuments (crystalline awards) ---------- */
function Shard({ x, h, color }: { x: number; h: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.3;
  });
  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <octahedronGeometry args={[h, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        roughness={0.1}
        metalness={0.4}
        flatShading
      />
    </mesh>
  );
}
function Monuments() {
  return (
    <group position={[0, 0, -CHAPTER_GAP * 6]}>
      <Shard x={-3} h={1.1} color={ICE} />
      <Shard x={0} h={1.7} color={GOLD} />
      <Shard x={3} h={1.1} color={ICE} />
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
