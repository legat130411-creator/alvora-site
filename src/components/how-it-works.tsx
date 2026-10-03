const steps = [
  {
    n: "01",
    title: "Set your parameters",
    body: "Choose a pair, timeframe, and entry filters — manually or starting from one of Alvora's built-in strategy templates. The strategy stays yours: you see and change every parameter.",
  },
  {
    n: "02",
    title: "Test it on history",
    body: "Run a backtest on real historical data. Return, max drawdown, Sharpe — before the bot ever places a single trade with your money.",
  },
  {
    n: "03",
    title: "Connect your exchange",
    body: "Create an API key on your own exchange with trading rights and no withdrawal rights. Alvora never gets withdrawal access — the bot trades on your account, not ours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-6 md:px-10 py-20 border-t border-line">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl max-w-md mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step) => (
            <div key={step.n}>
              <p className="font-mono text-sm text-accent mb-4">{step.n}</p>
              <h3 className="text-lg mb-2">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
