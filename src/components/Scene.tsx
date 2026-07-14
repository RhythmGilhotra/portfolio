"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import World from "@/components/three/World";

export default function Scene() {
  const [tier, setTier] = useState<"low" | "high">("high");

  useEffect(() => {
    // crude device-tier detection: reduce effects on low core counts / mobile
    const cores = navigator.hardwareConcurrency || 4;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (cores <= 4 || mobile) setTier("low");
  }, []);

  const high = tier === "high";

  return (
    <Canvas
      dpr={[1, high ? 2 : 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 120 }}
    >
      <fog attach="fog" args={["#05060f", 14, 40]} />

      <World tier={tier} />

      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom
          luminanceThreshold={0.32}
          luminanceSmoothing={0.85}
          intensity={high ? 0.72 : 0.5}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.18} darkness={0.92} />
        {high ? <Noise opacity={0.035} /> : <></>}
      </EffectComposer>

      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
