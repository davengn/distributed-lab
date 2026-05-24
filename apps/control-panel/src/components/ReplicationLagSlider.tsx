"use client";

import { useState, useCallback } from "react";

interface ReplicationLagSliderProps {
  onLagChange?: (lagMs: number) => void;
}

export function ReplicationLagSlider({ onLagChange }: ReplicationLagSliderProps) {
  const [lagMs, setLagMs] = useState(0);

  const WARNING_THRESHOLD = 200;
  const CRITICAL_THRESHOLD = 500;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setLagMs(value);
      onLagChange?.(value);
    },
    [onLagChange]
  );

  const getLevel = useCallback((): "none" | "normal" | "warning" | "critical" => {
    if (lagMs === 0) return "none";
    if (lagMs <= WARNING_THRESHOLD) return "normal";
    if (lagMs <= CRITICAL_THRESHOLD) return "warning";
    return "critical";
  }, [lagMs]);

  const level = getLevel();

  const levelLabel: Record<string, string> = {
    none: "No lag",
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
  };

  const levelColor: Record<string, string> = {
    none: "text-success-fg",
    normal: "text-success-fg",
    warning: "text-attention-fg",
    critical: "text-danger-fg",
  };

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3">
        <h3 className="text-section text-fg-default">Replication Lag Control</h3>
      </div>
      <div className="p-4">
        {/* Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-caption text-fg-muted">
              Artificial replication delay
            </label>
            <div className="flex items-center gap-2">
              <span className="mono text-sm text-fg-default">{lagMs}ms</span>
              <span className={`text-caption font-medium ${levelColor[level]}`}>
                {levelLabel[level]}
              </span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={lagMs}
            onChange={handleChange}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--success-fg) 0%, var(--success-fg) ${
                (WARNING_THRESHOLD / 1000) * 100
              }%, var(--attention-fg) ${
                (WARNING_THRESHOLD / 1000) * 100
              }%, var(--attention-fg) ${
                (CRITICAL_THRESHOLD / 1000) * 100
              }%, var(--danger-fg) ${
                (CRITICAL_THRESHOLD / 1000) * 100
              }%, var(--danger-fg) 100%)`,
            }}
          />
          <div className="flex justify-between text-caption text-fg-muted mt-1">
            <span>0ms</span>
            <span>200ms</span>
            <span>500ms</span>
            <span>1000ms</span>
          </div>
        </div>

        {/* Threshold indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-fg shrink-0" />
            <span className="text-caption text-fg-muted">
              Consistency guaranteed (&lt;{WARNING_THRESHOLD}ms)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-attention-fg shrink-0" />
            <span className="text-caption text-fg-muted">
              Stale reads possible ({WARNING_THRESHOLD}-{CRITICAL_THRESHOLD}ms)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-danger-fg shrink-0" />
            <span className="text-caption text-fg-muted">
              SLA violation (&gt;{CRITICAL_THRESHOLD}ms)
            </span>
          </div>
        </div>

        {/* Warning banner */}
        {level === "critical" && (
          <div className="mt-3 border border-danger-fg rounded-[6px] bg-danger-subtle p-3">
            <p className="text-sm text-danger-fg">
              Replication lag exceeds {CRITICAL_THRESHOLD}ms. Read-after-write consistency is
              violated. Users may see stale data.
            </p>
          </div>
        )}

        {level === "warning" && (
          <div className="mt-3 border border-attention-fg rounded-[6px] bg-attention-subtle p-3">
            <p className="text-sm text-attention-fg">
              Replication lag approaching critical threshold. Some reads may return stale data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
