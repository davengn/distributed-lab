"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface SagaStep {
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "compensated" | "compensation-failed";
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

interface Saga {
  sagaId: string;
  type: string;
  orderId: string;
  status: "running" | "completed" | "failed" | "compensating";
  steps: SagaStep[];
  createdAt: string;
}

const STEP_COLORS: Record<string, string> = {
  pending: "var(--fg-muted)",
  running: "var(--attention-fg)",
  completed: "var(--success-fg)",
  failed: "var(--danger-fg)",
  compensated: "var(--done-fg)",
  "compensation-failed": "var(--danger-fg)",
};

const STEP_BG: Record<string, string> = {
  pending: "var(--canvas-subtle)",
  running: "var(--attention-subtle)",
  completed: "var(--success-subtle)",
  failed: "var(--danger-subtle)",
  compensated: "var(--done-subtle)",
  "compensation-failed": "var(--danger-subtle)",
};

const SERVICE_NODES = [
  { id: "saga-orchestrator", label: "Saga Orchestrator", x: 250, y: 30 },
  { id: "order-service", label: "Order Service", x: 80, y: 160 },
  { id: "payment-service", label: "Payment Service", x: 420, y: 160 },
];

export function SagaVisualizer() {
  const [saga, setSaga] = useState<Saga | null>(null);
  const [loading, setLoading] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<number | null>(null);

  const pollSaga = useCallback(async (sagaId: string) => {
    try {
      const data = await apiClient.get<Saga>(`/sagas/${sagaId}`);
      setSaga(data);
      if (data.status === "running" || data.status === "compensating") {
        const runningIdx = data.steps.findIndex((s: SagaStep) => s.status === "running");
        setAnimatingStep(runningIdx >= 0 ? runningIdx : null);
        setTimeout(() => pollSaga(sagaId), 1000);
      } else {
        setAnimatingStep(null);
      }
    } catch {
      setAnimatingStep(null);
    }
  }, []);

  const startSaga = async () => {
    setLoading(true);
    try {
      const data = await apiClient.post<Saga>("/sagas/start", {
        type: "order-payment",
        steps: ["create-order", "process-payment", "confirm-order"],
      });
      setSaga(data);
      pollSaga(data.sagaId);
    } catch {
      /* error handled silently */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setAnimatingStep(null);
  }, []);

  const steps = saga?.steps ?? [];
  const getNodeForStep = (idx: number) => {
    if (idx === 0 || idx === 2) return SERVICE_NODES[1];
    return SERVICE_NODES[2];
  };

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-section text-fg-default">Saga Visualizer</h2>
        <button
          onClick={startSaga}
          disabled={loading}
          className="px-4 py-1.5 rounded-[6px] text-sm bg-accent-fg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Saga"}
        </button>
      </div>
      <div className="p-4">
        {/* SVG Diagram */}
        <svg viewBox="0 0 600 230" className="w-full max-w-[600px] mx-auto">
          {/* Connection lines */}
          <line x1="250" y1="55" x2="120" y2="145" stroke="var(--border-default)" strokeWidth="1" />
          <line x1="250" y1="55" x2="460" y2="145" stroke="var(--border-default)" strokeWidth="1" />

          {/* Animated flow indicators */}
          {animatingStep !== null && (
            <>
              <circle r="4" fill="var(--attention-fg)">
                <animateMotion
                  dur="1.5s"
                  repeatCount="indefinite"
                  path={animatingStep === 0 || animatingStep === 2
                    ? "M250,55 L120,145"
                    : "M250,55 L460,145"}
                />
              </circle>
            </>
          )}

          {/* Service nodes */}
          {SERVICE_NODES.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x - 55}
                y={node.y - 22}
                width={110}
                height={44}
                rx={6}
                fill="var(--canvas-default)"
                stroke="var(--border-default)"
                strokeWidth="1"
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="text-[11px]"
                fill="var(--fg-default)"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Step status indicators */}
        {steps.length > 0 && (
          <div className="mt-4 space-y-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded-[6px]"
                style={{ backgroundColor: STEP_BG[step.status] }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: STEP_COLORS[step.status] }}
                />
                <span className="text-sm text-fg-default flex-1">{step.name}</span>
                <span
                  className="text-tag"
                  style={{ color: STEP_COLORS[step.status] }}
                >
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {saga && (
          <div className="mt-3 flex items-center gap-4 text-caption text-fg-muted">
            <span className="mono">{saga.sagaId}</span>
            <span>Order: {saga.orderId}</span>
          </div>
        )}

        {!saga && !loading && (
          <p className="text-fg-muted text-sm text-center mt-4">
            Click &quot;Start Saga&quot; to visualize the distributed transaction flow
          </p>
        )}
      </div>
    </div>
  );
}
