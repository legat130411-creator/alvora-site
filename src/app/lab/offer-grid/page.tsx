import { OfferGridHero } from "@/components/lab/offer-grid-hero";

export default function OfferGridLabPage() {
  return (
    <main className="min-h-screen bg-bg">
      <OfferGridHero />
      <div id="constructor" className="h-[60vh] flex items-center justify-center text-text-muted">
        (здесь на реальной странице уже стоит ConstructorPanel)
      </div>
    </main>
  );
}
