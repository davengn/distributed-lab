interface MetricCardProps {
  label: string;
  value: string | number;
  sparkline?: number[];
  color?: string;
}

export function MetricCard({ label, value, sparkline, color = "var(--success-fg)" }: MetricCardProps) {
  return (
    <div className="border border-border rounded-[6px] p-4">
      <div className="text-fg-muted text-caption mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-metric text-fg-default">{value}</div>
        {sparkline && sparkline.length > 0 && (
          <svg width="80" height="28" className="shrink-0">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              points={sparklineToPoints(sparkline, 80, 28)}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

function sparklineToPoints(data: number[], width: number, height: number): string {
  if (data.length < 2) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  return data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * (height - 4) - 2).toFixed(1)}`)
    .join(" ");
}
