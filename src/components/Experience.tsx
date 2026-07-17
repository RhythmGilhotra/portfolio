"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { scrollState } from "@/lib/scrollState";
import Overlay from "@/components/Overlay";
import Hud from "@/components/Hud";
import Terminal from "@/components/Terminal";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Experience() {
  const lenisRef = useRef<Lenis | null>(null);
  const [touring, setTouring] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const touringRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: reduced ? 0 : 1.35,
      smoothWheel: !reduced,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    lenis.on("scroll", (e: { progress: number; velocity: number }) => {
      scrollState.progress = e.progress;
      scrollState.velocity = e.velocity;
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") setTerminalOpen((v) => !v);
      if (e.key === "Escape") {
        setTerminalOpen(false);
        stopTour();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      lenis.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopTour = useCallback(() => {
    touringRef.current = false;
    setTouring(false);
    lenisRef.current?.stop();
    lenisRef.current?.start();
  }, []);

  const startTour = useCallback(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (touringRef.current) {
      stopTour();
      return;
    }
    touringRef.current = true;
    setTouring(true);
    const limit = document.body.scrollHeight - window.innerHeight;
    lenis.scrollTo(limit, {
      duration: 110,
      easing: (t: number) => t,
      onComplete: () => {
        touringRef.current = false;
        setTouring(false);
      },
    });
    // any manual wheel input cancels the tour
    const cancel = () => {
      if (touringRef.current) stopTour();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
  }, [stopTour]);

  return (
    <main className="relative">
      {/* fixed 3D universe */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* scrollable narrative */}
      <Overlay />

      <Hud
        touring={touring}
        onTour={startTour}
        onTerminal={() => setTerminalOpen(true)}
      />
      {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
    </main>
  );
}
