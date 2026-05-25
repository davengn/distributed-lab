"use client";

import { useState } from 'react';
import type { TestingUtility, UtilityRunResult } from '@/lib/lab-testing-types';

interface TestingUtilitiesPanelProps {
  utilities: TestingUtility[];
  results: Record<string, UtilityRunResult>;
  runningUtilityId?: string;
  onRunUtility: (utility: TestingUtility, confirmed: boolean) => void;
}

export function TestingUtilitiesPanel({
  utilities,
  results,
  runningUtilityId,
  onRunUtility,
}: TestingUtilitiesPanelProps) {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-[6px] border border-border bg-canvas">
      <div className="border-b border-border bg-canvas-subtle px-4 py-3">
        <h3 className="text-sm font-medium text-fg-default">Testing utilities</h3>
      </div>

      <div className="divide-y divide-border-subtle">
        {utilities.map((utility) => {
          const result = results[utility.id];
          const needsConfirmation = utility.requiresConfirmation;
          return (
            <article key={utility.id} className="p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-fg-default">{utility.label}</h4>
                <span className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-muted">
                  {utility.safety === 'state_changing' ? 'State-changing' : 'Read-only'}
                </span>
              </div>
              <p className="text-table leading-6 text-fg-muted">{utility.description}</p>

              {needsConfirmation && (
                <label className="mt-3 flex items-center gap-2 text-caption text-fg-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(confirmed[utility.id])}
                    onChange={(event) =>
                      setConfirmed((current) => ({
                        ...current,
                        [utility.id]: event.target.checked,
                      }))
                    }
                  />
                  Confirm this state-changing utility
                </label>
              )}

              {result && (
                <div role="status" className="mt-3 rounded-[6px] bg-canvas-subtle p-3 text-table">
                  <div className="font-medium text-fg-default">{result.status}</div>
                  <p className="mt-1 text-fg-muted">{result.message}</p>
                </div>
              )}

              <button
                type="button"
                disabled={runningUtilityId === utility.id}
                onClick={() => onRunUtility(utility, Boolean(confirmed[utility.id]))}
                className="mt-3 rounded-[6px] border border-border px-3 py-1.5 text-sm font-medium text-fg-default disabled:cursor-not-allowed disabled:opacity-60"
              >
                {runningUtilityId === utility.id ? 'Running...' : 'Run utility'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
