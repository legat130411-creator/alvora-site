"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FONTS, PALETTES, Wall, onC } from "./tokens";
import { HowDetails, SecurityDetails, PricingDetails } from "./more";
import { Story, Security, PricingSlider, Faq, Footer, KeyCard } from "./sections";

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
        <h1 style={{ ...head, fontSize: "clamp(2.6rem,5.6vw,5.8rem)", textWrap: "balance" }}>Describe your idea. Get a tested bot.</h1>
        <p className="mt-6 max-w-lg text-lg leading-snug opacity-85">Tell the AI how you want to trade. It asks what&apos;s missing and shows the backtest. The bot then runs on your own exchange account, and Alvora cannot withdraw your funds.</p>
        <div className="mt-9"><StartButton big /></div>
      </motion.div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="px-6 py-24 text-center md:px-10" style={{ background: P.card, color: onC(P.card) }}>
      <h2 style={{ ...head, fontSize: "clamp(2.2rem,4.6vw,4.8rem)" }}>Describe your first idea.</h2>
      <div className="mt-8"><StartButton big /></div>
    </section>
  );
}

export function PageTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="px-6 pb-6 pt-20 md:px-10" style={{ background: P.bg, color: P.fg }}>
      <div className="mx-auto max-w-6xl">
        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ ...head, fontSize: "clamp(2.8rem,7vw,7.5rem)", textWrap: "balance" }}>{title}</motion.h1>
        <p className="mt-6 max-w-xl text-xl leading-snug opacity-80" style={{ fontFamily: F.body }}>{sub}</p>
      </div>
    </section>
  );
}

export function HomePage() { return (<><Header /><HomeHero /><Footer c={c} /></>); }
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
export function PricingPage() {
  return (
    <>
      <Header active="/pricing" />
      <PageTitle title="One subscription. No share of your profit." sub="The plan depends on the size of the account you connect. Prices will be announced before launch." />
      <PricingSlider c={c} />
      <PricingDetails />
      <CtaBand /><Footer c={c} />
    </>
  );
}
