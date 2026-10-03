"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface BeamsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

// Alvora signal blue is ~217deg; keep every beam inside a narrow band around
// it instead of the original's full cyan-to-violet sweep so the piece reads
// as one brand color, not a rainbow.
const HUE_MIN = 212;
const HUE_MAX = 224;

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.1 + Math.random() * 0.14,
    hue: HUE_MIN + Math.random() * (HUE_MAX - HUE_MIN),
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = "subtle",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 14;

  const opacityMap = { subtle: 0.55, medium: 0.75, strong: 1 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(canvas.width, canvas.height),
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;
      const column = index % 3;
      const spacing = canvas.width / 3;

      beam.y = canvas.height + 100;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = HUE_MIN + (index * (HUE_MAX - HUE_MIN)) / totalBeams;
      beam.opacity = 0.16 + Math.random() * 0.08;
      return beam;
    }

    function drawBeam(c: CanvasRenderingContext2D, beam: Beam) {
      c.save();
      c.translate(beam.x, beam.y);
      c.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity =
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];

      const gradient = c.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `hsla(${beam.hue}, 90%, 58%, 0)`);
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 90%, 58%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 90%, 58%, ${pulsingOpacity})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 90%, 58%, ${pulsingOpacity})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 90%, 58%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 90%, 58%, 0)`);

      c.fillStyle = gradient;
      c.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      c.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(35px)";

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, index, totalBeams);
        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-bg ${className ?? ""}`}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ filter: "blur(15px)" }} />

      <motion.div
        className="absolute inset-0 bg-bg/5"
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        style={{ backdropFilter: "blur(50px)" }}
      />

      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
