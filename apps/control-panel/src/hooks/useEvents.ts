"use client";

import { useState } from "react";
import { useWebSocket } from "./useWebSocket";

interface Event {
  severity: string;
  message: string;
  timestamp: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useWebSocket({
    topics: ["/topic/events"],
    onMessage: (msg) => {
      try {
        const parsed = JSON.parse(msg.body);
        if (parsed.type === "EVENT") {
          setEvents((prev) => [parsed.payload, ...prev].slice(0, 50));
        }
      } catch {}
    },
  });

  return { events };
}
