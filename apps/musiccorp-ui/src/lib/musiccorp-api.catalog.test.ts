import { getCatalogItem, listCatalogItems } from '@/lib/musiccorp-api';
import { catalogItems } from '@/test/fixtures';
import { jsonResponse } from '@/test/test-utils';

describe('MusicCorp catalog adapter', () => {
  beforeEach(() => {
    process.env.MUSICCORP_BACKEND_BASE_URL = 'http://backend.test';
  });

  it('loads catalog items from the backend', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse(catalogItems));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await listCatalogItems();

    expect(result.ok).toBe(true);
    expect(result.ok ? result.data[0].title : '').toBe('Kind of Blue');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://backend.test/api/catalog',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('treats an empty catalog as a valid storefront state', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse([])) as unknown as typeof fetch;

    const result = await listCatalogItems();

    expect(result.ok).toBe(true);
    expect(result.ok ? result.data : []).toEqual([]);
  });

  it('maps backend outages to an unavailable catalog result', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ error: 'down' }, 503)) as unknown as typeof fetch;

    const result = await listCatalogItems();

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('unavailable');
  });

  it('maps aborted requests to timeout results', async () => {
    const error = new Error('aborted');
    error.name = 'AbortError';
    global.fetch = jest.fn().mockRejectedValue(error) as unknown as typeof fetch;

    const result = await listCatalogItems();

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('timeout');
  });

  it('maps malformed catalog responses without crashing the UI', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ id: 1 })) as unknown as typeof fetch;

    const result = await listCatalogItems();

    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.category).toBe('unexpected');
  });

  it('loads a single catalog item by id', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse(catalogItems[0]));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await getCatalogItem('1');

    expect(result.ok).toBe(true);
    expect(result.ok ? result.data.artist : '').toBe('Miles Davis');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://backend.test/api/catalog/1',
      expect.objectContaining({ method: 'GET' })
    );
  });
});
