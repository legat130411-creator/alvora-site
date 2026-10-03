// Deterministic pseudo-backtest curve for the landing-page demo panel.
// Not live trading data — seeded from the chosen parameters so the chart
// visibly responds to them, with return/drawdown/sharpe-ish stats derived
// from the same series so the numbers stay internally consistent.

export type StrategyParams = {
  pair: "SOL/USDT" | "BTC/USDT" | "ETH/USDT";
  timeframe: "5m" | "15m" | "1h";
  atrMultiplier: number;
  riskPerTrade: number;
};

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateEquitySeries(
  params: StrategyParams,
  points = 96,
): number[] {
  const seed = hashString(
    `${params.pair}:${params.timeframe}:${params.atrMultiplier}:${params.riskPerTrade}`,
  );
  const rng = mulberry32(seed);

  // Wider ATR filter → fewer, cleaner trend-following trades → smoother curve.
  // Higher risk per trade → bigger swings per step.
  const noise = Math.max(0.15, 0.55 - params.atrMultiplier * 0.08);
  const stepScale = params.riskPerTrade * 0.9;
  const drift = 0.35 + params.riskPerTrade * 0.12;

  const series: number[] = [100];
  for (let i = 1; i < points; i++) {
    const trendBias = Math.sin(i / 14) * 0.4 + drift * 0.1;
    const shock = (rng() - 0.48) * noise;
    const step = (trendBias + shock) * stepScale;
    series.push(series[i - 1] + step);
  }
  return series;
}

export function seriesStats(series: number[]) {
  const start = series[0];
  const end = series[series.length - 1];
  const totalReturn = ((end - start) / start) * 100;

  let peak = series[0];
  let maxDrawdown = 0;
  for (const v of series) {
    peak = Math.max(peak, v);
    maxDrawdown = Math.min(maxDrawdown, ((v - peak) / peak) * 100);
  }

  const diffs = series.slice(1).map((v, i) => v - series[i]);
  const mean = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const variance =
    diffs.reduce((a, b) => a + (b - mean) ** 2, 0) / diffs.length;
  const std = Math.sqrt(variance) || 1;
  const sharpeLike = (mean / std) * Math.sqrt(diffs.length);

  return {
    totalReturn,
    maxDrawdown,
    sharpeLike,
  };
}
