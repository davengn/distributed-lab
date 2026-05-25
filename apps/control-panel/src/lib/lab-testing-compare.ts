import type { ComparisonResult, RequestHistoryEntry } from './lab-testing-types';

export function compareHistoryEntries(
  left: RequestHistoryEntry,
  right: RequestHistoryEntry
): ComparisonResult {
  const leftBody = left.result.bodyPreview ?? '';
  const rightBody = right.result.bodyPreview ?? '';
  const statusChanged = left.result.status !== right.result.status
    || left.result.httpStatus !== right.result.httpStatus;
  const durationDeltaMs = right.result.durationMs - left.result.durationMs;

  return {
    leftEntryId: left.id,
    rightEntryId: right.id,
    statusChanged,
    durationDeltaMs,
    bodySummary: summarizeBodyDifference(leftBody, rightBody),
    generatedAt: new Date().toISOString(),
  };
}

function summarizeBodyDifference(leftBody: string, rightBody: string) {
  if (leftBody === rightBody) {
    return 'Response body preview is unchanged.';
  }
  if (!leftBody && rightBody) {
    return 'Response body was added in the second result.';
  }
  if (leftBody && !rightBody) {
    return 'Response body is empty in the second result.';
  }
  return 'Response body preview changed between the selected results.';
}
