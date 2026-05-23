import { StatusPill } from "./StatusPill";
import { ProgressBar } from "./ProgressBar";

interface ServiceCardProps {
  name: string;
  status: "running" | "degraded" | "stopped";
  version?: string;
  port?: number;
  cpuPercent: number;
  memoryPercent: number;
}

export function ServiceCard({ name, status, version, port, cpuPercent, memoryPercent }: ServiceCardProps) {
  return (
    <div className="border border-border rounded-[6px] p-3 hover:border-accent-fg transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-fg-default">{name}</span>
          {version && <span className="mono text-caption text-fg-muted">{version}</span>}
        </div>
        <StatusPill status={status} />
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-caption text-fg-muted mb-0.5">
            <span>CPU</span>
            <span className="mono">{cpuPercent.toFixed(1)}%</span>
          </div>
          <ProgressBar value={cpuPercent} />
        </div>
        <div>
          <div className="flex justify-between text-caption text-fg-muted mb-0.5">
            <span>MEM</span>
            <span className="mono">{memoryPercent.toFixed(1)}%</span>
          </div>
          <ProgressBar value={memoryPercent} />
        </div>
      </div>
      {port && (
        <div className="mt-2 text-caption text-fg-muted mono">:{port}</div>
      )}
    </div>
  );
}
