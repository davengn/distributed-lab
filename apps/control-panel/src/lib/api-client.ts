import type {
  ServiceRequestPayload,
  ServiceRequestResult,
  ServiceRequestTarget,
  UtilityRunResult,
} from './lab-testing-types';

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001');

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiClientError(
      error.errorMessage ?? error.details ?? error.error ?? `HTTP ${res.status}`,
      res.status,
      error
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function normalizeApiBase(value: string) {
  const base = value.replace(/\/$/, '');
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
}

interface TargetsResponse {
  targets: ServiceRequestTarget[];
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),

  serviceRequests: {
    listTargets: async () => {
      const response = await request<TargetsResponse>('/service-requests/targets');
      return response.targets;
    },
    send: (body: ServiceRequestPayload) =>
      request<ServiceRequestResult>('/service-requests', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    runUtility: (utilityId: string, body: { targetId?: string; moduleId?: string; confirmed?: boolean }) =>
      request<UtilityRunResult>(`/service-requests/utilities/${utilityId}/runs`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
};
