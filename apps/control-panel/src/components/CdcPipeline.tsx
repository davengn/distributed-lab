"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface CdcEvent {
  id: string;
  source: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  payload: string;
  timestamp: number;
  stage: "source" | "debezium" | "kafka" | "elasticsearch";
  corrupted?: boolean;
}

const SAMPLE_EVENTS: Omit<CdcEvent, "id" | "timestamp" | "stage">[] = [
  { source: "postgres", operation: "INSERT", table: "orders", payload: '{"id":1001,"total":59.99}' },
  { source: "postgres", operation: "UPDATE", table: "customers", payload: '{"id":42,"email":"new@test.com"}' },
  { source: "postgres", operation: "INSERT", table: "products", payload: '{"id":501,"name":"Widget","price":9.99}' },
  { source: "postgres", operation: "DELETE", table: "sessions", payload: '{"id":"sess_abc123"}' },
  { source: "postgres", operation: "UPDATE", table: "inventory", payload: '{"sku":"W-100","qty":0}' },
];

const OP_COLORS: Record<string, string> = {
  INSERT: "var(--success-fg)",
  UPDATE: "var(--accent-fg)",
  DELETE: "var(--danger-fg)",
};

const STAGE_LABELS = [
  { key: "source", label: "PostgreSQL" },
  { key: "debezium", label: "Debezium" },
  { key: "kafka", label: "Kafka" },
  { key: "elasticsearch", label: "Elasticsearch" },
] as const;

export function CdcPipeline() {
  const [events, setEvents] = useState<CdcEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [nextId, setNextId] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const createEvent = useCallback(
    (idx: number): CdcEvent => {
      const template = SAMPLE_EVENTS[idx % SAMPLE_EVENTS.length];
      return {
        ...template,
        id: `evt-${nextId + idx}`,
        timestamp: Date.now(),
        stage: "source",
      };
    },
    [nextId]
  );

  // Auto-generate events
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvent = {
          ...SAMPLE_EVENTS[prev.length % SAMPLE_EVENTS.length],
          id: `evt-${Date.now()}`,
          timestamp: Date.now(),
          stage: "source" as const,
        };
        return [...prev.slice(-8), newEvent];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [paused]);

  // Advance events through pipeline
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setEvents((prev) =>
        prev.map((evt) => {
          const stages: CdcEvent["stage"][] = [
            "source",
            "debezium",
            "kafka",
            "elasticsearch",
          ];
          const currentIdx = stages.indexOf(evt.stage);
          if (currentIdx < stages.length - 1) {
            return { ...evt, stage: stages[currentIdx + 1] };
          }
          return evt;
        }).filter((evt) => evt.stage !== "elasticsearch" || Date.now() - evt.timestamp < 6000)
      );
    }, 800);

    return () => clearInterval(interval);
  }, [paused]);

  const handlePause = useCallback(() => setPaused((p) => !p), []);

  const handleReplay = useCallback(() => {
    setPaused(false);
    setEvents([]);
  }, []);

  const handleCorrupt = useCallback(() => {
    setEvents((prev) => {
      const idx = Math.floor(Math.random() * prev.length);
      return prev.map((evt, i) =>
        i === idx ? { ...evt, corrupted: true, payload: "{CORRUPTED}" } : evt
      );
    });
  }, []);

  const getStageCount = useCallback(
    (stage: CdcEvent["stage"]) =>
      events.filter((e) => e.stage === stage).length,
    [events]
  );

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-section text-fg-default">CDC Pipeline</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePause}
              className="px-3 py-1 rounded-[6px] text-caption border border-border text-fg-default hover:border-accent-fg transition-colors"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleReplay}
              className="px-3 py-1 rounded-[6px] text-caption border border-border text-fg-default hover:border-accent-fg transition-colors"
            >
              Replay
            </button>
            <button
              onClick={handleCorrupt}
              className="px-3 py-1 rounded-[6px] text-caption border border-danger-fg text-danger-fg hover:bg-danger-subtle transition-colors"
            >
              Corrupt
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Pipeline stages */}
        <div ref={containerRef} className="flex items-stretch gap-0 mb-4">
          {STAGE_LABELS.map((stage, idx) => (
            <div key={stage.key} className="flex-1">
              {/* Stage header */}
              <div className="border border-border rounded-[6px] p-2 bg-canvas-subtle">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-caption font-medium text-fg-default">
                    {stage.label}
                  </span>
                  <span className="mono text-caption text-fg-muted">
                    {getStageCount(stage.key as CdcEvent["stage"])}
                  </span>
                </div>
                {/* Events in this stage */}
                <div className="space-y-1 min-h-[60px]">
                  {events
                    .filter((e) => e.stage === stage.key)
                    .slice(-3)
                    .map((evt) => (
                      <div
                        key={evt.id}
                        className={`text-caption mono rounded-[6px] px-1.5 py-0.5 border ${
                          evt.corrupted
                            ? "border-danger-fg bg-danger-subtle text-danger-fg"
                            : "border-border bg-canvas-default text-fg-default"
                        }`}
                      >
                        <span style={{ color: OP_COLORS[evt.operation] }}>
                          {evt.operation.charAt(0)}
                        </span>
                        {" "}
                        <span className="truncate">{evt.table}</span>
                      </div>
                    ))}
                </div>
              </div>
              {/* Arrow between stages */}
              {idx < STAGE_LABELS.length - 1 && (
                <div className="flex items-center justify-center py-1">
                  <svg className="w-4 h-4 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Event stream log */}
        <div className="border border-border rounded-[6px] max-h-32 overflow-y-auto">
          <div className="p-2 space-y-1">
            {events.length === 0 && (
              <p className="text-caption text-fg-muted italic px-1">
                Waiting for events...
              </p>
            )}
            {events.map((evt) => (
              <div
                key={evt.id}
                className={`flex items-center gap-2 text-caption mono ${
                  evt.corrupted ? "text-danger-fg" : "text-fg-muted"
                }`}
              >
                <span style={{ color: OP_COLORS[evt.operation] }}>
                  {evt.operation.padEnd(6)}
                </span>
                <span>{evt.table}</span>
                <span className="truncate flex-1">{evt.payload}</span>
                <span className="shrink-0">{evt.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: OP_COLORS.INSERT }} />
            <span className="text-caption text-fg-muted">Insert</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: OP_COLORS.UPDATE }} />
            <span className="text-caption text-fg-muted">Update</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: OP_COLORS.DELETE }} />
            <span className="text-caption text-fg-muted">Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
