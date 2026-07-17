# Rhythm Gilhotra — An Engineering Journey

An interactive 3D digital universe that tells the story of Rhythm Gilhotra's
career. Scrolling flies a camera through eight environments — each a chapter of
the journey — instead of down a page.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
```

## Stack

Next.js 15 · React 19 · TypeScript · Three.js / React Three Fiber ·
@react-three/postprocessing (bloom, vignette, grain) · Framer Motion · Lenis
smooth scroll · Tailwind.

## Structure

- `src/lib/story.ts` — all narrative content (sourced from the résumés, rewritten as story beats).
- `src/components/Scene.tsx` — Canvas, post-processing, device-tier detection.
- `src/components/three/World.tsx` — camera rig (scroll → travel), starfield, lights.
- `src/components/three/environments.tsx` — the eight chapter set pieces.
- `src/components/three/shaders.ts` — GLSL for particles and data streams.
- `src/components/Overlay.tsx` — the scrolling narrative (HTML over the 3D world).
- `src/components/Hud.tsx` — progress rail, chapter jump, cinematic tour.
- `src/components/Terminal.tsx` — `` ` `` key easter egg: a typed career log.

## The eight chapters

Arrival · Origins · The Ascent · The Command Center · Artifacts · Constellation
· Monuments · Transmission.

## Notes

- Camera travels down the −Z axis; chapters sit `CHAPTER_GAP` apart. Environments
  emerge from fog as you approach.
- Custom-shader particles ignore scene fog, so the data streams fade themselves
  by view-space depth (see `shaders.ts`).
- Effects and particle counts step down on low-core / mobile devices.
- Respects `prefers-reduced-motion`.
- Keyboard: `` ` `` toggles terminal, `Esc` closes overlays / cancels the tour.
