import type {
  RequestHistoryEntry,
  RequestPreset,
  ServiceRequestDraft,
  ServiceRequestResult,
  ServiceRequestTarget,
  TestingUtility,
} from '@/lib/lab-testing-types';

export const fixtureTargets: ServiceRequestTarget[] = [
  {
    id: 'catalog-service',
    name: 'Catalog Service',
    status: 'ready',
    moduleIds: ['migration', 'workflow'],
    allowedMethods: ['GET'],
    healthPath: '/actuator/health',
    lastObservedAt: '2026-05-24T00:00:00Z',
  },
  {
    id: 'monolith',
    name: 'Monolith',
    status: 'ready',
    moduleIds: ['migration'],
    allowedMethods: ['GET', 'POST'],
    healthPath: '/actuator/health',
    lastObservedAt: '2026-05-24T00:00:00Z',
  },
];

export const fixtureDraft: ServiceRequestDraft = {
  targetId: 'catalog-service',
  method: 'GET',
  path: '/api/catalog',
  query: {},
  headers: { 'X-Lab-Scenario': 'baseline' },
  body: '',
  timeoutMs: 5000,
};

export const fixtureResult: ServiceRequestResult = {
  id: 'req-1',
  targetId: 'catalog-service',
  method: 'GET',
  path: '/api/catalog',
  status: 'succeeded',
  httpStatus: 200,
  durationMs: 42,
  responseHeaders: { 'content-type': 'application/json' },
  bodyPreview: '[{"id":1,"title":"Kind of Blue"}]',
  bodyTruncated: false,
  startedAt: '2026-05-24T00:00:00Z',
  completedAt: '2026-05-24T00:00:00Z',
};

export const fixtureHistoryEntry: RequestHistoryEntry = {
  id: 'hist-1',
  draft: fixtureDraft,
  result: fixtureResult,
  moduleId: 'migration',
  createdAt: '2026-05-24T00:00:01Z',
};

export const fixturePreset: RequestPreset = {
  id: 'migration-catalog-baseline',
  moduleId: 'migration',
  label: 'Catalog baseline',
  description: 'Read catalog data before route changes.',
  concepts: ['Strangler Fig'],
  targetName: 'catalog-service',
  method: 'GET',
  path: '/api/catalog',
  headers: { 'X-Lab-Scenario': 'baseline' },
  expectedObservation: 'The baseline catalog response is available before route shifting.',
  safety: 'read_only',
};

export const fixtureUtility: TestingUtility = {
  id: 'service-health-check',
  label: 'Service health check',
  description: 'Check local lab service readiness.',
  safety: 'read_only',
  kind: 'health_check',
  requiresConfirmation: false,
};
