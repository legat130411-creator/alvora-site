import { AuroraBackground } from "@/components/lab/aurora-background";

export default function AuroraLabPage() {
  return (
    <AuroraBackground intensity={1}>
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <h1 className="text-5xl md:text-6xl text-text">Alvora Capital</h1>
        <p className="max-w-md text-text-muted text-lg">
          Algorithmic trading strategies, built by you, running on your own
          exchange account.
        </p>
      </div>
    </AuroraBackground>
  );
}
