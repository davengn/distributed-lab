"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

interface FaultInjectionFormProps {
  onInjected?: () => void;
}

const FAULT_TYPES = [
  { value: "latency", label: "Latency" },
  { value: "packet_loss", label: "Packet Loss" },
  { value: "kill", label: "Kill" },
  { value: "memory", label: "Memory" },
  { value: "partition", label: "Partition" },
] as const;

const TARGET_SERVICES = [
  { value: "payment-service", label: "payment-service" },
  { value: "order-service", label: "order-service" },
  { value: "catalog-service", label: "catalog-service" },
] as const;

export function FaultInjectionForm({ onInjected }: FaultInjectionFormProps) {
  const [type, setType] = useState("latency");
  const [targetService, setTargetService] = useState("payment-service");
  const [magnitude, setMagnitude] = useState("200ms");
  const [durationSeconds, setDurationSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/faults", {
        type,
        targetService,
        magnitude,
        durationSeconds,
      });
      onInjected?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to inject fault");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-caption text-fg-muted mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
          >
            {FAULT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-caption text-fg-muted mb-1">Target</label>
          <select
            value={targetService}
            onChange={(e) => setTargetService(e.target.value)}
            className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
          >
            {TARGET_SERVICES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-caption text-fg-muted mb-1">Magnitude</label>
          <input
            type="text"
            value={magnitude}
            onChange={(e) => setMagnitude(e.target.value)}
            placeholder="200ms"
            className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
          />
        </div>
        <div>
          <label className="block text-caption text-fg-muted mb-1">
            Duration (s)
          </label>
          <input
            type="number"
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
            min={1}
            className="w-full border border-border rounded-[6px] px-3 py-1.5 text-sm bg-canvas-default text-fg-default"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-danger-fg mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-1.5 rounded-[6px] text-sm bg-success-emphasis text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? "Injecting..." : "Inject Fault"}
      </button>
    </form>
  );
}
