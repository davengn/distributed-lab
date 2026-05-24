import { fireEvent, renderWithProviders, screen, within } from '@/test/test-utils';
import LabsPage from '@/app/labs/page';

const moduleExpectations = [
  {
    name: /migration & decomposition/i,
    overviewFeature: 'Strangler Fig proxy',
    experimentTitle: 'Strangler route switch',
    guideStep: 'Route one capability',
  },
  {
    name: /distributed data & consistency/i,
    overviewFeature: 'CAP theorem visualizer',
    experimentTitle: 'CAP partition drill',
    guideStep: 'Create a consistency stress case',
  },
  {
    name: /resiliency & chaos/i,
    overviewFeature: 'Chaos engineering panel',
    experimentTitle: 'Bounded latency fault',
    guideStep: 'Inject a bounded fault',
  },
  {
    name: /workflow & communication/i,
    overviewFeature: 'Saga visualizer',
    experimentTitle: 'Saga failure path',
    guideStep: 'Inspect message flow',
  },
  {
    name: /observability suite/i,
    overviewFeature: 'Distributed tracing dashboard',
    experimentTitle: 'Trace one request',
    guideStep: 'Correlate one request',
  },
];

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
      'Bounded latency fault'
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Guide' }));
    expect(screen.getByRole('tabpanel', { name: 'Guide' })).toHaveTextContent(
      'Inject a bounded fault'
    );
  });

  it('shows module-specific experiment catalog content for every module', () => {
    renderWithProviders(<LabsPage />);

    for (const module of moduleExpectations) {
      fireEvent.click(screen.getByRole('button', { name: module.name }));
      fireEvent.click(screen.getByRole('tab', { name: 'Experiments' }));

      const panel = screen.getByRole('tabpanel', { name: 'Experiments' });
      expect(panel).toHaveTextContent(module.experimentTitle);
      expect(panel).toHaveTextContent('Objective');
      expect(panel).toHaveTextContent('Setup');
      expect(panel).toHaveTextContent('Action');
      expect(panel).toHaveTextContent('Observe');
      expect(panel).toHaveTextContent('Success signal');
      expect(panel).not.toHaveTextContent('No experiments running for this module');
    }
  });

  it('shows structured guide content for every module', () => {
    renderWithProviders(<LabsPage />);

    for (const module of moduleExpectations) {
      fireEvent.click(screen.getByRole('button', { name: module.name }));
      fireEvent.click(screen.getByRole('tab', { name: 'Guide' }));

      const panel = screen.getByRole('tabpanel', { name: 'Guide' });
      expect(panel).toHaveTextContent(module.guideStep);
      expect(panel).toHaveTextContent('Objective');
      expect(panel).toHaveTextContent('Prerequisites');
      expect(panel).toHaveTextContent('Setup check');
      expect(panel).toHaveTextContent('Steps');
      expect(panel).toHaveTextContent('Validation');
      expect(panel).toHaveTextContent('Cleanup');
      expect(panel).not.toHaveTextContent('Lab guide and concept notes');
    }
  });

  it('keeps overview, experiments, and guide content aligned per selected module', () => {
    renderWithProviders(<LabsPage />);

    for (const module of moduleExpectations) {
      fireEvent.click(screen.getByRole('button', { name: module.name }));

      expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent(
        module.overviewFeature
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Experiments' }));
      expect(screen.getByRole('tabpanel', { name: 'Experiments' })).toHaveTextContent(
        module.experimentTitle
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Guide' }));
      expect(screen.getByRole('tabpanel', { name: 'Guide' })).toHaveTextContent(module.guideStep);
    }

    fireEvent.click(screen.getByRole('button', { name: /migration & decomposition/i }));
    fireEvent.click(screen.getByRole('tab', { name: 'Experiments' }));

    const migrationPanel = screen.getByRole('tabpanel', { name: 'Experiments' });
    expect(migrationPanel).toHaveTextContent('Strangler route switch');
    expect(migrationPanel).not.toHaveTextContent('Bounded latency fault');
  });

  it('supports keyboard tab switching while preserving inactive experiment definitions', () => {
    renderWithProviders(<LabsPage />);

    fireEvent.click(screen.getByRole('button', { name: /observability suite/i }));

    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });
    const experimentsPanel = screen.getByRole('tabpanel', { name: 'Experiments' });

    expect(experimentsPanel).toHaveTextContent('No live run is active');
    expect(experimentsPanel).toHaveTextContent('Trace one request');

    const experimentsTab = screen.getByRole('tab', { name: 'Experiments' });
    fireEvent.keyDown(experimentsTab, { key: 'ArrowRight' });
    const guidePanel = screen.getByRole('tabpanel', { name: 'Guide' });

    expect(within(guidePanel).getByText('Steps')).toBeInTheDocument();
    expect(guidePanel).toHaveTextContent('Correlate one request');
  });
});
