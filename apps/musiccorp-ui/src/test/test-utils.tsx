import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

export function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
    json: () => Promise.resolve(body),
  } as Response;
}

export function mockFetchOnce(body: unknown, status = 200) {
  const fetchMock = jest.fn().mockResolvedValue(jsonResponse(body, status));
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}
