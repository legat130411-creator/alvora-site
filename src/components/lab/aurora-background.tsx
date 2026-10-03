"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AuroraBackgroundProps {
  className?: string;
  intensity?: number;
  children?: ReactNode;
}

// Fallback used before WebGL boots and if it's unavailable — same color
// story as the shader itself: near-black base, Alvora signal blue veil.
const FALLBACK_BG =
  "radial-gradient(circle at 30% 24%, rgba(23,107,255,0.35), transparent 32%), " +
  "radial-gradient(circle at 78% 70%, rgba(23,107,255,0.16), transparent 36%), " +
  "linear-gradient(140deg, #090c11, #0d1118 55%, #060810)";

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Ported from the "aurora-veil" preset. Original used a green/ember duotone;
// recolored to the brand's signal blue plus a quiet off-white highlight so
// it reads as Alvora, not as a generic aurora effect.
const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;

float saturate(float value) { return clamp(value, 0.0, 1.0); }

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = rotate2d(0.72) * p * 2.03 + 4.17;
    amplitude *= 0.5;
  }
  return value;
}

vec3 shaderColor(vec2 p, float t, float intensity) {
  vec2 q = p;
  q.x += sin(q.y * 2.0 + t * 0.18) * 0.22;
  q.y += cos(q.x * 1.7 - t * 0.14) * 0.16;

  float veilA = smoothstep(0.72, 0.04, abs(q.y + sin(q.x * 1.8 + t * 0.24) * 0.32));
  float veilB = smoothstep(0.62, 0.02, abs(q.y * 0.85 - cos(q.x * 2.4 - t * 0.2) * 0.24));
  float grain = fbm(q * 2.5 + t * 0.04);

  vec3 base = vec3(0.016, 0.02, 0.028);
  vec3 blue = vec3(0.09, 0.42, 1.0);
  vec3 white = vec3(0.86, 0.88, 0.9);
  vec3 color = base + blue * veilA * 0.5 + white * veilB * 0.1;
  color += (grain - 0.5) * 0.03;
  return color * (0.84 + intensity * 0.22);
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / max(min(u_resolution.x, u_resolution.y), 1.0);
  vec3 color = shaderColor(p, u_time, u_intensity);
  color = pow(max(color, vec3(0.0)), vec3(0.92));
  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function AuroraBackground({
  className,
  intensity = 1,
  children,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    } as WebGLContextAttributes);

    if (!gl) {
      setFailed(true);
      return;
    }

    const program = createProgram(gl, vertexShaderSource, fragmentSource);
    const buffer = gl.createBuffer();
    if (!program || !buffer) {
      setFailed(true);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    setFailed(false);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      const width = Math.max(1, Math.floor(rect.width * ratio));
      const height = Math.max(1, Math.floor(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      if (disposed) return;
      resize();
      const time = reduceMotion ? 18 : now * 0.001;
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform1f(intensityLocation, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      if (disposed) return;
      render(now);
      if (!reduceMotion) frame = requestAnimationFrame(tick);
    };

    resizeObserver = new ResizeObserver(() => render(performance.now()));
    resizeObserver.observe(canvas);

    render(performance.now());
    if (!reduceMotion) frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [intensity]);

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className ?? ""}`}
      style={{ background: FALLBACK_BG }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ${
          failed ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
