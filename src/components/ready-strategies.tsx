// Gated pending the NBG classification response (see project notes).
// Flip to true once Alvora can offer ready-made branded strategies
// without this reading as portfolio management under Georgian law.
const READY_STRATEGIES_ENABLED = false;

const strategies = [
  {
    name: "MS V3+VB",
    desc: "A multi-strategy on SOL — the same bot that has traded Alvora's own capital since launch.",
  },
  {
    name: "Trend Core",
    desc: "Trend-following on BTC/ETH with an ATR volatility filter, no position averaging.",
  },
];

export function ReadyStrategies() {
  if (!READY_STRATEGIES_ENABLED) return null;

  return (
    <section id="strategies" className="px-6 md:px-10 py-20 border-t border-line">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl max-w-md mb-2">
          Or start from a ready-made one
        </h2>
        <p className="text-text-muted text-sm mb-12 max-w-md">
          Two strategies from Alvora — for those who'd rather not tune the
          parameters themselves.
        </p>
        <div className="grid md:grid-cols-2 gap-px bg-line border border-line">
          {strategies.map((s) => (
            <div key={s.name} className="p-8 bg-bg">
              <h3 className="text-lg mb-2">{s.name}</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
