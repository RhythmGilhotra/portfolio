"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { terminalLines } from "@/lib/story";

// Easter-egg terminal: types out a career log line by line.
export default function Terminal({ onClose }: { onClose: () => void }) {
  const [shown, setShown] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let line = 0;
    let char = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled || line >= terminalLines.length) return;
      const full = terminalLines[line];
      if (char <= full.length) {
        setCurrent(full.slice(0, char));
        char++;
        setTimeout(step, full.startsWith("$") ? 26 : 12);
      } else {
        setShown((s) => [...s, full]);
        setCurrent("");
        line++;
        char = 0;
        setTimeout(step, 180);
      }
    };
    const id = setTimeout(step, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [shown, current]);

  const color = (l: string) =>
    l.startsWith("$")
      ? "text-gold"
      : l.startsWith("[")
        ? "text-ice/80"
        : "text-mist/75";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className={`glass w-full overflow-hidden rounded-xl transition-all duration-300 ${
          maximized ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        <div className="group flex items-center gap-2 border-b border-mist/10 px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] text-[8px] font-bold leading-none text-black/60 opacity-100 hover:brightness-110"
          >
            <span className="opacity-0 group-hover:opacity-100">✕</span>
          </button>
          <button
            onClick={() => {
              setMaximized(false);
              setMinimized((v) => !v);
            }}
            aria-label="Minimize"
            title="Minimize"
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] text-[9px] font-bold leading-none text-black/60 hover:brightness-110"
          >
            <span className="opacity-0 group-hover:opacity-100">–</span>
          </button>
          <button
            onClick={() => {
              setMinimized(false);
              setMaximized((v) => !v);
            }}
            aria-label={maximized ? "Restore" : "Maximize"}
            title={maximized ? "Restore" : "Maximize"}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] text-[8px] font-bold leading-none text-black/60 hover:brightness-110"
          >
            <span className="opacity-0 group-hover:opacity-100">
              {maximized ? "❐" : "+"}
            </span>
          </button>
          <span className="ml-3 font-mono text-xs text-mist/50">
            rhythm@amex — career.log
          </span>
        </div>
        <div
          ref={scroller}
          className={`overflow-y-auto font-mono text-[0.8rem] leading-relaxed transition-all duration-300 ${
            minimized ? "h-0 p-0" : maximized ? "h-[78vh] p-5" : "h-[60vh] p-5"
          }`}
        >
          {shown.map((l, i) => (
            <p key={i} className={color(l)}>
              {l}
            </p>
          ))}
          {current && (
            <p className={color(current)}>
              {current}
              <span className="cursor-blink">▋</span>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
