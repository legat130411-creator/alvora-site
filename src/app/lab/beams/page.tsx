import { BeamsBackground } from "@/components/lab/beams-background";

export default function BeamsLabPage() {
  return (
    <BeamsBackground intensity="subtle">
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <h1 className="text-5xl md:text-6xl text-text">Alvora Capital</h1>
        <p className="max-w-md text-text-muted text-lg">
          Algorithmic trading strategies, built by you, running on your own
          exchange account.
        </p>
      </div>
    </BeamsBackground>
  );
}
