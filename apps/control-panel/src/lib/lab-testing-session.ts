import type { RequestHistoryEntry } from './lab-testing-types';

const HISTORY_KEY = 'distributed-lab:lab-testing-history';
const HISTORY_LIMIT = 20;

export function loadRequestHistory(): RequestHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRequestHistory(entries: RequestHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)));
}

export function appendRequestHistory(
  entry: RequestHistoryEntry,
  entries = loadRequestHistory()
): RequestHistoryEntry[] {
  const next = [entry, ...entries.filter((existing) => existing.id !== entry.id)]
    .slice(0, HISTORY_LIMIT);
  saveRequestHistory(next);
  return next;
}

export function clearRequestHistory() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(HISTORY_KEY);
}

export function copyDraft(entry: RequestHistoryEntry) {
  return {
    ...entry.draft,
    query: { ...entry.draft.query },
    headers: { ...entry.draft.headers },
  };
}
