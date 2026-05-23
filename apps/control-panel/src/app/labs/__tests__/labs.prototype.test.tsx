import { fireEvent, renderWithProviders, screen } from '@/test/test-utils';
import LabsPage from '@/app/labs/page';

describe('labs prototype flow', () => {
  it('renders all five prototype modules with required tags', () => {
    renderWithProviders(<LabsPage />);

    expect(screen.getByText('Migration & Decomposition')).toBeInTheDocument();
    expect(screen.getByText('Distributed Data & Consistency')).toBeInTheDocument();
    expect(screen.getByText('Resiliency & Chaos')).toBeInTheDocument();
    expect(screen.getByText('Workflow & Communication')).toBeInTheDocument();
    expect(screen.getByText('Observability Suite')).toBeInTheDocument();

    expect(screen.getByText('Strangler Fig')).toBeInTheDocument();
    expect(screen.getByText('Parallel Run')).toBeInTheDocument();
    expect(screen.getByText('Feature Toggles')).toBeInTheDocument();
    expect(screen.getByText('CAP')).toBeInTheDocument();
    expect(screen.getByText('Event Sourcing')).toBeInTheDocument();
    expect(screen.getByText('Bulkhead')).toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
    expect(screen.getByText('Registry')).toBeInTheDocument();
  });

  it('selects a module and switches accessible detail tabs', () => {
    renderWithProviders(<LabsPage />);

    const module = screen.getByRole('button', { name: /resiliency & chaos/i });
    fireEvent.click(module);

    expect(module).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Chaos engineering panel')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Experiments' }));
    expect(screen.getByRole('tabpanel', { name: 'Experiments' })).toHaveTextContent(
      'No experiments running for this module'
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Guide' }));
    expect(screen.getByRole('tabpanel', { name: 'Guide' })).toHaveTextContent(
      'Lab guide and concept notes'
    );
  });
});
