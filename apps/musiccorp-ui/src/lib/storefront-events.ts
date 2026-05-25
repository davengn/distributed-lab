'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StorefrontEvent, StorefrontEventStatus } from '@/lib/types';

const EVENTS_STORAGE_KEY = 'musiccorp.storefront.events.v1';
const EVENTS_UPDATED_EVENT = 'musiccorp-storefront-events-updated';
const MAX_EVENTS = 8;

export function createActionId(scope: string): string {
  const random = Math.random().toString(36).slice(2, 9);
  return `${scope}-${Date.now().toString(36)}-${random}`;
}

export function toEventStatus(ok: boolean, category?: string): StorefrontEventStatus {
  if (ok) {
    return 'succeeded';
  }
  return category === 'timeout' ? 'timed_out' : 'failed';
}

export function readStorefrontEvents(): StorefrontEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(EVENTS_STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.slice(0, MAX_EVENTS) : [];
  } catch {
    return [];
  }
}

export function recordStorefrontEvent(event: StorefrontEvent): StorefrontEvent[] {
  if (typeof window === 'undefined') {
    return [event];
  }

  const nextEvents = [event, ...readStorefrontEvents()].slice(0, MAX_EVENTS);
  window.sessionStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(nextEvents));
  window.dispatchEvent(new Event(EVENTS_UPDATED_EVENT));
  return nextEvents;
}

export function clearStorefrontEvents(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(EVENTS_STORAGE_KEY);
  window.dispatchEvent(new Event(EVENTS_UPDATED_EVENT));
}

export function useStorefrontEvents() {
  const [events, setEvents] = useState<StorefrontEvent[]>([]);

  useEffect(() => {
    setEvents(readStorefrontEvents());

    const refresh = () => setEvents(readStorefrontEvents());
    window.addEventListener(EVENTS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENTS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const record = useCallback((event: StorefrontEvent) => {
    setEvents(recordStorefrontEvent(event));
  }, []);

  const clear = useCallback(() => {
    clearStorefrontEvents();
    setEvents([]);
  }, []);

  return { events, record, clear };
}
