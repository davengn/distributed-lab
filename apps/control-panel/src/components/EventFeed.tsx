import { useEvents } from "@/hooks/useEvents";

const SEVERITY_STYLES: Record<string, string> = {
  info: "text-accent-fg",
  success: "text-success-fg",
  warning: "text-attention-fg",
  error: "text-danger-fg",
};

const SEVERITY_ICON: Record<string, string> = {
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
};

export function EventFeed() {
  const { events } = useEvents();

  if (events.length === 0) {
    return <p className="text-fg-muted text-sm">No events yet</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((event, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <svg className={`w-4 h-4 shrink-0 mt-0.5 ${SEVERITY_STYLES[event.severity] ?? "text-fg-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={SEVERITY_ICON[event.severity] ?? SEVERITY_ICON.info} />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-fg-default">{event.message}</p>
            <span className="mono text-caption text-fg-muted">{new Date(event.timestamp).toLocaleTimeString()}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
