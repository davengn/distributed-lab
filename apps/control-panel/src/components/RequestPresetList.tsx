"use client";

import type { RequestPreset, ServiceRequestTarget } from '@/lib/lab-testing-types';

interface RequestPresetListProps {
  moduleId: string;
  presets: RequestPreset[];
  targets: ServiceRequestTarget[];
  selectedPresetId?: string;
  onLoadPreset: (preset: RequestPreset) => void;
}

export function RequestPresetList({
  moduleId,
  presets,
  targets,
  selectedPresetId,
  onLoadPreset,
}: RequestPresetListProps) {
  const sorted = [...presets].sort((a, b) => {
    if (a.moduleId === moduleId && b.moduleId !== moduleId) return -1;
    if (a.moduleId !== moduleId && b.moduleId === moduleId) return 1;
    return a.label.localeCompare(b.label);
  });

  return (
    <section className="rounded-[6px] border border-border bg-canvas">
      <div className="border-b border-border bg-canvas-subtle px-4 py-3">
        <h3 className="text-sm font-medium text-fg-default">Request presets</h3>
      </div>
      <div className="divide-y divide-border-subtle">
        {sorted.length === 0 && (
          <p className="p-4 text-table leading-6 text-fg-muted">
            No presets are available for this module. Custom local service requests still work.
          </p>
        )}
        {sorted.map((preset) => {
          const targetAvailable = targets.some((target) => target.id === preset.targetName);
          const selected = selectedPresetId === preset.id;
          return (
            <article key={preset.id} className="p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-fg-default">{preset.label}</h4>
                <span className="rounded-[6px] border border-border px-2 py-1 text-caption text-fg-muted">
                  {preset.safety === 'state_changing' ? 'State-changing' : 'Read-only'}
                </span>
              </div>
              <p className="text-table leading-6 text-fg-muted">{preset.description}</p>
              <p className="mt-2 text-caption text-fg-muted">
                {preset.method} {preset.path} on {preset.targetName}
              </p>
              {!targetAvailable && (
                <p className="mt-2 text-caption font-medium text-danger-fg">
                  Target is not currently reported by the Lab API.
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {preset.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-[6px] border border-border bg-canvas-subtle px-2 py-1 text-caption text-fg-muted"
                  >
                    {concept}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => onLoadPreset(preset)}
                  className="ml-auto rounded-[6px] border border-border px-3 py-1.5 text-sm font-medium text-fg-default"
                >
                  {selected ? 'Loaded' : 'Load preset'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
