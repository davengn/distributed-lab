import CatalogPage from '@/app/page';
import { okResult } from '@/test/fixtures';
import { renderWithProviders, screen } from '@/test/test-utils';

describe('MusicCorp UI separation from 004 lab controls', () => {
  it('does not render raw request composer controls or preset copy', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(okResult([])) }) as unknown as typeof fetch;

    renderWithProviders(<CatalogPage />);

    expect(await screen.findByText(/catalog is empty/i)).toBeInTheDocument();
    expect(screen.queryByText('Method')).not.toBeInTheDocument();
    expect(screen.queryByText('Path')).not.toBeInTheDocument();
    expect(screen.queryByText('Headers')).not.toBeInTheDocument();
    expect(screen.queryByText('Request body')).not.toBeInTheDocument();
    expect(screen.queryByText(/load preset/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/lab testing workspace/i)).not.toBeInTheDocument();
  });
});
