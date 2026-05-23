"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

interface ProtocolResult {
  protocol: string;
  latencyMs: number;
  throughputRps: number;
  status: string;
  note?: string;
}

interface ComparisonData {
  orderId: string;
  timestamp: string;
  results: {
    rest: ProtocolResult;
    grpc: ProtocolResult;
    kafka: ProtocolResult;
  };
  summary: {
    fastest: string;
    restLatencyMs: number;
    grpcLatencyMs: number;
    kafkaLatencyMs: number;
  };
}

const PROTOCOL_COLORS: Record<string, string> = {
  REST: "var(--accent-fg)",
  gRPC: "var(--success-fg)",
  Kafka: "var(--attention-fg)",
};

const PROTOCOL_BG: Record<string, string> = {
  REST: "var(--accent-subtle)",
  gRPC: "var(--success-subtle)",
  Kafka: "var(--attention-subtle)",
};

export function CommunicationComparison() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);

  const runComparison = async () => {
    setLoading(true);
    try {
      const result = await apiClient.post<ComparisonData>("/sagas/compare", {
        orderId: "ORD-CMP-" + Date.now(),
      });
      setData(result);
    } catch {
      /* error handled silently */
    } finally {
      setLoading(false);
    }
  };

  const maxLatency = data
    ? Math.max(
        data.results.rest.latencyMs,
        data.results.grpc.latencyMs,
        data.results.kafka.latencyMs
      )
    : 0;

  const protocols = data
    ? [
        { key: "REST" as const, result: data.results.rest },
        { key: "gRPC" as const, result: data.results.grpc },
        { key: "Kafka" as const, result: data.results.kafka },
      ]
    : [];

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-section text-fg-default">Communication Comparison</h2>
        <button
          onClick={runComparison}
          disabled={loading}
          className="px-4 py-1.5 rounded-[6px] text-sm bg-accent-fg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Run Comparison"}
        </button>
      </div>
      <div className="p-4">
        {data ? (
          <>
            {/* Three-column metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {protocols.map(({ key, result }) => (
                <div key={key} className="border border-border rounded-[6px] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PROTOCOL_COLORS[key] }}
                    />
                    <span className="text-sm font-medium text-fg-default">{key}</span>
                  </div>
                  <div className="text-metric text-fg-default">{result.latencyMs}ms</div>
                  <div className="text-caption text-fg-muted">
                    {result.throughputRps.toFixed(1)} req/s
                  </div>
                  {result.note && (
                    <div className="text-caption text-fg-muted mt-1 italic">
                      {result.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Latency bars */}
            <div className="space-y-2">
              <div className="text-caption text-fg-muted mb-1">Latency comparison</div>
              {protocols.map(({ key, result }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-fg-default w-14">{key}</span>
                  <div className="flex-1 h-6 bg-canvas-subtle rounded-[6px] overflow-hidden">
                    <div
                      className="h-full rounded-[6px] transition-all duration-500"
                      style={{
                        width: maxLatency > 0
                          ? `${(result.latencyMs / maxLatency) * 100}%`
                          : "0%",
                        backgroundColor: PROTOCOL_COLORS[key],
                      }}
                    />
                  </div>
                  <span className="text-caption mono text-fg-muted w-16 text-right">
                    {result.latencyMs}ms
                  </span>
                </div>
              ))}
            </div>

            {/* Fastest indicator */}
            <div className="mt-3 px-3 py-2 rounded-[6px] bg-canvas-subtle">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-fg" />
                <span className="text-sm text-fg-default">
                  Fastest: <strong>{data.summary.fastest}</strong>
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-fg-muted text-sm text-center">
            Click &quot;Run Comparison&quot; to measure REST, gRPC, and Kafka side by side
          </p>
        )}
      </div>
    </div>
  );
}
