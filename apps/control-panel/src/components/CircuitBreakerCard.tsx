"use client";

import { StatusPill } from "./StatusPill";

interface CircuitBreakerCardProps {
  serviceName: string;
  state: "closed" | "open" | "half_open";
  failureCount: number;
  successRate: number;
  threshold?: number;
  failureRateThreshold?: number;
}

const STATE_LABELS: Record<string, string> = {
  closed: "Closed",
  open: "Open",
  half_open: "Half-Open",
};

function mapStateToStatus(
  state: "closed" | "open" | "half_open"
): "closed" | "open" | "running" {
  switch (state) {
    case "closed":
      return "closed";
    case "open":
      return "open";
    case "half_open":
      return "running";
  }
}

export function CircuitBreakerCard({
  serviceName,
  state,
  failureCount,
  successRate,
  threshold,
  failureRateThreshold,
}: CircuitBreakerCardProps) {
  const displayThreshold = threshold ?? failureRateThreshold ?? 50;

  return (
    <article className="mb-2 flex items-center gap-3 rounded-[6px] border border-border bg-canvas px-3.5 py-3 last:mb-0">
      <StatusPill status={mapStateToStatus(state)} label={STATE_LABELS[state]} />
      <div className="min-w-0 flex-1">
        <div className="mono truncate text-[13px] font-medium text-fg-default">{serviceName}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-caption text-fg-muted">
          <span className="tabular-nums">{failureCount} failures</span>
          <span className="tabular-nums">success rate {formatPercent(successRate)}</span>
          <span className="tabular-nums">threshold {displayThreshold}%</span>
        </div>
      </div>
    </article>
  );
}

function formatPercent(value: number) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}
