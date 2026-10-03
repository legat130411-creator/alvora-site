"use client";

type Props = {
  series: number[];
  positive: boolean;
};

export function EquityChart({ series, positive }: Props) {
  const width = 560;
  const height = 220;
  const padding = 8;

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  const points = series.map((v, i) => {
    const x = (i / (series.length - 1)) * (width - padding * 2) + padding;
    const y =
      height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${height - padding} L${points[0][0].toFixed(1)},${height - padding} Z`;

  const stroke = positive ? "#176bff" : "#e8625f";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
      aria-label="Кривая доходности демо-стратегии"
    >
      <defs>
        <linearGradient id="equity-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padding}
          x2={width - padding}
          y1={height * f}
          y2={height * f}
          stroke="rgba(241,243,245,0.08)"
          strokeWidth={1}
        />
      ))}
      <path d={areaPath} fill="url(#equity-fill)" stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
