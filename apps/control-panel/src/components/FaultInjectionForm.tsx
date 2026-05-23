"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { PrototypeFault } from "@/lib/prototype-data";

interface FaultInjectionFormProps {
  onInjected?: (fault: Omit<PrototypeFault, "id">) => void;
}

const FAULT_TYPES = [
  { value: "latency", label: "Latency injection", display: "Latency" },
  { value: "packet_loss", label: "Packet loss", display: "Packet loss" },
  { value: "kill", label: "Kill container", display: "Kill container" },
  { value: "memory", label: "Memory exhaustion", display: "Memory exhaustion" },
  { value: "partition", label: "Network partition", display: "Network partition" },
] as const;

const TARGET_SERVICES = [
  { value: "monolith", label: "monolith (:8080)" },
  { value: "catalog-service", label: "catalog-service (:8081)" },
  { value: "order-service", label: "order-service (:8082)" },
  { value: "payment-service", label: "payment-service (:8083)" },
  { value: "api-gateway", label: "api-gateway (:8000)" },
  { value: "kafka", label: "kafka (:9092)" },
] as const;

export function FaultInjectionForm({ onInjected }: FaultInjectionFormProps) {
  const [type, setType] = useState("latency");
  const [targetService, setTargetService] = useState("monolith");
  const [magnitude, setMagnitude] = useState("200ms");
  const [durationSeconds, setDurationSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!magnitude.trim()) {
      setError("Magnitude is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/faults", {
        type,
        targetService,
        magnitude: magnitude.trim(),
        durationSeconds,
      });
      const selectedType = FAULT_TYPES.find((item) => item.value === type);
      onInjected?.({
        type: selectedType?.display ?? type,
        target: targetService,
        magnitude: normalizeMagnitude(type, magnitude.trim()),
        durationSeconds,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to inject fault");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-3">
        <div>
          <label htmlFor="fault-type" className="mb-1 block text-caption font-medium text-fg-muted">
            Fault type
          </label>
          <select
            id="fault-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-control"
          >
            {FAULT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fault-target" className="mb-1 block text-caption font-medium text-fg-muted">
            Target service
          </label>
          <select
            id="fault-target"
            value={targetService}
            onChange={(e) => setTargetService(e.target.value)}
            className="form-control"
          >
            {TARGET_SERVICES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fault-duration" className="mb-1 block text-caption font-medium text-fg-muted">
            Duration (seconds)
          </label>
          <input
            id="fault-duration"
            type="number"
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
            min={10}
            max={600}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="fault-magnitude" className="mb-1 block text-caption font-medium text-fg-muted">
            Magnitude
          </label>
          <input
            id="fault-magnitude"
            type="text"
            value={magnitude}
            onChange={(e) => setMagnitude(e.target.value)}
            placeholder="e.g. 200ms, 5%, 512MB"
            aria-describedby={error ? "fault-error" : undefined}
            className="form-control"
          />
        </div>
      </div>

      {error && (
        <p id="fault-error" className="mt-3 text-sm text-danger-fg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary mt-4 disabled:opacity-50"
      >
        {submitting ? "Injecting..." : "Inject Fault"}
      </button>
    </form>
  );
}

function normalizeMagnitude(type: string, magnitude: string) {
  if (type === "latency" && /^\d/.test(magnitude) && !magnitude.startsWith("+")) {
    return `+${magnitude}`;
  }

  return magnitude;
}
