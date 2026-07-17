"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "@/lib/scrollState";
import { CHAPTERS } from "@/lib/story";

export default function Hud({
  touring,
  onTour,
  onTerminal,
}: {
  touring: boolean;
  onTour: () => void;
  onTerminal: () => void;
}) {
  const [pct, setPct] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = scrollState.progress;
      setPct(p);
      if (barRef.current)
        barRef.current.style.transform = `scaleY(${Math.max(0.02, p)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = Math.round(pct * (CHAPTERS.length - 1));

  const jump = (i: number) => {
    const limit = document.body.scrollHeight - window.innerHeight;
    const y = (i / (CHAPTERS.length - 1)) * limit;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* top-left wordmark */}
      <div className="fixed left-6 top-6 z-30 font-mono text-xs tracking-widest text-mist/50 md:left-8">
        RG<span className="text-gold">/</span>ENGINEER
      </div>

      {/* progress rail + chapter markers, right edge */}
      <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 md:flex md:flex-col md:items-center md:gap-3">
        <div className="relative h-40 w-px bg-mist/15">
          <div
            ref={barRef}
            className="absolute left-0 top-0 w-px origin-top bg-gold"
            style={{ height: "100%" }}
          />
        </div>
        <div className="flex flex-col gap-3">
          {CHAPTERS.map((c, i) => (
            <button
              key={c}
              onClick={() => jump(i)}
              className="group flex items-center gap-2"
              aria-label={`Go to ${c}`}
            >
              <span className="w-16 text-right font-mono text-[0.55rem] uppercase tracking-widest opacity-0 transition group-hover:opacity-100 text-mist/60">
                {c}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === active ? "scale-150 bg-gold" : "bg-mist/30 group-hover:bg-ice"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* bottom controls */}
      <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
        <button
          onClick={onTour}
          className="glass rounded-full px-5 py-2.5 font-mono text-xs tracking-wide text-mist transition hover:text-gold"
        >
          {touring ? "◼ stop tour" : "▶ cinematic tour"}
        </button>
        <button
          onClick={onTerminal}
          className="glass rounded-full px-4 py-2.5 font-mono text-xs tracking-wide text-mist/70 transition hover:text-ice"
          aria-label="Open terminal"
        >
          &gt;_
        </button>
      </div>
    </>
  );
}
