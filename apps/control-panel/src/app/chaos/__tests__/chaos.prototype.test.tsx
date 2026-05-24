import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';
import ChaosPage from '@/app/chaos/page';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const mockedPost = apiClient.post as jest.Mock;

describe('chaos prototype console', () => {
  beforeEach(() => {
    mockedPost.mockResolvedValue({});
  });

  it('renders the two-row prototype panel layout and fallback workflow data', () => {
    renderWithProviders(<ChaosPage />);

    expect(screen.getByRole('heading', { name: 'Fault Injection' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Active Faults' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Circuit Breakers' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cascading Failure Map' })).toBeInTheDocument();

    expect(screen.getByLabelText('Fault type')).toBeInTheDocument();
    expect(screen.getByLabelText('Target service')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration (seconds)')).toBeInTheDocument();
    expect(screen.getByLabelText('Magnitude')).toBeInTheDocument();

    expect(screen.getByText('FLT-001')).toBeInTheDocument();
    expect(screen.getAllByText('payment-service').length).toBeGreaterThan(0);
    expect(screen.getByText('3 failures')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /cascading failure map/i })).toBeInTheDocument();
  });

  it('injects and stops local fallback faults with compact toast feedback', async () => {
    renderWithProviders(<ChaosPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Inject Fault' }));

    await waitFor(() => expect(screen.getByText('FLT-003')).toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent(/Fault FLT-003 injected/);

    const stopButtons = screen.getAllByRole('button', { name: 'Stop' });
    fireEvent.click(stopButtons[0]);
    expect(screen.queryByText('FLT-001')).not.toBeInTheDocument();
  });
});
