import { StorefrontActivityPanel } from '@/components/StorefrontActivityPanel';
import { storefrontEvents } from '@/test/fixtures';
import { fireEvent, renderWithProviders, screen } from '@/test/test-utils';

describe('StorefrontActivityPanel', () => {
  it('shows status, timestamp, and duration for customer actions', () => {
    renderWithProviders(<StorefrontActivityPanel events={storefrontEvents} />);

    expect(screen.getByText('Catalog load')).toBeInTheDocument();
    expect(screen.getByText('succeeded')).toBeInTheDocument();
    expect(screen.getByText(/38 ms/)).toBeInTheDocument();
    expect(screen.getByText('Payment submit')).toBeInTheDocument();
    expect(screen.getByText('timed out')).toBeInTheDocument();
  });

  it('clears recent activity when requested', () => {
    const onClear = jest.fn();
    renderWithProviders(<StorefrontActivityPanel events={storefrontEvents} onClear={onClear} />);

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(onClear).toHaveBeenCalled();
  });
});
