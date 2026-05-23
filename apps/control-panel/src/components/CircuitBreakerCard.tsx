"use client";

import { StatusPill } from "./StatusPill";
import { ProgressBar } from "./ProgressBar";

interface CircuitBreakerCardProps {
  serviceName: string;
  state: "closed" | "open" | "half_open";
  failureCount: number;
  successRate: number;
  failureRateThreshold: number;
  slowCallRate: number;
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
  failureRateThreshold,
  slowCallRate,
}: CircuitBreakerCardProps) {
  const failureRate = 100 - successRate;

  return (
    <div className="border border-border rounded-[6px] p-3 hover:border-accent-fg transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-fg-default">{serviceName}</span>
        <StatusPill status={mapStateToStatus(state)} label={STATE_LABELS[state]} />
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-caption text-fg-muted mb-0.5">
            <span>Failure rate</span>
            <span className="mono">{failureRate.toFixed(1)}%</span>
          </div>
          <ProgressBar value={failureRate} threshold={failureRateThreshold} />
        </div>

        <div>
          <div className="flex justify-between text-caption text-fg-muted mb-0.5">
            <span>Slow call rate</span>
            <span className="mono">{slowCallRate.toFixed(1)}%</span>
          </div>
          <ProgressBar value={slowCallRate} />
        </div>

        <div className="flex justify-between text-caption text-fg-muted pt-1 border-t border-border">
          <span>Failed calls</span>
          <span className="mono">{failureCount}</span>
        </div>

        <div className="flex justify-between text-caption text-fg-muted">
          <span>Threshold</span>
          <span className="mono">{failureRateThreshold}%</span>
        </div>
      </div>
    </div>
  );
}
