"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface PaymentResult {
  paymentId: string;
  orderId: string;
  amount: number;
  status: string;
  idempotencyKey: string;
  idempotent: boolean;
  processedAt: string;
}

export function IdempotencyTester() {
  const [requestCount, setRequestCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [results, setResults] = useState<PaymentResult[]>([]);
  const [running, setRunning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const sendDuplicate = useCallback(async (key: string, orderId: string) => {
    try {
      const data = await apiClient.post<PaymentResult>("/../../pay", {
        orderId,
        amount: 100,
        idempotencyKey: key,
      });
      return data;
    } catch {
      return null;
    }
  }, []);

  const runIdempotencyTest = async () => {
    setRunning(true);
    setResults([]);
    setConfirmed(false);

    const idempotencyKey = "IDEM-" + Date.now();
    const orderId = "ORD-IDEM-" + Date.now();
    const totalRequests = 5;
    let processed = 0;
    let duplicates = 0;
    const allResults: PaymentResult[] = [];

    for (let i = 0; i < totalRequests; i++) {
      setRequestCount(i + 1);
      const result = await sendDuplicate(idempotencyKey, orderId);
      if (result) {
        allResults.push(result);
        if (result.idempotent) {
          duplicates++;
        } else {
          processed++;
        }
        setProcessedCount(processed);
        setDuplicateCount(duplicates);
        setResults([...allResults]);
      }
    }

    setRunning(false);
    if (processed === 1) {
      setConfirmed(true);
    }
  };

  return (
    <div className="border border-border rounded-[6px]">
      <div className="bg-canvas-subtle border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-section text-fg-default">Idempotency Tester</h2>
        <button
          onClick={runIdempotencyTest}
          disabled={running}
          className="px-4 py-1.5 rounded-[6px] text-sm bg-accent-fg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {running ? "Running..." : "Replay (5x)"}
        </button>
      </div>
      <div className="p-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="border border-border rounded-[6px] p-3">
            <div className="text-caption text-fg-muted mb-1">Requests Sent</div>
            <div className="text-metric text-fg-default">{requestCount}</div>
          </div>
          <div className="border border-border rounded-[6px] p-3">
            <div className="text-caption text-fg-muted mb-1">Actually Processed</div>
            <div className="text-metric text-fg-default">{processedCount}</div>
          </div>
          <div className="border border-border rounded-[6px] p-3">
            <div className="text-caption text-fg-muted mb-1">Duplicates Blocked</div>
            <div className="text-metric text-fg-default">{duplicateCount}</div>
          </div>
        </div>

        {/* Confirmation */}
        {confirmed && (
          <div className="mb-4 px-3 py-2 rounded-[6px] bg-success-subtle border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success-fg" />
              <span className="text-sm text-success-fg font-medium">
                Exactly-once confirmed
              </span>
            </div>
            <p className="text-caption text-fg-muted mt-1">
              {requestCount} requests sent, {processedCount} processed, {duplicateCount} duplicates blocked
            </p>
          </div>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <div className="space-y-1">
            <div className="text-caption text-fg-muted mb-2">Request log:</div>
            {results.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm px-2 py-1 rounded-[6px] bg-canvas-subtle"
              >
                <span className="text-caption text-fg-muted mono w-6">#{idx + 1}</span>
                <span className="text-fg-default">{r.paymentId}</span>
                {r.idempotent ? (
                  <span className="text-tag text-attention-fg ml-auto">duplicate</span>
                ) : (
                  <span className="text-tag text-success-fg ml-auto">processed</span>
                )}
              </div>
            ))}
          </div>
        )}

        {!running && results.length === 0 && (
          <p className="text-fg-muted text-sm text-center">
            Click &quot;Replay&quot; to send 5 duplicate payment requests and verify idempotency
          </p>
        )}
      </div>
    </div>
  );
}
