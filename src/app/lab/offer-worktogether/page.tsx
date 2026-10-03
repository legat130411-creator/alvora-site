import { LetsBuildSection } from "@/components/lab/lets-build-section";
import { ConstructorPanel } from "@/components/constructor-panel";

export default function OfferWorkTogetherLabPage() {
  return (
    <main className="min-h-screen bg-bg">
      <LetsBuildSection />
      <div id="constructor" className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <ConstructorPanel />
      </div>
    </main>
  );
}
