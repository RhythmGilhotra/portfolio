// Shared mutable scroll state — written by Lenis raf, read per-frame by the canvas.
// Deliberately not React state: it changes every frame.
export const scrollState = {
  progress: 0, // 0..1 across the whole journey
  velocity: 0,
};

export const NUM_CHAPTERS = 8;

// current fractional chapter position, 0..NUM_CHAPTERS-1
export function chapterFloat() {
  return scrollState.progress * (NUM_CHAPTERS - 1);
}
