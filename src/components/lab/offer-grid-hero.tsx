import * as React from "react";
import { ChevronRight } from "lucide-react";

// Flat grid texture, not the original's 3D retro-perspective tilt — reads as
// a price-chart grid behind the offer rather than a synthwave backdrop.
function LineGrid({
  cellSize = 56,
  opacity = 0.35,
}: {
  cellSize?: number;
  opacity?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(241,243,245,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(241,243,245,0.07) 1px, transparent 1px)",
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent to-80%" />
    </div>
  );
}

export function OfferGridHero() {
  return (
    <section className="relative overflow-hidden bg-bg px-6 py-28 md:px-8">
      <LineGrid />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <a
          href="#constructor"
          className="group mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-text-muted transition-colors hover:text-text"
        >
          Ограниченный набор — 50 мест в бете
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 className="mb-4 text-4xl leading-tight text-text md:text-5xl">
          Первый месяц — без подписки.
        </h1>

        <p className="mx-auto mb-8 max-w-md text-text-muted leading-relaxed">
          Соберите и проверьте стратегию бесплатно. Платите только когда бот
          подключится к вашей бирже.
        </p>

        <a
          href="#constructor"
          className="inline-flex items-center justify-center bg-accent px-7 py-3 text-sm text-text"
        >
          Занять место
        </a>
      </div>
    </section>
  );
}
