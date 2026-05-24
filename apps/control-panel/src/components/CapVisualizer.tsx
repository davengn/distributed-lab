"use client";

import { useState, useCallback } from "react";

interface CapVisualizerProps {
  onPartitionToggle?: (partitioned: boolean) => void;
}

export function CapVisualizer({ onPartitionToggle }: CapVisualizerProps) {
  const [partitioned, setPartitioned] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState<"C" | "A">("A");

  const handleToggle = useCallback(() => {
    const next = !partitioned;
    setPartitioned(next);
    onPartitionToggle?.(next);
  }, [partitioned, onPartitionToggle]);

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3">
        <h3 className="text-section text-fg-default">CAP Theorem Visualizer</h3>
      </div>
      <div className="p-4">
        {/* SVG Diagram */}
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 400 200" className="w-full max-w-[400px] h-auto">
            {/* Connection line */}
            {partitioned ? (
              <line
                x1="130" y1="100" x2="270" y2="100"
                stroke="var(--danger-fg)" strokeWidth="2"
                strokeDasharray="8 4"
              />
            ) : (
              <line
                x1="130" y1="100" x2="270" y2="100"
                stroke="var(--success-fg)" strokeWidth="2"
              />
            )}

            {/* Node A */}
            <circle
              cx="80" cy="100" r="50"
              fill="var(--canvas-default)"
              stroke={selectedBehavior === "C" && partitioned
                ? "var(--danger-fg)"
                : "var(--border-default)"}
              strokeWidth="2"
            />
            <text x="80" y="95" textAnchor="middle" className="text-sm" fill="var(--fg-default)">
              Node A
            </text>
            <text x="80" y="112" textAnchor="middle" className="text-caption" fill="var(--fg-muted)">
              {selectedBehavior === "C" && partitioned ? "Rejecting" : "Available"}
            </text>

            {/* Node B */}
            <circle
              cx="320" cy="100" r="50"
              fill="var(--canvas-default)"
              stroke={selectedBehavior === "C" && partitioned
                ? "var(--danger-fg)"
                : "var(--border-default)"}
              strokeWidth="2"
            />
            <text x="320" y="95" textAnchor="middle" className="text-sm" fill="var(--fg-default)">
              Node B
            </text>
            <text x="320" y="112" textAnchor="middle" className="text-caption" fill="var(--fg-muted)">
              {selectedBehavior === "C" && partitioned ? "Rejecting" : "Available"}
            </text>

            {/* Partition indicator */}
            {partitioned && (
              <text x="200" y="85" textAnchor="middle" className="text-caption" fill="var(--danger-fg)">
                NETWORK PARTITION
              </text>
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleToggle}
            className={`px-4 py-1.5 rounded-[6px] text-sm transition-colors ${
              partitioned
                ? "bg-success-emphasis text-white hover:opacity-90"
                : "bg-danger-fg text-white hover:opacity-90"
            }`}
          >
            {partitioned ? "Heal Network" : "Cut Network"}
          </button>
          <span className={`text-caption ${partitioned ? "text-danger-fg" : "text-success-fg"}`}>
            {partitioned ? "Partition active" : "Network healthy"}
          </span>
        </div>

        {/* Behavior selector */}
        {partitioned && (
          <div className="border border-border rounded-[6px] p-3">
            <p className="text-caption text-fg-muted mb-2">
              During partition, choose behavior:
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBehavior("C")}
                className={`px-3 py-1 rounded-[6px] text-sm border transition-colors ${
                  selectedBehavior === "C"
                    ? "border-accent-fg bg-accent-subtle text-accent-fg"
                    : "border-border text-fg-default hover:border-accent-fg"
                }`}
              >
                Consistency (C)
              </button>
              <button
                onClick={() => setSelectedBehavior("A")}
                className={`px-3 py-1 rounded-[6px] text-sm border transition-colors ${
                  selectedBehavior === "A"
                    ? "border-accent-fg bg-accent-subtle text-accent-fg"
                    : "border-border text-fg-default hover:border-accent-fg"
                }`}
              >
                Availability (A)
              </button>
            </div>
            <p className="text-caption text-fg-muted mt-2">
              {selectedBehavior === "C"
                ? "Nodes reject writes to avoid inconsistent data. Sacrifices availability."
                : "Nodes accept writes independently. Data may diverge until healed."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
