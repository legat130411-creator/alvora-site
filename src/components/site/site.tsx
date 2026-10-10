"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { FONTS, PALETTES, Wall, onC } from "./tokens";
import { AboutDetails, HowDetails, SecurityDetails, PricingDetails } from "./more";
import { Story, Security, Faq, Footer, KeyCard } from "./sections";

const P = PALETTES.bone, F = FONTS.fraunces;
const c = { p: P, f: F };
const head: React.CSSProperties = { fontFamily: F.head, fontWeight: F.weight, letterSpacing: F.track, lineHeight: 0.95 };
const BASE = "";
const APP = "https://app.alvoracapital.net";
const NAV = [["How it works", "/how-it-works"], ["Security", "/security"], ["Pricing", "/pricing"]];

export function Header({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 md:px-10" style={{ background: P.bg, color: P.fg, borderBottom: `1px solid ${P.fg}18`, fontFamily: F.body }}>
      <Link href="/" style={{ ...head, fontSize: 26 }}>alvora</Link>
      <nav className="hidden items-center gap-9 text-[15px] md:flex">
        {NAV.map(([l, h]) => (
          <Link key={h} href={BASE + h} className="relative py-1" style={{ opacity: active === h ? 1 : 0.75 }}>
            {l}
            {active === h && <motion.span layoutId="nav-u" className="absolute inset-x-0 -bottom-0.5 h-[2px]" style={{ background: P.accent }} />}
          </Link>
        ))}
      </nav>
      <a href={APP} className="text-[15px] opacity-75 hover:opacity-100">Sign in</a>
    </header>
  );
}

export function StartButton({ big = false, label = "Start building" }: { big?: boolean; label?: string }) {
  return (
    <span className="relative inline-flex">
      <motion.span className="absolute inset-0 rounded-full" style={{ background: P.accent }} animate={{ scale: [1, 1.18, 1.18], opacity: [0.45, 0, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />
      <a href={APP + "/signup"} className={`relative inline-flex cursor-pointer items-center rounded-full font-semibold transition-transform hover:scale-[1.04] ${big ? "px-10 py-5 text-xl" : "px-8 py-4 text-lg"}`} style={{ background: P.accent, color: onC(P.accent), fontFamily: F.body }}>{label}</a>
    </span>
  );
}

export function HomeHero() {
  return (
    <section className="relative isolate flex w-full items-center justify-center overflow-hidden px-6" style={{ background: P.bg, color: P.fg, height: "calc(100vh - 73px)", minHeight: 560, fontFamily: F.body }}>
      <Wall p={P} />
      <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }} className="relative z-10 max-w-3xl rounded-[28px] p-8 md:p-12" style={{ background: P.bg }}>
        <h1 style={{ ...head, fontSize: "calc(clamp(2.6rem,5.6vw,5.8rem) * var(--head-scale, 1))", textWrap: "balance" }}>Describe your idea. Get a tested bot.</h1>
        <p className="mt-6 max-w-lg text-lg leading-snug opacity-85">Tell the AI how you want to trade. It asks what&apos;s missing and shows the backtest. The bot then runs on your own exchange account, and Alvora cannot withdraw your funds.</p>
        <div className="mt-9"><StartButton big /></div>
      </motion.div>
      <a href="#about" className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full px-4 py-2 text-sm" style={{ background: P.bg, color: P.fg }} aria-label="Read about Alvora">
        <span>About Alvora</span>
        <motion.svg width="16" height="16" viewBox="0 0 16 16" fill="none" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}><path d="M3 6l5 5 5-5" stroke={P.fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></motion.svg>
      </a>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="px-6 py-24 text-center md:px-10" style={{ background: P.card, color: onC(P.card) }}>
      <h2 style={{ ...head, fontSize: "calc(clamp(2.2rem,4.6vw,4.8rem) * var(--head-scale, 1))" }}>Describe your first idea.</h2>
      <div className="mt-8"><StartButton big /></div>
    </section>
  );
}

export function PageTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="px-6 pb-6 pt-20 md:px-10" style={{ background: P.bg, color: P.fg }}>
      <div className="mx-auto max-w-6xl">
        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ ...head, fontSize: "calc(clamp(2.8rem,7vw,7.5rem) * var(--head-scale, 1))", textWrap: "balance" }}>{title}</motion.h1>
        <p className="mt-6 max-w-xl text-xl leading-snug opacity-80" style={{ fontFamily: F.body }}>{sub}</p>
      </div>
    </section>
  );
}

export function ProcessCta() {
  return (
    <section className="px-6 py-24 text-center md:px-10" style={{ background: P.card, color: onC(P.card) }}>
      <h2 style={{ ...head, fontSize: "calc(clamp(2.2rem,4.6vw,4.8rem) * var(--head-scale, 1))", textWrap: "balance" }}>See what happens after you describe an idea.</h2>
      <div className="mt-8">
        <Link href="/how-it-works" className="inline-flex items-center rounded-full px-10 py-5 text-xl font-semibold transition-transform hover:scale-[1.04]" style={{ background: P.fg, color: "#fff", fontFamily: F.body }}>See the process</Link>
      </div>
    </section>
  );
}

export function HomePage() { return (<><Header /><HomeHero /><AboutDetails /><ProcessCta /><Footer c={c} /></>); }
export function HowPage() { return (<><Header active="/how-it-works" /><Story c={c} /><HowDetails /><Faq c={c} /><CtaBand /><Footer c={c} /></>); }
export function SecurityPage() {
  return (
    <>
      <Header active="/security" />
      <PageTitle title="Your keys, your exchange, your funds." sub="Alvora connects to your exchange with an API key that you create and can delete at any time. The key can trade. It cannot withdraw." />
      <section className="px-6 py-16 md:px-10" style={{ background: P.bg, color: P.fg }}>
        <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-2">
          <div className="space-y-8 text-lg leading-snug">
            {[["We never hold your money", "Funds stay on your exchange account the whole time. There is nothing to withdraw from us."], ["Withdrawals are off", "If a key with withdrawal rights is pasted in, Alvora refuses it."], ["You stay in control", "Delete the key on your exchange and the bot stops at once."]].map(([t, d]) => (
              <div key={t}><div style={{ ...head, fontSize: "1.9rem" }}>{t}</div><p className="mt-2 opacity-80">{d}</p></div>
            ))}
          </div>
          <KeyCard c={c} />
        </div>
      </section>
      <SecurityDetails />
      <CtaBand /><Footer c={c} />
    </>
  );
}
const PLANS = [
  { n: "Start", price: 19, blurb: "For your first bots.", rows: [["Bots at once", "2"], ["Exchanges", "1"], ["AI ideas a month", "15"], ["Test reruns", "No limit"], ["Price history", "Daily and hourly"], ["Alerts", "Email"], ["Support", "Email"]] },
  { n: "Plus", price: 39, blurb: "For a small set of bots.", dark: true, rows: [["Bots at once", "5"], ["Exchanges", "2"], ["AI ideas a month", "40"], ["Test reruns", "No limit"], ["Price history", "Down to the minute"], ["Alerts", "Email and Telegram"], ["Support", "Email"]] },
  { n: "Pro", price: 59, blurb: "For a larger setup.", rows: [["Bots at once", "10"], ["Exchanges", "3"], ["AI ideas a month", "100"], ["Test reruns", "No limit"], ["Price history", "Down to the minute"], ["Alerts", "Email and Telegram"], ["Support", "Priority"]] },
] as const;

function PricingPlans() {
  const [yearly, setYearly] = useState(false);
  return (
    <section className="px-6 pb-20 pt-10 md:px-10" style={{ background: P.bg, color: P.fg, fontFamily: F.body }}>
      <div className="mx-auto max-w-6xl">
        <div className="inline-flex rounded-full p-1" style={{ background: "#0000000f" }} role="group" aria-label="Billing period">
          {[["Monthly", false], ["Yearly, 2 months free", true]].map(([l, y]) => (
            <button key={String(l)} onClick={() => setYearly(y as boolean)} aria-pressed={yearly === y} className="relative rounded-full px-5 py-2 text-sm font-semibold">
              {yearly === y && <motion.span layoutId="billing" className="absolute inset-0 rounded-full" style={{ background: P.fg }} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative" style={{ color: yearly === y ? P.bg : P.fg }}>{l as string}</span>
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PLANS.map((pl, i) => {
            const dark = "dark" in pl && pl.dark;
            const fg = dark ? "#fff" : P.fg;
            return (
              <motion.div key={pl.n} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.08 }} className="flex flex-col rounded-[28px] p-7 md:p-8" style={{ background: dark ? "#0A0A0A" : P.card, color: fg }}>
                <div style={{ ...head, fontSize: "calc(2rem * var(--head-scale, 1))" }}>{pl.n}</div>
                <p className="mt-1 text-sm opacity-65">{pl.blurb}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={String(yearly)} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.22 }} className="tabular-nums" style={{ ...head, fontSize: "calc(4rem * var(--head-scale, 1))" }}>${yearly ? pl.price * 10 : pl.price}</motion.span>
                  </AnimatePresence>
                  <span className="text-sm opacity-65">{yearly ? "a year" : "a month"}</span>
                </div>
                <div className="mt-1 h-5 text-sm opacity-65">{yearly ? `Pay for 10 months, use 12. That is $${(pl.price * 10 / 12).toFixed(2)} a month.` : ""}</div>
                <ul className="mt-6 flex-1">
                  {pl.rows.map(([k, v]) => (
                    <li key={k} className="flex items-baseline justify-between gap-4 border-t py-3 text-[15px]" style={{ borderColor: fg + "22" }}><span className="opacity-65">{k}</span><span className="text-right font-semibold">{v}</span></li>
                  ))}
                </ul>
                <a href={APP + "/signup"} className="mt-6 inline-flex justify-center rounded-full px-6 py-3.5 font-semibold transition-transform hover:scale-[1.03]" style={{ background: dark ? P.accent : P.fg, color: dark ? onC(P.accent) : P.bg }}>Choose {pl.n}</a>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-[28px] p-7 md:flex-row md:items-center md:p-8" style={{ background: P.card }}>
          <div>
            <div style={{ ...head, fontSize: "calc(1.8rem * var(--head-scale, 1))" }}>Try it before you pay.</div>
            <p className="mt-2 max-w-xl opacity-75">Describe two ideas and see their backtests. No card needed. Running a bot starts on a paid plan.</p>
          </div>
          <StartButton label="Try two ideas" />
        </div>
        <p className="mt-6 text-sm opacity-60">Pay by card. Alvora does not take a share of your profit.</p>
      </div>
    </section>
  );
}

export function PricingPage() {
  return (
    <>
      <Header active="/pricing" />
      <PageTitle title="One subscription. No share of your profit." sub="Choose a plan by how many bots, exchanges and ideas you need. Pay monthly or yearly by card." />
      <PricingPlans />
      <PricingDetails />
      <CtaBand /><Footer c={c} />
    </>
  );
}
