import { compareHistoryEntries } from './lab-testing-compare';
import {
  appendRequestHistory,
  clearRequestHistory,
  copyDraft,
  loadRequestHistory,
} from './lab-testing-session';
import { fixtureHistoryEntry } from '@/test/lab-testing-fixtures';

describe('lab testing session history', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('serializes, trims, and loads recent request history entries', () => {
    const entries = Array.from({ length: 22 }, (_, index) => ({
      ...fixtureHistoryEntry,
      id: `hist-${index}`,
      createdAt: `2026-05-24T00:00:${String(index).padStart(2, '0')}Z`,
    }));

    let current = loadRequestHistory();
    for (const entry of entries) {
      current = appendRequestHistory(entry, current);
    }

    expect(loadRequestHistory()).toHaveLength(20);
    expect(loadRequestHistory()[0].id).toBe('hist-21');
  });

  it('loads retry drafts as copies and compares response differences', () => {
    const retryDraft = copyDraft(fixtureHistoryEntry);
    retryDraft.headers['X-Lab-Scenario'] = 'changed';

    expect(fixtureHistoryEntry.draft.headers['X-Lab-Scenario']).toBe('baseline');

    const comparison = compareHistoryEntries(fixtureHistoryEntry, {
      ...fixtureHistoryEntry,
      id: 'hist-2',
      result: {
        ...fixtureHistoryEntry.result,
        durationMs: 80,
        bodyPreview: 'changed',
      },
    });

    expect(comparison.durationDeltaMs).toBe(38);
    expect(comparison.bodySummary).toContain('changed');
  });

  it('clears current browser session history', () => {
    appendRequestHistory(fixtureHistoryEntry);
    clearRequestHistory();

    expect(loadRequestHistory()).toEqual([]);
  });
});
