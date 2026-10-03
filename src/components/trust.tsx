const points = [
  {
    title: "A key with no withdrawal rights",
    body: "The bot connects through an API key with read and trade permissions only. Withdrawing funds with this key is technically impossible — the exchange itself doesn't allow that setup.",
  },
  {
    title: "The account stays yours",
    body: "Alvora never holds or moves your assets. The account lives on your exchange, under your name — we only send trading signals to it.",
  },
  {
    title: "Turn it off in one click",
    body: "To stop the bot, just revoke the key in your exchange settings. No need to contact Alvora.",
  },
];

export function Trust() {
  return (
    <section id="security" className="px-6 md:px-10 py-20 border-t border-line">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl max-w-md mb-12">
          Your money stays with you
        </h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {points.map((p) => (
            <div key={p.title}>
              <h3 className="text-lg mb-2">{p.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
