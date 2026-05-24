import { StatusPill } from "./StatusPill";
import { ProgressBar } from "./ProgressBar";

interface ServiceCardProps {
  name: string;
  displayName?: string;
  description?: string;
  status: "running" | "degraded" | "stopped";
  version?: string;
  port?: number;
  cpuPercent: number;
  memoryPercent: number;
}

export function ServiceCard({
  name,
  displayName,
  description,
  status,
  version,
  port,
  cpuPercent,
  memoryPercent,
}: ServiceCardProps) {
  const title = displayName ?? name;
  const meta = [description, version, port ? `:${port}` : undefined].filter(Boolean).join(" · ");

  return (
    <article className="rounded-[6px] border border-border bg-canvas p-3 transition-colors hover:border-accent-fg">
      <div className="mb-2 flex items-start justify-between gap-3">
        <span className="mono min-w-0 truncate text-[13px] font-semibold text-fg-default" title={name}>
          {title}
        </span>
        <StatusPill status={status} />
      </div>
      {meta && <div className="mb-2.5 truncate text-caption text-fg-muted">{meta}</div>}
      <div className="space-y-1">
        <ResourceRow label="CPU" value={cpuPercent} />
        <ResourceRow label="MEM" value={memoryPercent} />
      </div>
    </article>
  );
}

function ResourceRow({ label, value }: { label: string; value: number }) {
  const displayValue = `${Math.round(value)}%`;

  return (
    <div className="flex items-center gap-2">
      <span className="mono w-7 shrink-0 text-[11px] text-fg-muted">{label}</span>
      <ProgressBar value={value} />
      <span className="mono w-8 shrink-0 text-right text-[11px] text-fg-muted">{displayValue}</span>
    </div>
  );
}
