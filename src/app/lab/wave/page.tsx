import { GradientWave } from "@/components/lab/gradient-wave";

export default function WaveLabPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-bg">
      <GradientWave />
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <h1 className="text-5xl md:text-6xl text-text">Alvora Capital</h1>
        <p className="max-w-md text-text-muted text-lg">
          Algorithmic trading strategies, built by you, running on your own
          exchange account.
        </p>
      </div>
    </div>
  );
}
