import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import DashboardPage from '@/app/page';
import { useServices } from '@/hooks/useServices';
import { apiClient } from '@/lib/api-client';

jest.mock('@/hooks/useServices', () => ({
  useServices: jest.fn(),
}));

jest.mock('@/hooks/useEvents', () => ({
  useEvents: () => ({ events: [] }),
}));

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockedUseServices = useServices as jest.Mock;
const mockedGet = apiClient.get as jest.Mock;

describe('dashboard prototype layout', () => {
  beforeEach(() => {
    mockedUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockedGet.mockImplementation(() => new Promise(() => {}));
  });

  it('renders the prototype metric row and panel inventory with fallback review data', async () => {
    renderWithProviders(<DashboardPage />);

    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getAllByText('Active Experiments').length).toBeGreaterThan(0);
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Service Health' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Active Experiments' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent Events' })).toBeInTheDocument();

    expect(screen.getByText('monolith')).toBeInTheDocument();
    expect(screen.getByText('gateway')).toBeInTheDocument();
    expect(screen.getByText('kafka')).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByText('EXP-001').length).toBeGreaterThan(0));
    expect(screen.getByRole('columnheader', { name: 'Experiment' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Module' })).toBeInTheDocument();
    expect(screen.getByText(/Strangler Fig redirect active/)).toBeInTheDocument();
  });

  it('yields fallback service data when real Lab API services are available', () => {
    mockedUseServices.mockReturnValue({
      services: [
        {
          id: 'custom',
          name: 'custom-service',
          status: 'running',
          version: 'v9.9.9',
          port: 7777,
          cpuPercent: 1,
          memoryPercent: 2,
          memoryLimitMB: 512,
        },
      ],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<DashboardPage />);

    expect(screen.getByText('custom-service')).toBeInTheDocument();
    expect(screen.queryByText('monolith')).not.toBeInTheDocument();
  });
});
