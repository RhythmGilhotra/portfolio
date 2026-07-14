// Shared GLSL snippets kept small and combinable.

export const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uSpread;
  attribute float aScale;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 p = position;
    // gentle organic drift
    p.x += sin(uTime * 0.15 + aSeed * 6.28) * 0.6;
    p.y += cos(uTime * 0.12 + aSeed * 6.28) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // clamp so stars close to the camera never balloon into blobs
    gl_PointSize = clamp(uSize * aScale * (300.0 / -mv.z), 0.0, 7.0);
  }
`;

export const particleFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(col, alpha * 0.9);
  }
`;

// Data-stream shader for the command-center pipeline: bright moving pulses.
export const streamVert = /* glsl */ `
  uniform float uTime;
  attribute float aOffset;
  attribute float aLane;
  varying float vGlow;
  varying float vFade;
  void main() {
    vec3 p = position;
    float t = fract(uTime * 0.35 + aOffset);
    p.x = mix(-6.0, 6.0, t);
    vGlow = smoothstep(0.0, 0.15, t) * smoothstep(1.0, 0.85, t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // only visible near this chapter — custom shaders ignore scene fog,
    // so fade manually by view-space depth to stop distant bleed-through.
    vFade = 1.0 - smoothstep(18.0, 40.0, -mv.z);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((14.0 + vGlow * 20.0) * (300.0 / -mv.z), 0.0, 26.0);
  }
`;

export const streamFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vGlow;
  varying float vFade;
  void main() {
    if (vFade <= 0.001) discard;
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor + vGlow * 0.4, a * (0.25 + vGlow) * vFade);
  }
`;
