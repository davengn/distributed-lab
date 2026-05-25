"use client";

import type { ServiceRequestResult, ServiceRequestTarget } from '@/lib/lab-testing-types';

interface RequestResultPanelProps {
  result: ServiceRequestResult | null;
  targets: ServiceRequestTarget[];
  expectedObservation?: string;
  onCopyResponse: (result: ServiceRequestResult) => void;
}

const statusLabel: Record<ServiceRequestResult['status'], string> = {
  pending: 'Pending',
  succeeded: 'Succeeded',
  failed: 'Failed',
  timed_out: 'Timed out',
  blocked: 'Blocked',
};

export function RequestResultPanel({
  result,
  targets,
  expectedObservation,
  onCopyResponse,
}: RequestResultPanelProps) {
  const target = result ? targets.find((item) => item.id === result.targetId) : null;

  return (
    <section className="rounded-[6px] border border-border bg-canvas">
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border bg-canvas-subtle px-4 py-3">
        <h3 className="text-sm font-medium text-fg-default">Result</h3>
        {result && (
          <span className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-muted">
            {statusLabel[result.status]}
          </span>
        )}
      </div>

      <div className="space-y-4 p-4">
        {expectedObservation && (
          <div className="rounded-[6px] border border-border-subtle bg-canvas-subtle p-3">
            <div className="mb-1 text-caption font-semibold uppercase text-fg-muted">
              Expected observation
            </div>
            <p className="text-table leading-6 text-fg-default">{expectedObservation}</p>
          </div>
        )}

        {!result && (
          <p className="text-table leading-6 text-fg-muted">
            Send a request to inspect status, timing, response headers, body preview, and errors.
          </p>
        )}

        {result && (
          <>
            <dl className="grid gap-3 text-table md:grid-cols-2">
              <ResultItem label="Target" value={target?.name ?? result.targetId ?? 'Unknown'} />
              <ResultItem label="Request" value={`${result.method ?? ''} ${result.path ?? ''}`} />
              <ResultItem label="HTTP status" value={String(result.httpStatus ?? 'n/a')} />
              <ResultItem label="Duration" value={`${result.durationMs} ms`} />
              <ResultItem
                label="Completed"
                value={formatDate(result.completedAt ?? result.startedAt)}
              />
              <ResultItem label="Error category" value={result.errorCategory ?? 'n/a'} />
            </dl>

            {result.errorMessage && (
              <div role="status" className="rounded-[6px] border border-danger-fg/40 p-3">
                <div className="mb-1 text-caption font-semibold uppercase text-danger-fg">
                  Action needed
                </div>
                <p className="text-table leading-6 text-fg-default">{result.errorMessage}</p>
              </div>
            )}

            {result.responseHeaders && Object.keys(result.responseHeaders).length > 0 && (
              <div>
                <div className="mb-2 text-caption font-semibold uppercase text-fg-muted">
                  Response headers
                </div>
                <pre className="max-h-36 overflow-auto rounded-[6px] bg-canvas-subtle p-3 text-xs text-fg-default">
                  {JSON.stringify(result.responseHeaders, null, 2)}
                </pre>
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-caption font-semibold uppercase text-fg-muted">
                  Body preview
                </div>
                <button
                  type="button"
                  onClick={() => onCopyResponse(result)}
                  className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-default"
                >
                  Copy response
                </button>
              </div>
              <pre className="max-h-72 overflow-auto rounded-[6px] bg-canvas-subtle p-3 text-xs leading-5 text-fg-default">
                {result.bodyPreview || '(empty response body)'}
              </pre>
              {result.bodyTruncated && (
                <p className="mt-2 text-caption text-fg-muted">
                  Body preview was truncated for display.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption font-semibold uppercase text-fg-muted">{label}</dt>
      <dd className="break-words text-fg-default">{value}</dd>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return 'n/a';
  return new Date(value).toLocaleString();
}
