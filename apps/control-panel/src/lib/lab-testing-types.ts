export type ServiceTargetStatus = 'ready' | 'degraded' | 'unavailable' | 'unknown';
export type ServiceRequestStatus = 'pending' | 'succeeded' | 'failed' | 'timed_out' | 'blocked';
export type RequestSafety = 'read_only' | 'state_changing';
export type UtilityStatus = 'pending' | 'succeeded' | 'failed' | 'skipped';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ServiceRequestTarget {
  id: string;
  name: string;
  status: ServiceTargetStatus;
  moduleIds: string[];
  allowedMethods: RequestMethod[];
  healthPath?: string;
  lastObservedAt?: string;
}

export interface ServiceRequestDraft {
  targetId: string;
  method: RequestMethod;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: string;
  timeoutMs: number;
  presetId?: string;
}

export interface ServiceRequestPayload {
  targetId: string;
  method: RequestMethod;
  path: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: string | null;
  timeoutMs?: number;
  clientRequestId?: string;
}

export interface ServiceRequestResult {
  id: string;
  targetId?: string;
  method?: RequestMethod;
  path?: string;
  status: ServiceRequestStatus;
  httpStatus?: number;
  durationMs: number;
  responseHeaders?: Record<string, string>;
  bodyPreview?: string;
  bodyTruncated?: boolean;
  errorCategory?: string;
  errorMessage?: string;
  fieldErrors?: Record<string, string>;
  startedAt?: string;
  completedAt?: string;
}

export interface RequestPreset {
  id: string;
  moduleId: string;
  label: string;
  description: string;
  concepts: string[];
  targetName: string;
  method: RequestMethod;
  path: string;
  headers?: Record<string, string>;
  body?: string;
  expectedObservation: string;
  safety: RequestSafety;
}

export interface RequestHistoryEntry {
  id: string;
  draft: ServiceRequestDraft;
  result: ServiceRequestResult;
  moduleId?: string;
  createdAt: string;
}

export interface ComparisonResult {
  leftEntryId: string;
  rightEntryId: string;
  statusChanged: boolean;
  durationDeltaMs: number;
  bodySummary: string;
  generatedAt: string;
}

export interface TestingUtility {
  id: string;
  label: string;
  description: string;
  moduleId?: string;
  targetId?: string;
  safety: RequestSafety;
  kind: 'health_check' | 'sample_data' | 'cleanup_reminder' | 'safe_reset';
  requiresConfirmation: boolean;
}

export interface UtilityRunResult {
  utilityId: string;
  status: UtilityStatus;
  message: string;
  details?: Record<string, unknown>;
  durationMs?: number;
  completedAt?: string;
}

export const emptyRequestDraft: ServiceRequestDraft = {
  targetId: '',
  method: 'GET',
  path: '/',
  query: {},
  headers: {},
  body: '',
  timeoutMs: 5000,
};
