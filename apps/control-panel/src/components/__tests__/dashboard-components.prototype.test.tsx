import { renderWithProviders, screen } from '@/test/test-utils';
import { EventFeed } from '@/components/EventFeed';
import { ExperimentsTable } from '@/components/ExperimentsTable';
import { MetricCard } from '@/components/MetricCard';
import { ServiceCard } from '@/components/ServiceCard';
import { prototypeEvents, prototypeExperiments } from '@/lib/prototype-data';

jest.mock('@/hooks/useEvents', () => ({
  useEvents: () => ({ events: [] }),
}));

describe('dashboard prototype components', () => {
  it('renders metric card sparkline value and compact subtext', () => {
    renderWithProviders(
      <MetricCard
        label="Uptime"
        value="2d 14h"
        subtext={
          <>
            Since last <code>docker compose up</code>
          </>
        }
        sparkline={[18, 16, 14, 15, 12, 10]}
      />
    );

    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('2d 14h')).toBeInTheDocument();
    expect(screen.getByText('docker compose up')).toBeInTheDocument();
  });

  it('renders service card metadata and CPU/MEM progress rows', () => {
    renderWithProviders(
      <ServiceCard
        name="payment-service"
        displayName="payment"
        description="Payment Service"
        status="degraded"
        version="v0.1.5"
        port={8083}
        cpuPercent={45}
        memoryPercent={71}
      />
    );

    expect(screen.getByText('payment')).toBeInTheDocument();
    expect(screen.getByText(/Payment Service/)).toBeInTheDocument();
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('MEM')).toBeInTheDocument();
    expect(screen.getByText('71%')).toBeInTheDocument();
  });

  it('renders experiment rows with prototype columns and status pills', () => {
    renderWithProviders(<ExperimentsTable experiments={prototypeExperiments} />);

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Experiment' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Module' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByText('EXP-004')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders recent events with timestamp, severity marker, and inline code', () => {
    renderWithProviders(<EventFeed events={prototypeEvents.slice(0, 2)} />);

    expect(screen.getByText('14:32')).toBeInTheDocument();
    expect(screen.getAllByText('/api/catalog').length).toBeGreaterThan(0);
    expect(screen.getByText('catalog-service')).toBeInTheDocument();
  });
});
