"use client";

import type {
  ComparisonResult,
  RequestHistoryEntry,
  ServiceRequestResult,
} from '@/lib/lab-testing-types';

interface RequestHistoryPanelProps {
  entries: RequestHistoryEntry[];
  selectedEntryIds: string[];
  comparison: ComparisonResult | null;
  onToggleCompare: (entryId: string) => void;
  onRetry: (entry: RequestHistoryEntry) => void;
  onCopyRequest: (entry: RequestHistoryEntry) => void;
  onCopyResponse: (result: ServiceRequestResult) => void;
}

export function RequestHistoryPanel({
  entries,
  selectedEntryIds,
  comparison,
  onToggleCompare,
  onRetry,
  onCopyRequest,
  onCopyResponse,
}: RequestHistoryPanelProps) {
  return (
    <section className="rounded-[6px] border border-border bg-canvas">
      <div className="border-b border-border bg-canvas-subtle px-4 py-3">
        <h3 className="text-sm font-medium text-fg-default">Recent history</h3>
      </div>

      {entries.length === 0 && (
        <p className="p-4 text-table leading-6 text-fg-muted">
          Recent request results for this browser session will appear here.
        </p>
      )}

      {comparison && (
        <div className="border-b border-border-subtle p-4 text-table">
          <div className="mb-1 font-medium text-fg-default">Comparison</div>
          <p className="text-fg-muted">
            Status changed: {comparison.statusChanged ? 'yes' : 'no'}; duration delta:{' '}
            {comparison.durationDeltaMs} ms. {comparison.bodySummary}
          </p>
        </div>
      )}

      <div className="divide-y divide-border-subtle">
        {entries.map((entry) => (
          <article key={entry.id} className="p-4">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-fg-default">
                  {entry.draft.method} {entry.draft.path}
                </div>
                <div className="mt-1 text-caption text-fg-muted">
                  {entry.draft.targetId} · {entry.result.status} · {entry.result.durationMs} ms ·{' '}
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
              </div>
              <label className="flex items-center gap-2 text-caption text-fg-muted">
                <input
                  type="checkbox"
                  checked={selectedEntryIds.includes(entry.id)}
                  onChange={() => onToggleCompare(entry.id)}
                />
                Compare
              </label>
            </div>

            <p className="mb-3 line-clamp-2 text-table leading-6 text-fg-muted">
              {entry.result.bodyPreview || entry.result.errorMessage || 'No response body'}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onRetry(entry)}
                className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-default"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => onCopyRequest(entry)}
                className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-default"
              >
                Copy request
              </button>
              <button
                type="button"
                onClick={() => onCopyResponse(entry.result)}
                className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-default"
              >
                Copy response
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
