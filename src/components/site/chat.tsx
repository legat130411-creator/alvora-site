"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { onC, type Palette } from "./tokens";

type Step = { who: "user" | "ai"; text: string };
type Script = { steps: Step[]; template: string; params: [string, string][]; curve: number; summary: string };
export const SCRIPTS: Script[] = [
  {
    steps: [
      { who: "user", text: "Buy ETH when RSI is oversold and price is above the 200 EMA. Sell when RSI recovers." },
      { who: "ai", text: "Which timeframe, and what share of the account per trade?" },
      { who: "user", text: "4 hours, 10% per trade." },
    ],
    template: "Indicator signals",
    params: [["asset", "ETH/USDT"], ["timeframe", "4h"], ["entry", "RSI 14 below 30"], ["filter", "price above EMA 200"], ["exit", "RSI above 55"], ["size", "10% of account"]],
    curve: 3,
    summary: "Buy ETH on the 4-hour chart when RSI drops below 30 and price holds above its 200 EMA. Sell when RSI climbs back above 55. Ten percent of the account per trade.",
  },
  {
    steps: [
      { who: "user", text: "I want to trade ETH when it falls behind BTC." },
      { who: "ai", text: "How big should the gap be to enter, and over what window do you measure it?" },
      { who: "user", text: "Two standard deviations, last 30 days." },
    ],
    template: "Asset correlation",
    params: [["pair", "BTC / ETH"], ["window", "30 days"], ["entry", "spread beyond 2 sigma"], ["exit", "spread back to mean"], ["size", "10% of account"]],
    curve: 8,
    summary: "Trade ETH when it falls two standard deviations behind BTC over the last 30 days. Close when the gap is back to normal. Ten percent of the account per trade.",
  },
];

function useTyped(text: string, run: boolean, speed = 22) {
  const [n, setN] = useState(0);
  useEffect(() => { setN(0); if (!run) return; const id = setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), speed); return () => clearInterval(id); }, [text, run, speed]);
  return text.slice(0, n);
}

function Bubble({ s, p, dark }: { s: Step; p: Palette; dark: boolean }) {
  const user = s.who === "user";
  const txt = useTyped(s.text, true, user ? 24 : 12);
  const done = txt.length === s.text.length;
  const bg = user ? p.accent : dark ? "#ffffff18" : "#00000012";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug" style={{ background: bg, color: user ? onC(p.accent) : "inherit" }}>
        {txt}{!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse" style={{ background: "currentColor" }} />}
      </div>
    </motion.div>
  );
}

function Curve({ seed, color }: { seed: number; color: string }) {
  const d = React.useMemo(() => { let s = seed * 1237 + 11, v = 40; return Array.from({ length: 50 }, (_, i) => { s = (s * 16807) % 2147483647; v += (s / 2147483647 - 0.36) * 6; return `${i ? "L" : "M"}${i * 4},${70 - v}`; }).join(" "); }, [seed]);
  return <svg viewBox="0 0 196 70" className="w-full"><motion.path d={d} fill="none" stroke={color} strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeInOut" }} /></svg>;
}

/** Looping demo of the real product path: idea in plain words, clarifying question, template with parameters, backtest. Example data only. */
export function ChatDemo({ p, className = "", head, plain = false }: { p: Palette; className?: string; head?: React.CSSProperties; plain?: boolean }) {
  const [si, setSi] = useState(0);
  const [stage, setStage] = useState(0); // 0..2 = messages shown, 3 = template, 4 = result
  const sc = SCRIPTS[si];
  const dark = onC(p.card) === "#FFFFFF";
  const ink = onC(p.card);
  useEffect(() => {
    const t = [1500 + sc.steps[0].text.length * 24, 2200 + sc.steps[1].text.length * 12, 1500 + sc.steps[2].text.length * 24, 2600, 5200];
    const id = setTimeout(() => { if (stage >= 4) { setStage(0); setSi((x) => (x + 1) % SCRIPTS.length); } else setStage((s) => s + 1); }, t[stage]);
    return () => clearTimeout(id);
  }, [stage, si, sc]);
  const good = dark ? "#7CFF8A" : "#0B8F4A";
  return (
    <div className={`flex h-[440px] flex-col overflow-hidden rounded-[22px] ${className}`} style={{ background: p.card, color: ink }}>
      <div className="flex items-center gap-2 border-b px-5 py-3 text-sm" style={{ borderColor: ink + "22" }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: good }} />
        <span className="opacity-80">New strategy</span>
        <span className="ml-auto opacity-50">example</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-5">
        <AnimatePresence mode="popLayout">
          {stage < 3 && sc.steps.slice(0, stage + 1).map((s, i) => <Bubble key={si + "-" + i} s={s} p={p} dark={dark} />)}
          {stage >= 3 && plain && (
            <motion.div key={si + "-sum"} initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="rounded-2xl border p-4" style={{ borderColor: ink + "33" }}>
              <div className="text-sm opacity-60">Your strategy</div>
              <p className="mt-2 text-[15px] leading-snug">{sc.summary}</p>
            </motion.div>
          )}
          {stage >= 3 && !plain && (
            <motion.div key={si + "-tpl"} initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="rounded-2xl border p-4" style={{ borderColor: ink + "33" }}>
              <div className="flex items-center justify-between text-sm"><span className="opacity-60">Template</span><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: p.accent, color: onC(p.accent) }}>{sc.template}</span></div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
                {sc.params.map(([k, v], i) => (
                  <motion.div key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }} className="flex justify-between gap-2"><span className="opacity-55">{k}</span><span className="text-right font-medium">{v}</span></motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {stage >= 4 && (
            <motion.div key={si + "-res"} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-3" style={{ background: ink + "10" }}>
              <div className="mb-1 flex justify-between text-xs opacity-60"><span>5y backtest, fees included</span><span>example</span></div>
              <Curve seed={sc.curve} color={good} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
