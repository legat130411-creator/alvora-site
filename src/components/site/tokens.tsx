"use client";
import React from "react";
import { motion } from "motion/react";

export function onC(h: string) { const n = parseInt(h.slice(1), 16); const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; return l > 0.55 ? "#0A0A0A" : "#FFFFFF"; }
export type Palette = { bg: string; fg: string; accent: string; muted: string; hue: [number, number]; tint: [number, number, number]; card: string; dark: boolean };
export const PALETTES: Record<string, Palette> = {
  bone:    { bg: "#F2F1EC", fg: "#0A0A0A", accent: "#176BFF", muted: "#6b6b66", hue: [0.58, 0.62], tint: [0.0, 0.3, 1], card: "#ffffff", dark: false },
};
export const FONTS: Record<string, { head: string; body: string; weight: number | string; track: string; upper?: boolean }> = {
  fraunces:  { head: "var(--font-head, 'Bricolage Grotesque')", body: "'Familjen Grotesk'", weight: "var(--head-weight, 800)", track: "var(--head-track, -0.04em)" },
};

export function Wall({ p }: { p: Palette }) {
  const cols = 6;
  const rows = (c: number) => Array.from({ length: 40 }, (_, i) => { const s = (i * 37 + c * 91) % 100; const side = s % 2 ? "BUY" : "SELL"; return `${side} ${(60000 + s * 413).toLocaleString("en-US")}  ${(s / 40).toFixed(3)}`; });
  return (
    <div className="absolute inset-0 flex justify-between overflow-hidden px-4 font-mono text-sm" style={{ opacity: 0.35, maskImage: "linear-gradient(to bottom, transparent 0%, #000 16%, #000 62%, transparent 96%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 16%, #000 62%, transparent 96%)" }}>
      {Array.from({ length: cols }, (_, c) => (
        <motion.div key={c} className={"flex-col gap-2 whitespace-nowrap " + (c >= 2 ? "hidden md:flex" : "flex")} animate={{ y: c % 2 ? ["0%", "-50%"] : ["-50%", "0%"] }} transition={{ duration: 18 + c * 4, repeat: Infinity, ease: "linear" }}>
          {[...rows(c), ...rows(c)].map((r, i) => <span key={i} style={{ color: r.startsWith("BUY") ? p.accent : p.fg }}>{r}</span>)}
        </motion.div>
      ))}
    </div>
  );
}
