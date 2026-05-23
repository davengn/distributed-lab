"use client";

const MODULES = [
  {
    id: 1,
    name: "Migration & Decomposition",
    description: "Strangler Fig proxy, Parallel Run comparator, and feature toggle dashboard.",
    color: "bg-[#E1F5EE] dark:bg-[#0F3D2E]",
    textColor: "text-[#0F6E56] dark:text-[#3fb950]",
    concepts: ["Strangler Fig", "Parallel Run", "Feature Toggles"],
  },
  {
    id: 2,
    name: "Data Consistency",
    description: "CAP theorem visualizer, replication lag simulator, multi-model explorer, and CDC pipeline.",
    color: "bg-[#E6F1FB] dark:bg-[#0D2942]",
    textColor: "text-[#185FA5] dark:text-[#58a6ff]",
    concepts: ["CAP Theorem", "Replication Lag", "Multi-Model", "CDC"],
  },
  {
    id: 3,
    name: "Resiliency & Chaos",
    description: "Fault injection, circuit breakers, bulkheads, and cascading failure visualization.",
    color: "bg-[#FAECE7] dark:bg-[#3D1F14]",
    textColor: "text-[#993C1D] dark:text-[#f0883e]",
    concepts: ["Chaos Engineering", "Circuit Breaker", "Bulkhead"],
  },
  {
    id: 4,
    name: "Workflow & Communication",
    description: "Saga visualization, idempotency testing, REST/gRPC/Kafka comparison, and contract testing.",
    color: "bg-[#FAEEDA] dark:bg-[#3D2E00]",
    textColor: "text-[#854F0B] dark:text-[#d29922]",
    concepts: ["Saga Pattern", "Idempotency", "gRPC", "Contract Tests"],
  },
  {
    id: 5,
    name: "Observability Suite",
    description: "Guided tour through Prometheus, Grafana, Jaeger, and Loki with hands-on exercises.",
    color: "bg-[#EEEDFE] dark:bg-[#2A1F47]",
    textColor: "text-[#534AB7] dark:text-[#bc8cff]",
    concepts: ["Tracing", "Metrics", "Logging", "Dashboards"],
  },
];

export default function LabsPage() {
  return (
    <div>
      <h1 className="text-section text-fg-default mb-6">Labs</h1>
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        {MODULES.map((mod) => (
          <div key={mod.id} className="border border-border rounded-[6px] overflow-hidden">
            <div className={`px-4 py-3 ${mod.color}`}>
              <span className={`text-tag font-medium ${mod.textColor}`}>
                Module {String(mod.id).padStart(2, "0")}
              </span>
              <h2 className={`text-section mt-1 ${mod.textColor}`}>{mod.name}</h2>
            </div>
            <div className="p-4">
              <p className="text-fg-muted text-sm mb-3">{mod.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {mod.concepts.map((c) => (
                  <span key={c} className="text-tag text-fg-muted bg-canvas-subtle border border-border-muted rounded-pill px-2.5 py-0.5">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
