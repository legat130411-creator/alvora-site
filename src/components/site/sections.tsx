"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { FONTS, onC, type Palette } from "./tokens";
import { ChatDemo } from "./chat";

type Ctx = { p: Palette; f: (typeof FONTS)[string] };
const hd = (c: Ctx, size: string): React.CSSProperties => ({ fontFamily: c.f.head, fontWeight: c.f.weight, letterSpacing: c.f.track, textTransform: c.f.upper ? "uppercase" : undefined, lineHeight: 0.95, fontSize: `calc(${size} * ${/Syne|Unbounded|Archivo/.test(c.f.head) ? 1 : 1.3} * var(--head-scale, 1))` });
const btn = (c: Ctx): React.CSSProperties => ({ background: c.p.accent, color: onC(c.p.accent) });

const reveal = { initial: { y: 50, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const } };

export function Story({ c, alt }: { c: Ctx; alt?: boolean }) {
  const steps = [
    { t: "Describe it", d: "Tell the AI your idea in your own words. It asks about anything unclear until the idea is exact.", v: <ChatDemo p={c.p} plain /> },
    { t: "Test it", d: "See how your idea would have traded over years of real market history, fees included. Every trade is on the list, so you can check the logic yourself.", v: <TestCard c={c} /> },
    { t: "Run it on your account", d: "Create a trade-only API key on your own exchange and paste it in. Orders go to your account and your funds never leave it.", v: <KeyCard c={c} /> },
  ];
  return (
    <section style={{ background: alt ? c.p.card : c.p.bg, color: alt ? onC(c.p.card) : c.p.fg }} className="px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.2fr]">
        <div className="md:sticky md:top-24 md:h-fit">
          <h2 style={hd(c, "clamp(2rem,3.7vw,3.8rem)")}>From your idea to a running bot.</h2>
          <p className="mt-6 max-w-sm opacity-80">Nothing reaches the market until you have seen how the idea behaves on history.</p>
        </div>
        <div className="space-y-24">
          {steps.map((s) => (
            <motion.div key={s.t} {...reveal}>
              <div style={hd(c, "clamp(1.8rem,2.8vw,2.8rem)")}>{s.t}</div>
              <p className="mt-3 max-w-md opacity-80">{s.d}</p>
              <div className="mt-6">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestCard({ c }: { c: Ctx }) {
  const rows = [["Mar 04", "Buy ETH", "2,141"], ["Mar 09", "Sell ETH", "2,298"], ["Mar 17", "Buy ETH", "2,052"], ["Mar 21", "Sell ETH", "2,187"]];
  const ink = onC(c.p.card), good = ink === "#FFFFFF" ? "#7CFF8A" : "#0B8F4A";
  const d = React.useMemo(() => { let s = 5 * 1237 + 11, v = 40; return Array.from({ length: 60 }, (_, i) => { s = (s * 16807) % 2147483647; v += (s / 2147483647 - 0.36) * 6; return `${i ? "L" : "M"}${i * 5},${90 - v}`; }).join(" "); }, []);
  return (
    <div className="rounded-[22px] p-6" style={{ background: c.p.card, color: ink }}>
      <div className="flex justify-between text-sm opacity-70"><span>Backtest on 5 years of history</span><span>example</span></div>
      <svg viewBox="0 0 300 100" className="mt-3 w-full"><motion.path d={d} fill="none" stroke={good} strokeWidth="2.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut" }} /></svg>
      <ul className="mt-3 divide-y text-sm" style={{ borderColor: ink + "22" }}>
        {rows.map((r) => <li key={r[0] + r[1]} className="flex justify-between py-1.5" style={{ borderColor: ink + "22" }}><span className="opacity-60">{r[0]}</span><span>{r[1]}</span><span className="tabular-nums">{r[2]}</span></li>)}
      </ul>
    </div>
  );
}

export function KeyCard({ c }: { c: Ctx }) {
  const rows = [["Read balances", true], ["Place and cancel orders", true], ["Withdraw funds", false]] as const;
  const [on, setOn] = useState(false);
  const ink = onC(c.p.card);
  return (
    <div className="rounded-[22px] p-6" style={{ background: c.p.card, color: ink }}>
      <div className="text-sm opacity-70">API key permissions you create on the exchange</div>
      <ul className="mt-4 space-y-3">
        {rows.map(([n, ok], i) => {
          const live = i === 2 ? on : ok;
          return (
            <li key={n} className="flex items-center justify-between text-lg">
              <span>{n}</span>
              <button onClick={() => i === 2 && setOn(!on)} className="relative h-7 w-14 rounded-full" style={{ background: live ? (i === 2 ? "#ff5a4a" : "#3ddc84") : "#ffffff30" }} aria-label={n}>
                <motion.span className="absolute top-1 h-5 w-5 rounded-full bg-white" animate={{ left: live ? 32 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              </button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence mode="wait"><motion.p key={String(on)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-sm" style={{ color: on ? "#ff9d92" : "#8be9b0" }}>{on ? "Alvora would refuse this key. Withdrawal rights must stay off." : "Accepted. This key can trade and nothing else."}</motion.p></AnimatePresence>
    </div>
  );
}

export function Security({ c }: { c: Ctx }) {
  return (
    <section style={{ background: c.p.accent, color: onC(c.p.accent) }} className="overflow-hidden px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div {...reveal}><h2 style={hd(c, "clamp(2rem,4.2vw,4.6rem)")}>We cannot move your money. Try making us.</h2></motion.div>
        <motion.div {...reveal} className="text-black"><KeyCard c={{ ...c, p: { ...c.p, card: "#0A0A0A" } }} /></motion.div>
      </div>
    </section>
  );
}

export function PricingSlider({ c }: { c: Ctx }) {
  const tiers = [{ n: "Starter", max: 5000, bots: "" }, { n: "Growth", max: 50000, bots: "" }, { n: "Pro", max: 1e6, bots: "" }];
  const [v, setV] = useState(12);
  const acct = Math.round(Math.pow(10, 2.7 + (v / 100) * 3.3));
  const t = tiers.find((x) => acct <= x.max)!;
  return (
    <section style={{ background: c.p.bg, color: c.p.fg }} className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 style={hd(c, "clamp(2rem,3.7vw,3.8rem)")}>The plan follows your account size.</h2>
        <p className="mt-4 max-w-md opacity-80">No share of profit. You pay a flat subscription, and the tier depends on how much capital the connected account holds.</p>
        <div className="mt-12 rounded-[28px] p-8 md:p-12" style={{ background: c.p.card, color: onC(c.p.card) }}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><div className="text-sm opacity-70">connected account</div><div style={hd(c, "clamp(2.6rem,6vw,6rem)")} className="tabular-nums">${acct.toLocaleString("en-US")}</div></div>
            <AnimatePresence mode="wait"><motion.div key={t.n} initial={{ y: 30, opacity: 0, rotate: -3 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -30, opacity: 0 }} className="rounded-2xl px-6 py-4 text-right" style={btn(c)}><div style={hd(c, "2.4rem")}>{t.n}</div><div className="text-sm opacity-80">price to be announced</div></motion.div></AnimatePresence>
          </div>
          <input type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} className="mt-10 w-full" style={{ accentColor: c.p.accent }} aria-label="account size" />
        </div>
      </div>
    </section>
  );
}

export function Faq({ c }: { c: Ctx }) {
  const q = [["Can Alvora withdraw my funds?", "No. The key you create on your exchange has trading rights only. A key with withdrawals switched on is rejected when you connect it."], ["Do you take a share of profit?", "No. You pay a flat subscription, and the plan depends on the size of the connected account."], ["Do I need to write code?", "No. You describe the idea in plain words, and the AI asks questions until it is clear."], ["Can I change the strategy later?", "Yes. Describe the change, run the test again and decide if it goes live."], ["What if the test looks great?", "Past results do not promise future ones. The test shows how your idea behaved on history, nothing more."]];
  const [o, setO] = useState(0);
  return (
    <section style={{ background: c.p.bg, color: c.p.fg }} className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h2 style={hd(c, "clamp(2rem,3.7vw,3.8rem)")}>Questions people ask first.</h2>
        <div className="mt-10 divide-y" style={{ borderColor: c.p.fg + "33" }}>
          {q.map(([a, b], i) => (
            <button key={a} onClick={() => setO(o === i ? -1 : i)} className="block w-full border-t py-6 text-left" style={{ borderColor: c.p.fg + "44" }}>
              <div className="flex items-center justify-between gap-6 text-2xl md:text-3xl" style={{ fontFamily: c.f.head, fontWeight: c.f.weight, letterSpacing: c.f.track }}><span>{a}</span><motion.span animate={{ rotate: o === i ? 45 : 0 }} className="text-4xl leading-none">+</motion.span></div>
              <AnimatePresence initial={false}>{o === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="max-w-xl overflow-hidden pt-3 text-lg opacity-80">{b}</motion.p>}</AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ c }: { c: Ctx }) {
  return (
    <footer style={{ background: c.p.card, color: onC(c.p.card) }} className="overflow-hidden px-6 pt-20 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-8 text-sm opacity-80"><span>Alvora Capital</span><span>Trading involves risk of loss.</span><span>alvoracapital.net</span></div>
      <motion.div {...reveal} viewport={{ once: true, margin: "0px" }} className="mt-10 select-none text-center leading-[0.8]" style={{ ...hd(c, "clamp(4rem,15vw,19rem)"), color: c.p.accent === c.p.card ? "#fff" : c.p.accent, marginBottom: "-0.12em" }}>alvora</motion.div>
    </footer>
  );
}

