interface StatusPillProps {
  status:
    | "running"
    | "degraded"
    | "stopped"
    | "open"
    | "closed"
    | "completed"
    | "failed";
  label?: string;
}

const STATUS_STYLES: Record<string, string> = {
  running: "bg-success-subtle text-success-fg",
  degraded: "bg-attention-subtle text-attention-fg",
  stopped: "bg-canvas-subtle text-fg-muted",
  open: "bg-danger-subtle text-danger-fg",
  closed: "bg-success-subtle text-success-fg",
  completed: "bg-done-subtle text-done-fg",
  failed: "bg-danger-subtle text-danger-fg",
};

const DOT_STYLES: Record<string, string> = {
  running: "bg-success-fg",
  degraded: "bg-attention-fg",
  stopped: "bg-fg-muted",
  open: "bg-danger-fg",
  closed: "bg-success-fg",
  completed: "bg-done-fg",
  failed: "bg-danger-fg",
};

export function StatusPill({ status, label }: StatusPillProps) {
  const display = label ?? status;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-tag ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status]}`} />
      {display}
    </span>
  );
}
