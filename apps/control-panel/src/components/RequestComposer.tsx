"use client";

import type {
  RequestMethod,
  ServiceRequestDraft,
  ServiceRequestTarget,
} from '@/lib/lab-testing-types';

interface RequestComposerProps {
  targets: ServiceRequestTarget[];
  draft: ServiceRequestDraft;
  fieldErrors: Record<string, string>;
  isSubmitting: boolean;
  onDraftChange: (draft: ServiceRequestDraft) => void;
  onSubmit: () => void;
}

const methods: RequestMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function RequestComposer({
  targets,
  draft,
  fieldErrors,
  isSubmitting,
  onDraftChange,
  onSubmit,
}: RequestComposerProps) {
  const selectedTarget = targets.find((target) => target.id === draft.targetId);
  const allowedMethods = selectedTarget?.allowedMethods ?? methods;

  function update(patch: Partial<ServiceRequestDraft>) {
    onDraftChange({ ...draft, ...patch });
  }

  return (
    <section className="rounded-[6px] border border-border bg-canvas">
      <div className="border-b border-border bg-canvas-subtle px-4 py-3">
        <h3 className="text-sm font-medium text-fg-default">Target and request</h3>
      </div>

      <div className="grid gap-4 p-4">
        <label className="grid gap-1 text-table text-fg-default">
          <span className="font-medium">Target service</span>
          <select
            value={draft.targetId}
            onChange={(event) => update({ targetId: event.target.value })}
            className="min-h-10 rounded-[6px] border border-border bg-canvas px-3 text-sm"
          >
            <option value="">Choose a service</option>
            {targets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name} ({target.status})
              </option>
            ))}
          </select>
          {fieldErrors.targetId && <FieldError>{fieldErrors.targetId}</FieldError>}
        </label>

        <div className="grid gap-3 md:grid-cols-[8rem_1fr_8rem]">
          <label className="grid gap-1 text-table text-fg-default">
            <span className="font-medium">Method</span>
            <select
              value={draft.method}
              onChange={(event) => update({ method: event.target.value as RequestMethod })}
              className="min-h-10 rounded-[6px] border border-border bg-canvas px-3 text-sm"
            >
              {methods.map((method) => (
                <option key={method} value={method} disabled={!allowedMethods.includes(method)}>
                  {method}
                </option>
              ))}
            </select>
            {fieldErrors.method && <FieldError>{fieldErrors.method}</FieldError>}
          </label>

          <label className="grid gap-1 text-table text-fg-default">
            <span className="font-medium">Path</span>
            <input
              value={draft.path}
              onChange={(event) => update({ path: event.target.value })}
              className="min-h-10 rounded-[6px] border border-border bg-canvas px-3 text-sm"
              placeholder="/api/catalog"
            />
            {fieldErrors.path && <FieldError>{fieldErrors.path}</FieldError>}
          </label>

          <label className="grid gap-1 text-table text-fg-default">
            <span className="font-medium">Timeout</span>
            <input
              type="number"
              min={500}
              max={10000}
              step={500}
              value={draft.timeoutMs}
              onChange={(event) => update({ timeoutMs: Number(event.target.value) })}
              className="min-h-10 rounded-[6px] border border-border bg-canvas px-3 text-sm"
            />
            {fieldErrors.timeoutMs && <FieldError>{fieldErrors.timeoutMs}</FieldError>}
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-table text-fg-default">
            <span className="font-medium">Query values</span>
            <textarea
              value={serializeEntries(draft.query)}
              onChange={(event) => update({ query: parseEntries(event.target.value) })}
              rows={3}
              className="rounded-[6px] border border-border bg-canvas px-3 py-2 text-sm"
              placeholder="limit=5"
            />
          </label>

          <label className="grid gap-1 text-table text-fg-default">
            <span className="font-medium">Headers</span>
            <textarea
              value={serializeEntries(draft.headers)}
              onChange={(event) => update({ headers: parseEntries(event.target.value) })}
              rows={3}
              className="rounded-[6px] border border-border bg-canvas px-3 py-2 text-sm"
              placeholder="X-Lab-Scenario=baseline"
            />
            {fieldErrors.headers && <FieldError>{fieldErrors.headers}</FieldError>}
          </label>
        </div>

        <label className="grid gap-1 text-table text-fg-default">
          <span className="font-medium">Body</span>
          <textarea
            value={draft.body}
            onChange={(event) => update({ body: event.target.value })}
            rows={5}
            className="rounded-[6px] border border-border bg-canvas px-3 py-2 font-mono text-sm"
            placeholder='{"id":"demo"}'
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption text-fg-muted">
            Requests are limited to known local lab services.
          </p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="min-h-10 rounded-[6px] bg-accent-fg px-4 text-sm font-medium text-canvas disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send request'}
          </button>
        </div>
      </div>
    </section>
  );
}

function FieldError({ children }: { children: string }) {
  return <span className="text-caption font-medium text-danger-fg">{children}</span>;
}

function serializeEntries(entries: Record<string, string>) {
  return Object.entries(entries)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

function parseEntries(value: string) {
  return value.split('\n').reduce<Record<string, string>>((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed) return acc;
    const [key, ...rest] = trimmed.split('=');
    if (key.trim()) acc[key.trim()] = rest.join('=').trim();
    return acc;
  }, {});
}
