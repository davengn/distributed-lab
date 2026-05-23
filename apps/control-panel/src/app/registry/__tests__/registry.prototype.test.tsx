import { renderWithProviders, screen } from '@/test/test-utils';
import RegistryPage from '@/app/registry/page';
import { useServices } from '@/hooks/useServices';

jest.mock('@/hooks/useServices', () => ({
  useServices: jest.fn(),
}));

const mockedUseServices = useServices as jest.Mock;

describe('registry prototype view', () => {
  beforeEach(() => {
    mockedUseServices.mockReturnValue({
      services: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders service topology with required layers and fallback nodes', () => {
    renderWithProviders(<RegistryPage />);

    expect(screen.getByRole('heading', { name: 'Service Topology' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /service topology/i })).toBeInTheDocument();
    expect(screen.getByText('CONTROL')).toBeInTheDocument();
    expect(screen.getByText('GATEWAY')).toBeInTheDocument();
    expect(screen.getByText('APPLICATION')).toBeInTheDocument();
    expect(screen.getByText('SERVICES')).toBeInTheDocument();
    expect(screen.getByText('DATA')).toBeInTheDocument();
    expect(screen.getAllByText('lab-api').length).toBeGreaterThan(0);
    expect(screen.getAllByText('api-gateway').length).toBeGreaterThan(0);
    expect(screen.getAllByText('payment-service').length).toBeGreaterThan(0);
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Redis')).toBeInTheDocument();
  });

  it('renders the prototype service catalog with horizontal panel scrolling', () => {
    renderWithProviders(<RegistryPage />);

    expect(screen.getByRole('heading', { name: 'Service Catalog' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Service' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Version' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Image' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Dependencies' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Port' })).toBeInTheDocument();
    expect(screen.getByText('v1.2.0')).toBeInTheDocument();
    expect(screen.getByText('docker-socket')).toBeInTheDocument();
    expect(screen.getByLabelText('Service catalog')).toHaveClass('overflow-x-auto');
  });
});
