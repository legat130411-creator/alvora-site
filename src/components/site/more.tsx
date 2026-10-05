"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { FONTS, PALETTES } from "./tokens";

const P = PALETTES.bone, F = FONTS.fraunces;
const head: React.CSSProperties = { fontFamily: F.head, fontWeight: F.weight, letterSpacing: F.track, lineHeight: 0.95 };
const INK = "#0E0F12", GOOD = "#3ddc84", BAD = "#ff5a4a";
const ease = [0.2, 0.7, 0.2, 1] as const;

/* ---------- layout helpers ---------- */

function Block({ title, children, scene, flip = false }: { title: string; children: React.ReactNode; scene: React.ReactNode; flip?: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
      <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }} className={flip ? "md:order-2" : ""}>
        <h3 style={{ ...head, fontSize: "clamp(1.9rem,3.2vw,3.2rem)", textWrap: "balance" }}>{title}</h3>
        <div className="mt-5 max-w-md space-y-4 text-lg leading-snug opacity-85">{children}</div>
      </motion.div>
      <div className={flip ? "md:order-1" : ""}>{scene}</div>
    </div>
  );
}

function Band({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="px-6 py-20 md:px-10 md:py-28" style={{ background: P.bg, color: P.fg, fontFamily: F.body }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-24 md:gap-36">{children}</div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full px-3 py-1 text-xs" style={{ background: "#ffffff1c" }}>{children}</span>;
}

/* ---------- deterministic data ---------- */

function series(seed: number, n: number, drift: number, vol: number, start = 50) {
  let s = seed * 9301 + 49297, v = start;
  const out: number[] = [];
  for (let i = 0; i < n; i++) { s = (s * 16807) % 2147483647; v += (s / 2147483647 - 0.5) * vol + drift; out.push(v); }
  return out;
}
const toPath = (a: number[], w: number, h: number, min: number, max: number, x0 = 0, x1 = 1) =>
  a.map((y, i) => `${i ? "L" : "M"}${(x0 + (i / (a.length - 1)) * (x1 - x0)) * w},${h - ((y - min) / (max - min)) * h}`).join(" ");

/* ---------- 1. what you can describe ---------- */

const IDEAS_A = ["Buy ETH when RSI drops below 30", "Trade ETH when it falls behind BTC", "Enter above last week's high", "Stay out when volatility is low", "Only trade on weekends", "Sell half after a 20% rise"];
const IDEAS_B = ["Buy dips only above the 200 EMA", "Skip the first hour after a news spike", "Add to a position every 5% drop", "Exit when price closes under yesterday's low", "Trade SOL only when BTC is calm", "Close everything on Friday evening"];

function Marquee({ items, reverse, dark }: { items: string[]; reverse?: boolean; dark?: boolean }) {
  const list = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div className="flex w-max gap-3" animate={{ x: reverse ? ["-33.333%", "0%"] : ["0%", "-33.333%"] }} transition={{ duration: 46, repeat: Infinity, ease: "linear" }}>
        {list.map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-full px-5 py-3 text-lg" style={{ background: dark ? P.fg : "#fff", color: dark ? "#fff" : P.fg }}>{t}</span>
        ))}
      </motion.div>
    </div>
  );
}

export function IdeasStrip() {
  return (
    <section className="overflow-hidden py-20 md:py-28" style={{ background: P.bg, color: P.fg, fontFamily: F.body }}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h3 style={{ ...head, fontSize: "clamp(1.9rem,3.2vw,3.2rem)" }}>What you can describe</h3>
        <p className="mt-5 max-w-xl text-lg leading-snug opacity-85">Anything you could explain to another trader. If the idea is clear enough to follow without guessing, the AI can test it. These are a few that people type.</p>
      </div>
      <div className="mt-12 space-y-3">
        <Marquee items={IDEAS_A} />
        <Marquee items={IDEAS_B} reverse dark />
      </div>
    </section>
  );
}

/* ---------- 2. what the AI asks ---------- */

const QA = [["Timeframe", "4 hours"], ["Size of one trade", "10% of the account"], ["Exit", "RSI back above 55"], ["If a trade goes against you", "Close at 8% loss"]];

function QuestionsBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setN((x) => (x >= QA.length ? x : x + 1)), 1100);
    return () => clearInterval(id);
  }, [inView]);
  const open = QA.length - n;
  return (
    <div ref={ref} className="rounded-[26px] p-6 md:p-8" style={{ background: "#fff" }}>
      <div className="flex items-baseline justify-between">
        <div className="text-sm opacity-60">Your idea: buy ETH when RSI is oversold</div>
        <motion.div key={open} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm tabular-nums" style={{ color: open ? P.fg : "#0B8F4A" }}>{open ? `${open} open` : "Ready to test"}</motion.div>
      </div>
      <ul className="mt-5 divide-y" style={{ borderColor: P.fg + "18" }}>
        {QA.map(([q, a], i) => {
          const done = i < n;
          return (
            <li key={q} className="flex items-center gap-4 py-4" style={{ borderColor: P.fg + "18" }}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: done ? "#0B8F4A" : P.fg + "33", background: done ? "#0B8F4A" : "transparent" }}>
                {done && <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><motion.path d="M2.5 7.5l3 3 6-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }} /></motion.svg>}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm opacity-60">{q}?</div>
                <div className="h-7 overflow-hidden text-xl" style={{ fontFamily: F.head, fontWeight: F.weight, letterSpacing: F.track }}>
                  <AnimatePresence>{done && <motion.div initial={{ y: 28 }} animate={{ y: 0 }} transition={{ duration: 0.45, ease }}>{a}</motion.div>}</AnimatePresence>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- 3. what the test shows ---------- */

const TRADES = [["Mar 04", "Buy", "ETH", "2,141", 10], ["Mar 09", "Sell", "ETH", "2,298", 24], ["Mar 17", "Buy", "ETH", "2,052", 41], ["Mar 21", "Sell", "ETH", "2,187", 57], ["Apr 02", "Buy", "ETH", "2,310", 73], ["Apr 11", "Sell", "ETH", "2,264", 90]] as const;

function TestPanel() {
  const data = useMemo(() => series(5, 100, 0.12, 4.2, 40), []);
  const min = Math.min(...data) - 2, max = Math.max(...data) + 2;
  const W = 600, H = 210;
  const dd = useMemo(() => {
    let peak = 0, best = { from: 0, to: 0, size: 0 };
    data.forEach((v, i) => { if (v > data[peak]) peak = i; const d = (data[peak] - v) / data[peak]; if (d > best.size) best = { from: peak, to: i, size: d }; });
    return best;
  }, [data]);
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => { if (hold) return; const id = setInterval(() => setActive((x) => (x + 1) % TRADES.length), 1800); return () => clearInterval(id); }, [hold]);
  const x = (i: number) => (i / 99) * W, y = (v: number) => H - ((v - min) / (max - min)) * H;
  const t = TRADES[active];
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="opacity-70">Backtest, 5 years of history</span>
        <span className="flex gap-2"><Tag>fees included</Tag><Tag>slippage included</Tag><Tag>example</Tag></span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Example equity curve with trade markers">
        <motion.rect x={x(dd.from)} y={0} width={x(dd.to) - x(dd.from)} height={H} fill={BAD} initial={{ opacity: 0 }} whileInView={{ opacity: 0.14 }} viewport={{ once: true }} transition={{ delay: 2, duration: 0.8 }} />
        <motion.path d={toPath(data, W, H, min, max)} fill="none" stroke={GOOD} strokeWidth="2.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: "easeInOut" }} />
        <motion.line x1={x(t[4])} x2={x(t[4])} y1={0} y2={H} stroke="#fff" strokeOpacity={0.35} strokeDasharray="3 4" animate={{ x1: x(t[4]), x2: x(t[4]) }} transition={{ type: "spring", stiffness: 160, damping: 20 }} />
        {TRADES.map((r, i) => (
          <motion.circle key={i} cx={x(r[4])} cy={y(data[r[4]])} fill={r[1] === "Buy" ? GOOD : BAD} animate={{ r: i === active ? 7 : 3.5, opacity: i === active ? 1 : 0.7 }} stroke={INK} strokeWidth={2} />
        ))}
      </svg>
      <div className="mt-1 text-xs opacity-60">The red band is the largest drop from a peak in this example.</div>
      <ul className="mt-4 text-sm">
        {TRADES.map((r, i) => (
          <li key={r[0]}>
            <button onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} className="grid w-full grid-cols-[70px_60px_50px_1fr] items-center gap-2 rounded-lg px-3 py-2 text-left tabular-nums transition-colors" style={{ background: i === active ? "#ffffff14" : "transparent" }}>
              <span className="opacity-60">{r[0]}</span>
              <span style={{ color: r[1] === "Buy" ? GOOD : BAD }}>{r[1]}</span>
              <span>{r[2]}</span>
              <span className="text-right">{r[3]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 4. what the test cannot show ---------- */

function FuturePaths() {
  const W = 600, H = 240, split = 0.52;
  const past = useMemo(() => series(11, 60, 0.18, 3.2, 40), []);
  const futures = useMemo(() => Array.from({ length: 10 }, (_, k) => series(40 + k * 7, 56, (k - 4.5) * 0.06, 3.6, past[past.length - 1])), [past]);
  const all = [...past, ...futures.flat()];
  const min = Math.min(...all) - 3, max = Math.max(...all) + 3;
  const last = past[past.length - 1];
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="flex items-center justify-between text-sm"><span className="opacity-70">The same idea, after today</span><Tag>illustration</Tag></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="One past line and ten possible future lines">
        <line x1={split * W} x2={split * W} y1={0} y2={H} stroke="#fff" strokeOpacity={0.4} strokeDasharray="4 5" />
        <text x={split * W + 8} y={14} fill="#fff" fillOpacity={0.6} fontSize="12">today</text>
        <motion.path d={toPath(past, W, H, min, max, 0, split)} fill="none" stroke={GOOD} strokeWidth="2.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeInOut" }} />
        {futures.map((f, k) => (
          <motion.path key={k} d={toPath([last, ...f], W, H, min, max, split, 1)} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth="1.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 1.5 + k * 0.12, ease: "easeOut" }} />
        ))}
      </svg>
      <div className="text-sm opacity-70">Nobody knows which of these lines is the real one.</div>
    </div>
  );
}

/* ---------- 5. after you connect ---------- */

type Mode = "run" | "pause" | "nokey";
const MODE_TEXT: Record<Mode, string> = {
  run: "The bot follows your rules. Each order goes to your own exchange account.",
  pause: "Paused. No new orders are sent. Open positions stay on your account.",
  nokey: "The key is deleted on the exchange. The bot cannot trade and has stopped.",
};

function BotControl() {
  const [mode, setMode] = useState<Mode>("run");
  const col = mode === "run" ? GOOD : mode === "pause" ? "#f5b942" : BAD;
  const label = mode === "run" ? "Running" : mode === "pause" ? "Paused" : "Stopped";
  const nodes = ["Signal", "Order", "Your exchange"];
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-70">ETH idea, 4h</span>
        <span className="flex items-center gap-2 rounded-full px-3 py-1 text-sm" style={{ background: "#ffffff14" }}>
          <motion.span className="h-2.5 w-2.5 rounded-full" style={{ background: col }} animate={mode === "run" ? { opacity: [1, 0.3, 1] } : { opacity: 1 }} transition={{ duration: 1.6, repeat: Infinity }} />{label}
        </span>
      </div>
      <div className="relative mt-8 flex items-center justify-between px-2">
        <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2" style={{ background: "#ffffff30" }} />
        {mode === "run" && <motion.span key="dot" className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full" style={{ background: GOOD, left: "8%" }} animate={{ left: ["8%", "50%", "88%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />}
        {nodes.map((n) => <span key={n} className="relative z-10 rounded-full px-4 py-2 text-sm" style={{ background: "#1c1e24", border: "1px solid #ffffff2a" }}>{n}</span>)}
      </div>
      <div className="mt-7 min-h-[3.2rem] text-[15px] leading-snug opacity-85">
        <AnimatePresence mode="wait"><motion.p key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{MODE_TEXT[mode]}</motion.p></AnimatePresence>
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {mode === "run" && <>
          <button onClick={() => setMode("pause")} className="rounded-full px-5 py-2.5" style={{ background: "#ffffff1c" }}>Pause the bot</button>
          <button onClick={() => setMode("nokey")} className="rounded-full px-5 py-2.5" style={{ background: "#ffffff1c" }}>Delete the key on the exchange</button>
        </>}
        {mode === "pause" && <button onClick={() => setMode("run")} className="rounded-full px-5 py-2.5 font-semibold" style={{ background: P.accent }}>Resume</button>}
        {mode === "nokey" && <button onClick={() => setMode("run")} className="rounded-full px-5 py-2.5 font-semibold" style={{ background: P.accent }}>Create a new key</button>}
      </div>
    </div>
  );
}

/* ---------- 6. changing the idea ---------- */

function CompareRuns() {
  const a = useMemo(() => series(21, 80, 0.14, 4.4, 40), []);
  const b = useMemo(() => series(21, 80, 0.2, 2.6, 40), []);
  const all = [...a, ...b], min = Math.min(...all) - 2, max = Math.max(...all) + 2, W = 600, H = 190;
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: "#fff" }}>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2"><i className="h-[3px] w-6 rounded" style={{ background: "#9a9a94" }} />Version 1</span>
        <span className="flex items-center gap-2"><i className="h-[3px] w-6 rounded" style={{ background: P.accent }} />Version 2, with an 8% loss limit</span>
        <span className="ml-auto opacity-50">example</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Two example test runs compared">
        <motion.path d={toPath(a, W, H, min, max)} fill="none" stroke="#9a9a94" strokeWidth="2.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8 }} />
        <motion.path d={toPath(b, W, H, min, max)} fill="none" stroke={P.accent} strokeWidth="2.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 1.4 }} />
      </svg>
    </div>
  );
}

/* ---------- exported: How it works ---------- */

export function HowDetails() {
  return (
    <>
      <IdeasStrip />
      <Band>
        <Block title="What the AI asks you" scene={<QuestionsBoard />}>
          <p>It asks about whatever your description leaves open: the timeframe, how much of the account goes into one trade, where you exit, what happens when a trade goes against you.</p>
          <p>If you say &ldquo;a small part of the account&rdquo;, it asks how small. The test starts when no question is left.</p>
        </Block>
        <Block title="What the test shows" scene={<TestPanel />} flip>
          <p>Your idea is replayed on years of past prices. You get the equity curve, the largest drop from a peak, the number of trades and the full trade list with dates and prices.</p>
          <p>Open any trade and check it against the chart. Fees and slippage are included at typical exchange levels. Real fills can differ, especially in fast markets.</p>
        </Block>
        <Block title="What the test cannot show" scene={<FuturePaths />}>
          <p>How the market will behave next. A strategy that looks good on history can lose money live, and one run on one period proves little.</p>
          <p>Try different periods and look at the worst stretch, not only the final line.</p>
        </Block>
        <Block title="After you connect your exchange" scene={<BotControl />} flip>
          <p>Orders appear in your own exchange account, and you can see every one of them there. You can pause the bot or stop it from Alvora at any time.</p>
          <p>If the bot fails for any reason, it stops placing new orders. Positions that are already open stay on your account, and you decide what to do with them.</p>
          <p>Try the controls in the example.</p>
        </Block>
        <Block title="Changing the idea" scene={<CompareRuns />}>
          <p>Describe the change, run the test again and compare the two results side by side. Nothing changes in the live bot until you confirm.</p>
        </Block>
      </Band>
    </>
  );
}

/* ---------- Security ---------- */

const PERMS: [string, boolean][] = [["Read the account balance", true], ["See open orders and positions", true], ["Place orders", true], ["Cancel orders", true], ["Withdraw funds", false], ["Transfer between accounts", false], ["Change password or exchange settings", false]];

function KeyMatrix() {
  const [tried, setTried] = useState(0);
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: "#fff" }}>
      <div className="text-sm opacity-60">What an Alvora key can do on your exchange</div>
      <ul className="mt-4">
        {PERMS.map(([n, ok], i) => (
          <motion.li key={n} initial={{ x: -24, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5, ease }} className="flex items-center justify-between gap-4 border-b py-3 text-lg last:border-b-0" style={{ borderColor: P.fg + "14" }}>
            <span style={{ opacity: ok ? 1 : 0.55, textDecoration: ok ? "none" : "line-through", textDecorationThickness: "1.5px" }}>{n}</span>
            <span className="grid h-7 w-7 place-items-center rounded-full text-sm font-bold" style={{ background: ok ? "#0B8F4A" : "#e8e7e1", color: ok ? "#fff" : "#8a8a84" }}>{ok ? "✓" : "×"}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-5 flex min-h-[3.2rem] flex-wrap items-center gap-4">
        <button onClick={() => setTried((x) => x + 1)} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: P.fg, color: "#fff" }}>Try to withdraw</button>
        <AnimatePresence mode="wait">
          {tried > 0 && (
            <motion.span key={tried} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="text-sm" style={{ color: "#c4321f" }}>
              Rejected by the exchange: this key has no withdrawal permission.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MoneyMap() {
  const W = 600, H = 316;
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="text-sm opacity-70">Where the money is, and what moves</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Diagram: Alvora sends orders to your exchange account, funds cannot flow back">
        <rect x="10" y="100" width="150" height="80" rx="18" fill="#1c1e24" stroke="#ffffff30" />
        <text x="85" y="146" textAnchor="middle" fill="#fff" fontSize="20" fontFamily={F.head}>Alvora</text>
        <rect x="400" y="60" width="190" height="160" rx="22" fill="#1c1e24" stroke={GOOD} strokeOpacity={0.7} />
        <text x="495" y="132" textAnchor="middle" fill="#fff" fontSize="19" fontFamily={F.head}>Your exchange</text>
        <text x="495" y="156" textAnchor="middle" fill={GOOD} fontSize="14">your funds stay here</text>
        <path d="M160 128 L400 128" stroke="#ffffff55" strokeWidth="1.5" />
        <text x="280" y="116" textAnchor="middle" fill="#fff" fillOpacity={0.7} fontSize="13">orders</text>
        {[0, 1, 2].map((k) => <motion.circle key={k} r="5" cy="128" fill={GOOD} initial={{ cx: 160, opacity: 0 }} animate={{ cx: [160, 400], opacity: [0, 1, 1, 0] }} transition={{ duration: 2.4, delay: k * 0.8, repeat: Infinity, ease: "linear" }} />)}
        <path d="M400 168 L160 168" stroke={BAD} strokeWidth="1.5" strokeDasharray="5 6" strokeOpacity={0.8} />
        <text x="280" y="204" textAnchor="middle" fill={BAD} fontSize="13">withdrawals: off</text>
        <motion.g animate={{ opacity: [1, 0.35, 1], scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: "280px 168px" }}>
          <circle cx="280" cy="168" r="12" fill={INK} stroke={BAD} strokeWidth="2" />
          <path d="M274 162 L286 174 M286 162 L274 174" stroke={BAD} strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <rect x="60" y="250" width="130" height="44" rx="22" fill="#1c1e24" stroke="#ffffff30" />
        <text x="125" y="277" textAnchor="middle" fill="#fff" fontSize="16">You</text>
        <path d="M190 272 C 300 272, 440 262, 480 222" stroke="#ffffff55" fill="none" strokeWidth="1.5" strokeDasharray="4 5" />
        <text x="340" y="296" textAnchor="middle" fill="#fff" fillOpacity={0.7} fontSize="13">you create and can delete the key</text>
      </svg>
    </div>
  );
}


function ExchangeMock() {
  const [has, setHas] = useState(true);
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: "#fff" }}>
      <div className="flex items-center justify-between text-sm"><span className="opacity-60">Your exchange, API management</span><span className="opacity-40">example screen</span></div>
      <div className="mt-5 min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          {has ? (
            <motion.div key="row" exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden rounded-2xl border p-4" style={{ borderColor: P.fg + "22" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><div className="text-lg" style={{ fontFamily: F.head, fontWeight: F.weight, letterSpacing: F.track }}>alvora-bot</div><div className="mt-1 text-sm opacity-60">created Oct 5, 2026</div></div>
                <button onClick={() => setHas(false)} className="rounded-full px-4 py-2 text-sm" style={{ background: "#fde4e0", color: "#b3261e" }}>Delete</button>
              </div>
              <div className="mt-3 flex gap-2 text-xs"><span className="rounded-full px-3 py-1" style={{ background: "#e3f5ea", color: "#0B6B38" }}>Read</span><span className="rounded-full px-3 py-1" style={{ background: "#e3f5ea", color: "#0B6B38" }}>Trade</span><span className="rounded-full px-3 py-1" style={{ background: "#eeeee9", color: "#777" }}>Withdraw: off</span></div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed p-5 text-[15px] leading-snug" style={{ borderColor: P.fg + "33" }}>
              No API keys. Alvora can no longer see this account or send orders, and the bot has stopped.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!has && <button onClick={() => setHas(true)} className="mt-4 text-sm underline">Show the key again</button>}
    </div>
  );
}

const RISKS = [["The market", "It can move against your idea. Any strategy can lose money."], ["The exchange", "It can go down or slow down in the middle of a trade."], ["The past", "An idea that worked on history can fail on the next stretch."], ["The software", "It can have errors. This is why a failed bot stops and does not keep trading."]];

export function SecurityDetails() {
  return (
    <>
      <Band>
        <Block title="What the key allows" scene={<KeyMatrix />}>
          <p>You create the API key yourself on the exchange. Alvora asks for two permissions: reading balances and placing or cancelling orders. Withdrawals stay off.</p>
          <p>An exchange does not let a key without withdrawal rights move funds out, whatever any software tries. Press the button in the example to see what that looks like.</p>
        </Block>
        <Block title="What Alvora can see, and what it cannot do" scene={<MoneyMap />} flip>
          <p>Alvora sees the balance of the connected account, open orders and positions. Nothing else on your exchange and nothing on other exchanges.</p>
          <p>It cannot withdraw, transfer funds between accounts, or change your password or exchange settings. Funds stay on your account at all times, so there is no balance at Alvora that could be lost or frozen.</p>
        </Block>
        <Block title="What you can check yourself" scene={<ExchangeMock />}>
          <p>Open the API section of your exchange. It lists the key, its permissions and when it was created. You can edit the permissions or delete the key from there, no matter what Alvora shows on its side.</p>
          <p>Delete the key in the example and see what Alvora loses.</p>
        </Block>
        <div className="mx-auto w-full max-w-6xl">
          <h3 style={{ ...head, fontSize: "clamp(1.9rem,3.2vw,3.2rem)" }}>Risks that remain</h3>
          <p className="mt-5 max-w-xl text-lg leading-snug opacity-85">Trading involves risk of loss. Alvora cannot take your funds, but it cannot make a bad idea good either.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {RISKS.map(([t, d], i) => (
              <motion.div key={t} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.1, ease }} className="rounded-[22px] p-6" style={{ background: "#fff" }}>
                <motion.div className="mb-5 h-[3px] rounded" style={{ background: P.fg }} initial={{ width: 0 }} whileInView={{ width: 48 + i * 18 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} />
                <div style={{ ...head, fontSize: "1.6rem" }}>{t}</div>
                <p className="mt-3 leading-snug opacity-80">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Band>
    </>
  );
}

/* ---------- Pricing ---------- */

function CostCompare() {
  const W = 600, H = 220, n = 24;
  const share = useMemo(() => Array.from({ length: n }, (_, i) => 30 + i * 3.2 + Math.sin(i * 0.9) * 22 + (i % 5) * 4), []);
  const flat = Array.from({ length: n }, () => 70);
  const max = 190;
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="flex items-center gap-2"><i className="h-[3px] w-6 rounded" style={{ background: P.accent }} />Flat subscription</span>
        <span className="flex items-center gap-2"><i className="h-[3px] w-6 rounded" style={{ background: "#ffffff80" }} />A share of profit</span>
        <span className="ml-auto"><Tag>illustration, not real prices</Tag></span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Flat cost stays level while a profit share changes with results">
        <motion.path d={toPath(share, W, H, 0, max)} fill="none" stroke="#ffffff80" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, ease: "easeInOut" }} />
        <motion.path d={toPath(flat, W, H, 0, max)} fill="none" stroke={P.accent} strokeWidth="3.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.3 }} />
      </svg>
      <div className="mt-2 flex justify-between text-xs opacity-60"><span>month 1</span><span>month 24</span></div>
    </div>
  );
}

export function PricingDetails() {
  return (
    <Band>
      <Block title="How the plan is chosen" scene={<CostCompare />}>
        <p>The plan depends on the size of the account you connect. Alvora does not take a share of your profit, and the subscription stays the same whether your bot makes money or not.</p>
        <p>Prices will be announced before launch.</p>
      </Block>
    </Band>
  );
}

/* ---------- Home: about ---------- */

const IS = ["A place to describe a trading idea in plain words", "A test of that idea on years of history", "A bot that runs it on your own exchange account"];
const ISNT = ["A fund that pools money", "An adviser who tells you what to trade", "A custodian that holds your funds"];

function WhatWeAre() {
  const col = (title: string, items: string[], ok: boolean, d0: number) => (
    <div>
      <div className="text-sm opacity-60">{title}</div>
      <ul className="mt-4 space-y-4">
        {items.map((t, i) => (
          <motion.li key={t} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: d0 + i * 0.18, duration: 0.6, ease }} className="flex gap-3 leading-snug">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: ok ? "#0B8F4A" : "#e8e7e1", color: ok ? "#fff" : "#8a8a84" }}>{ok ? "✓" : "×"}</span>
            <span style={{ opacity: ok ? 1 : 0.6 }}>{t}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="grid gap-8 rounded-[26px] p-6 sm:grid-cols-2 md:p-8" style={{ background: "#fff" }}>
      {col("Alvora is", IS, true, 0)}
      {col("Alvora is not", ISNT, false, 0.5)}
    </div>
  );
}

function arc(cx: number, cy: number, r: number, h0: number, h1: number) {
  const a = (h: number) => ((h / 24) * 360 - 90) * (Math.PI / 180);
  const [x0, y0, x1, y1] = [cx + r * Math.cos(a(h0)), cy + r * Math.sin(a(h0)), cx + r * Math.cos(a(h1)), cy + r * Math.sin(a(h1))];
  return `M${x0},${y0} A${r},${r} 0 ${h1 - h0 > 12 ? 1 : 0} 1 ${x1},${y1}`;
}

function AroundTheClock() {
  const cx = 150, cy = 150;
  const sessions: [string, number, number, number][] = [["Asia", 0, 9, 112], ["Europe", 7, 16, 98], ["US", 13, 22, 84]];
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="text-sm opacity-70">One day on a crypto exchange</div>
      <svg viewBox="0 0 300 300" className="mx-auto mt-3 w-full max-w-[380px]" role="img" aria-label="A clock face showing three overlapping market sessions over 24 hours">
        {Array.from({ length: 24 }, (_, h) => { const a = ((h / 24) * 360 - 90) * (Math.PI / 180); return <line key={h} x1={cx + 128 * Math.cos(a)} y1={cy + 128 * Math.sin(a)} x2={cx + (h % 6 ? 122 : 116) * Math.cos(a)} y2={cy + (h % 6 ? 122 : 116) * Math.sin(a)} stroke="#fff" strokeOpacity={h % 6 ? 0.3 : 0.7} strokeWidth={h % 6 ? 1 : 1.6} />; })}
        {sessions.map(([n, a, b, r], i) => (
          <motion.path key={n} d={arc(cx, cy, r, a, b)} fill="none" stroke={[P.accent, GOOD, "#fff"][i]} strokeOpacity={i === 2 ? 0.7 : 1} strokeWidth="9" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: i * 0.5, ease: "easeInOut" }} />
        ))}
        <g>
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="60s" repeatCount="indefinite" />
          <line x1={cx} y1={cy} x2={cx} y2={cy - 122} stroke={BAD} strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx={cx} cy={cy} r="5" fill={BAD} />
        <text x={cx} y={cy + 52} textAnchor="middle" fill="#fff" fillOpacity={0.5} fontSize="12">24 hours, no closing bell</text>
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
        {sessions.map(([n], i) => <span key={n} className="flex items-center gap-2 opacity-80"><i className="h-2 w-5 rounded" style={{ background: [P.accent, GOOD, "#fff"][i] }} />{n}</span>)}
      </div>
    </div>
  );
}

function Regimes() {
  const parts = useMemo(() => {
    const trend = series(3, 32, 0.9, 1.6, 20), range = series(9, 34, 0, 2.2, trend[trend.length - 1]);
    const drop = series(14, 14, -2.1, 1.8, range[range.length - 1]), calm = series(5, 20, 0.35, 1.2, drop[drop.length - 1]);
    return [trend, range, drop, calm];
  }, []);
  const all = parts.flat(), W = 600, H = 220, n = all.length;
  const min = Math.min(...all) - 3, max = Math.max(...all) + 3;
  const path = toPath(all, W, H, min, max);
  let acc = 0;
  const bands = parts.map((p, i) => { const x0 = (acc / (n - 1)) * W; acc += p.length; const x1 = Math.min(((acc - 1) / (n - 1)) * W, W); return { x0, w: x1 - x0 + (i < 3 ? 0 : 0), label: ["trend", "sideways", "sharp drop", "recovery"][i], tint: ["#3ddc84", "#ffffff", "#ff5a4a", "#3ddc84"][i], o: [0.12, 0.07, 0.16, 0.08][i] }; });
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="flex items-center justify-between text-sm"><span className="opacity-70">One price line, four moods</span><Tag>illustration</Tag></div>
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="mt-3 w-full" role="img" aria-label="A price line passing through a trend, a sideways stretch, a sharp drop and a recovery">
        {bands.map((b, i) => (
          <g key={b.label}>
            <motion.rect x={b.x0} y={0} width={b.w} height={H} fill={b.tint} initial={{ opacity: 0 }} whileInView={{ opacity: b.o }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.9, duration: 0.8 }} />
            <motion.text x={b.x0 + b.w / 2} y={H + 17} textAnchor="middle" fill="#fff" fontSize="12" initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.9 }}>{b.label}</motion.text>
          </g>
        ))}
        <motion.path d={path} fill="none" stroke="#fff" strokeWidth="2.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3.6, ease: "linear" }} />
      </svg>
    </div>
  );
}

const COND_N = 48;

function Conditions() {
  const W = 600, H = 220, D = 10;
  const { candles, buys, sells, min, max } = useMemo(() => {
    const close = series(8, COND_N + 1, 0.05, 5.5, 50), jit = series(33, COND_N, 0, 3.2, 0);
    const cs = Array.from({ length: COND_N }, (_, i) => {
      const o = close[i], c = close[i + 1], w1 = Math.abs(jit[i] - (jit[i - 1] ?? 0)) * 0.5 + 0.6, w2 = Math.abs(jit[i] - (jit[i - 2] ?? 0)) * 0.4 + 0.6;
      return { o, c, h: Math.max(o, c) + w1, l: Math.min(o, c) - w2 };
    });
    const pick = (from: number, to: number, low: boolean) => { let k = from; for (let i = from; i <= to; i++) if (low ? cs[i].l < cs[k].l : cs[i].h > cs[k].h) k = i; return k; };
    const bu = [pick(4, 11, true), pick(19, 26, true), pick(34, 40, true)], se = [pick(12, 18, false), pick(27, 33, false), pick(41, 47, false)];
    return { candles: cs, buys: bu, sells: se, min: Math.min(...cs.map((x) => x.l)) - 2, max: Math.max(...cs.map((x) => x.h)) + 2 };
  }, []);
  const bw = W / COND_N, x = (i: number) => i * bw + bw / 2, y = (v: number) => H - ((v - min) / (max - min)) * H;
  const mark = (i: number, up: boolean) => {
    const f = Math.min(0.94, (i + 0.5) / COND_N), col = up ? GOOD : BAD;
    const cy = up ? y(candles[i].l) + 14 : y(candles[i].h) - 14;
    return (
      <motion.path key={(up ? "b" : "s") + i} d={up ? `M${x(i)},${cy - 7} l7,12 h-14 z` : `M${x(i)},${cy + 7} l7,-12 h-14 z`} fill={col}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: D, times: [0, f, Math.min(f + 0.03, 0.97), 0.97, 1], repeat: Infinity, ease: "linear" }} />
    );
  };
  return (
    <div className="rounded-[26px] p-5 md:p-7" style={{ background: INK, color: "#fff" }}>
      <div className="flex items-center justify-between text-sm"><span className="opacity-70">An idea, checked against every candle</span><Tag>illustration</Tag></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Candles with entry and exit markers appearing where the conditions are met">
        {candles.map((c, i) => (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={c.c >= c.o ? GOOD : BAD} strokeOpacity={0.55} strokeWidth="1.3" />
            <rect x={x(i) - bw * 0.3} y={y(Math.max(c.o, c.c))} width={bw * 0.6} height={Math.max(2, Math.abs(y(c.o) - y(c.c)))} rx="1" fill={c.c >= c.o ? GOOD : BAD} fillOpacity={0.55} />
          </g>
        ))}
        {buys.map((i) => mark(i, true))}
        {sells.map((i) => mark(i, false))}
        <motion.line y1={0} y2={H} stroke="#fff" strokeOpacity={0.35} strokeWidth="1.5" initial={{ x1: 0, x2: 0 }} animate={{ x1: [0, W], x2: [0, W] }} transition={{ duration: D, repeat: Infinity, ease: "linear" }} />
      </svg>
      <ul className="mt-4 space-y-2 text-[15px]">
        <li className="flex items-center gap-3"><span style={{ color: GOOD }}>▲</span><span className="opacity-90">Buy when RSI is below 30 and price is above the 200 EMA</span></li>
        <li className="flex items-center gap-3"><span style={{ color: BAD }}>▼</span><span className="opacity-90">Sell when RSI is back above 55</span></li>
      </ul>
    </div>
  );
}

export function AboutDetails() {
  return (
    <Band id="about">
      <Block title="Software for people who trade their own money" scene={<WhatWeAre />}>
        <p>Alvora is software. You describe an idea, we test it on history, and a bot runs it on an account that stays yours.</p>
        <p>We do not pool money, hold funds or tell anyone what to buy. The ideas are yours, and so are the decisions. We build the part between a thought and a running bot.</p>
      </Block>
      <Block title="Markets that never close" scene={<AroundTheClock />} flip>
        <p>Crypto exchanges trade every hour of every day. Asia, Europe and the US take turns, and prices move at 3 a.m. as readily as at noon.</p>
        <p>A person has to sleep and look away. A rule written once keeps watching, and it acts only on the conditions you gave it.</p>
      </Block>
      <Block title="Prices change their character" scene={<Regimes />}>
        <p>Markets spend long stretches trending, then drifting sideways, then dropping fast. An idea that suits one kind of stretch can struggle in another.</p>
        <p>A test over many years is worth more than a test over one good month, because it shows your idea in all of them.</p>
      </Block>
      <Block title="An idea is a set of conditions" scene={<Conditions />} flip>
        <p>However loosely you put it, an idea comes down to conditions: when this and that are true, do this. That is the part a bot can follow without guessing.</p>
        <p>If a condition is missing, the AI asks until each one is clear. That is why you begin with your own words.</p>
      </Block>
    </Band>
  );
}
