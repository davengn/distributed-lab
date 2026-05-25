import CatalogPage from '@/app/page';
import { catalogItems, failedResult, okResult } from '@/test/fixtures';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';

describe('CatalogPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('loads catalog items and adds an album to the cart', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(okResult(catalogItems)) }) as unknown as typeof fetch;

    renderWithProviders(<CatalogPage />);

    expect(await screen.findByText('Kind of Blue')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /open cart/i }));
    expect(screen.getByText(/review albums before checkout/i)).toBeInTheDocument();
    expect(screen.getAllByText('Kind of Blue').length).toBeGreaterThan(1);
  });

  it('filters by search and genre while preserving cart controls', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(okResult(catalogItems)) }) as unknown as typeof fetch;

    renderWithProviders(<CatalogPage />);

    await screen.findByText('Kind of Blue');
    fireEvent.change(screen.getByLabelText(/search albums/i), { target: { value: 'coltrane' } });
    expect(screen.getByText('Blue Train')).toBeInTheDocument();
    expect(screen.queryByText('Kind of Blue')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Electronic' } });
    expect(screen.getByText(/no albums match/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open cart/i })).toBeInTheDocument();
  });

  it('shows empty and no-results states', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(okResult([])) }) as unknown as typeof fetch;

    renderWithProviders(<CatalogPage />);

    expect(await screen.findByText(/catalog is empty/i)).toBeInTheDocument();
  });

  it('shows a retry path for backend failures', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(failedResult()) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(okResult(catalogItems)) });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderWithProviders(<CatalogPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/not reachable/i);
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(await screen.findByText('Kind of Blue')).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
