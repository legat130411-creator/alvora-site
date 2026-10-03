import { SiteHeader } from "@/components/site-header";
import { SignalBeams } from "@/components/signal-beams";
import { StartCta } from "@/components/start-cta";
import { ConstructorPanel } from "@/components/constructor-panel";
import { HowItWorks } from "@/components/how-it-works";
import { Trust } from "@/components/trust";
import { ReadyStrategies } from "@/components/ready-strategies";
import { Pricing } from "@/components/pricing";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <SignalBeams className="z-0" />
          <div className="relative z-10 px-6 md:px-10 py-20 max-w-6xl mx-auto w-full">
            <div className="max-w-xl">
              <h1 className="text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.1] mb-6">
                Build your strategy.
                <br />
                Test it on history.
                <br />
                Connect your own exchange.
              </h1>
              <p className="text-text-muted leading-relaxed mb-10 max-w-md">
                Alvora never touches your money. You set the parameters, see
                the result on historical data, and connect the bot to your
                own exchange account yourself — with a key that can trade,
                never withdraw.
              </p>
              <StartCta />
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 py-20 border-t border-line">
          <div id="constructor" className="max-w-6xl mx-auto w-full">
            <p className="text-sm text-text-muted mb-6">Try it live</p>
            <ConstructorPanel />
          </div>
        </section>

        <HowItWorks />
        <Trust />
        <ReadyStrategies />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}
