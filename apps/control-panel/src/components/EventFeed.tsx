import { useEvents } from "@/hooks/useEvents";
import type { PrototypeEvent } from "@/lib/prototype-data";
import { prototypeEvents } from "@/lib/prototype-data";

const SEVERITY_STYLES: Record<string, string> = {
  info: "bg-accent-fg",
  success: "bg-success-fg",
  warning: "bg-attention-fg",
  error: "bg-danger-fg",
  done: "bg-done-fg",
};

interface EventFeedProps {
  events?: PrototypeEvent[];
  fallbackEvents?: PrototypeEvent[];
}

export function EventFeed({ events, fallbackEvents = prototypeEvents }: EventFeedProps) {
  const { events: liveEvents } = useEvents();
  const items = events ?? (liveEvents.length > 0 ? liveEvents.map(normalizeLiveEvent) : fallbackEvents);

  if (items.length === 0) {
    return <p className="p-4 text-sm text-fg-muted">No events yet</p>;
  }

  return (
    <ul className="flex flex-col">
      {items.map((event, i) => (
        <li key={`${event.timestamp}-${i}`} className="flex gap-3 border-b border-border-subtle px-4 py-2 text-table last:border-b-0">
          <span className="mono w-16 shrink-0 text-caption text-fg-muted">{formatEventTime(event.timestamp)}</span>
          <span
            className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${
              SEVERITY_STYLES[event.severity] ?? "bg-fg-muted"
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 text-fg-default">{renderRichText(event.message)}</div>
        </li>
      ))}
    </ul>
  );
}

function normalizeLiveEvent(event: { severity: string; message: string; timestamp: string }): PrototypeEvent {
  const severity =
    event.severity === "success" ||
    event.severity === "warning" ||
    event.severity === "error" ||
    event.severity === "done"
      ? event.severity
      : "info";

  return {
    ...event,
    severity,
  };
}

function formatEventTime(timestamp: string) {
  if (/^\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderRichText(message: string) {
  return message
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      return <span key={index}>{part}</span>;
    });
}
