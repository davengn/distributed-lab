import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: ReactNode;
  sparkline?: number[];
  tone?: "success" | "accent" | "attention" | "done";
}

const TONE_COLOR: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  success: "var(--success-fg)",
  accent: "var(--accent-fg)",
  attention: "var(--attention-fg)",
  done: "var(--done-fg)",
};

export function MetricCard({
  label,
  value,
  subtext,
  sparkline,
  tone = "success",
}: MetricCardProps) {
  return (
    <div className="rounded-[6px] border border-border bg-canvas p-4">
      <div className="mb-1 text-caption font-medium text-fg-muted">{label}</div>
      <div className="flex min-h-8 items-end justify-between gap-3">
        <div className="text-metric tabular-nums text-fg-default">{value}</div>
        {sparkline && sparkline.length > 0 && (
          <svg viewBox="0 0 100 28" className="h-7 w-full max-w-[112px] shrink-0" aria-hidden="true">
            <polyline
              fill="none"
              stroke={TONE_COLOR[tone]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklineToPoints(sparkline, 100, 28)}
            />
          </svg>
        )}
      </div>
      {subtext && <div className="mt-2 text-caption text-fg-muted">{subtext}</div>}
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
