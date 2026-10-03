"use client";

import { useMemo, useState } from "react";
import { EquityChart } from "@/components/equity-chart";
import {
  generateEquitySeries,
  seriesStats,
  type StrategyParams,
} from "@/lib/equity-series";

const PAIRS: StrategyParams["pair"][] = ["SOL/USDT", "BTC/USDT", "ETH/USDT"];
const TIMEFRAMES: StrategyParams["timeframe"][] = ["5m", "15m", "1h"];

function fmt(n: number, digits = 1) {
  return n.toFixed(digits);
}

export function ConstructorPanel() {
  const [params, setParams] = useState<StrategyParams>({
    pair: "SOL/USDT",
    timeframe: "15m",
    atrMultiplier: 2.4,
    riskPerTrade: 1,
  });

  const series = useMemo(() => generateEquitySeries(params), [params]);
  const stats = useMemo(() => seriesStats(series), [series]);
  const positive = stats.totalReturn >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_1px_minmax(0,1fr)] border border-line">
      {/* Parameters */}
      <div className="p-6 flex flex-col gap-6">
        <p className="text-sm text-text-muted">Strategy parameters</p>

        <label className="flex flex-col gap-2">
          <span className="text-sm">Pair</span>
          <select
            value={params.pair}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                pair: e.target.value as StrategyParams["pair"],
              }))
            }
            className="bg-surface-raised border border-line px-3 py-2 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {PAIRS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm">Timeframe</span>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setParams((p) => ({ ...p, timeframe: tf }))}
                className={`flex-1 px-2 py-2 text-sm font-mono border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  params.timeframe === tf
                    ? "border-accent text-accent"
                    : "border-line text-text-muted hover:text-text"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm flex justify-between">
            <span>ATR volatility filter</span>
            <span className="font-mono text-text-muted">
              ×{fmt(params.atrMultiplier)}
            </span>
          </span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.1}
            value={params.atrMultiplier}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                atrMultiplier: Number(e.target.value),
              }))
            }
            className="accent-accent"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm flex justify-between">
            <span>Risk per trade</span>
            <span className="font-mono text-text-muted">
              {fmt(params.riskPerTrade, 2)}%
            </span>
          </span>
          <input
            type="range"
            min={0.25}
            max={3}
            step={0.25}
            value={params.riskPerTrade}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                riskPerTrade: Number(e.target.value),
              }))
            }
            className="accent-accent"
          />
        </label>
      </div>

      <div className="hidden md:block bg-line" />

      {/* Result */}
      <div className="p-6 flex flex-col gap-5 bg-surface">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-text-muted">
            Backtest on historical data — {params.pair}, {params.timeframe}
          </p>
          <span className="text-xs text-text-muted">demo data</span>
        </div>

        <EquityChart series={series} positive={positive} />

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-line">
          <div>
            <p className="text-xs text-text-muted mb-1">Return</p>
            <p
              className={`font-mono text-lg ${positive ? "text-positive" : "text-[#e8625f]"}`}
            >
              {positive ? "+" : ""}
              {fmt(stats.totalReturn)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Max drawdown</p>
            <p className="font-mono text-lg">{fmt(stats.maxDrawdown)}%</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Sharpe</p>
            <p className="font-mono text-lg">{fmt(stats.sharpeLike, 2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
