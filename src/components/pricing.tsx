// Portfolio-size tiers mirror the Stoic AI-style model from the brief
// (subscription scaled by portfolio size, no profit fee). Price values are
// placeholders — "—" — until real numbers are confirmed; do not treat
// them as final.
const tiers = [
  {
    name: "Starter",
    range: "up to $5,000 on the account",
    price: "—",
    features: [
      "1 active strategy",
      "Unlimited backtesting",
      "Built-in strategy templates",
    ],
  },
  {
    name: "Growth",
    range: "$5,000 – $50,000",
    price: "—",
    features: [
      "Up to 5 active strategies",
      "Unlimited backtesting",
      "Built-in strategy templates",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    range: "$50,000+",
    price: "—",
    features: [
      "Unlimited active strategies",
      "Unlimited backtesting",
      "Built-in strategy templates",
      "Dedicated account manager",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 md:px-10 py-20 border-t border-line">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl max-w-md mb-2">Pricing</h2>
        <p className="text-text-muted text-sm mb-12">
          The subscription scales with the size of the account the bot
          manages. No fee on profits.
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-line border border-line">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-8 flex flex-col gap-6 ${
                tier.highlighted
                  ? "bg-surface border-t-2 border-t-accent"
                  : "bg-bg border-t-2 border-t-transparent"
              }`}
            >
              <div>
                {tier.highlighted && (
                  <p className="text-xs text-accent mb-2">
                    Most popular
                  </p>
                )}
                <h3 className="text-lg mb-1">{tier.name}</h3>
                <p className="text-sm text-text-muted">{tier.range}</p>
              </div>
              <p className="font-mono text-3xl">
                {tier.price}
                <span className="text-sm text-text-muted"> /mo</span>
              </p>
              <ul className="flex flex-col gap-3 text-sm text-text-muted">
                {tier.features.map((f) => (
                  <li key={f} className="pt-3 border-t border-line">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
