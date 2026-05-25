import { fireEvent, renderWithProviders, screen, waitFor, within } from '@/test/test-utils';
import LabsPage from '@/app/labs/page';
import { fixtureResult, fixtureTargets } from '@/test/lab-testing-fixtures';

const fetchMock = jest.fn();

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

async function openTestingWorkspace() {
  renderWithProviders(<LabsPage />);
  fireEvent.click(screen.getByRole('button', { name: /migration & decomposition/i }));
  fireEvent.click(screen.getByRole('tab', { name: 'Testing' }));
  await screen.findByText('Lab testing workspace');
  await screen.findByText(/Catalog Service/);
}

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
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    window.sessionStorage.clear();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

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

  it('renders the testing workspace and validates required request fields', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }));

    await openTestingWorkspace();
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));

    expect(screen.getByText('Choose a target service.')).toBeInTheDocument();
    expect(screen.getAllByText('Fix the highlighted fields.').length).toBeGreaterThan(0);
  });

  it('loads a module preset into the composer with the expected observation', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }));

    await openTestingWorkspace();
    fireEvent.click(screen.getAllByRole('button', { name: /load preset/i })[0]);

    expect(screen.getByDisplayValue('/api/catalog')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/X-Lab-Scenario=(baseline|shifted)/)).toBeInTheDocument();
    expect(screen.getByText(/catalog data|catalog items/i)).toBeInTheDocument();
  });

  it('submits a preset request and displays a successful result', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }))
      .mockResolvedValueOnce(jsonResponse(fixtureResult));

    await openTestingWorkspace();
    fireEvent.click(screen.getAllByRole('button', { name: /load preset/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));

    expect(screen.getByText('Pending')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Succeeded')).toBeInTheDocument());
    expect(screen.getAllByText(/kind of blue/i).length).toBeGreaterThan(0);
  });

  it('keeps failed request details actionable and preserves the draft', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }))
      .mockResolvedValueOnce(jsonResponse({
        id: 'req-timeout',
        targetId: 'catalog-service',
        method: 'GET',
        path: '/api/catalog',
        status: 'timed_out',
        durationMs: 5000,
        errorCategory: 'timeout',
        errorMessage: 'The request exceeded the configured timeout.',
      }, 504));

    await openTestingWorkspace();
    fireEvent.click(screen.getAllByRole('button', { name: /load preset/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));

    await waitFor(() => expect(screen.getByText('Timed out')).toBeInTheDocument());
    expect(screen.getAllByText('The request exceeded the configured timeout.').length)
      .toBeGreaterThan(0);
    expect(screen.getByDisplayValue('/api/catalog')).toBeInTheDocument();
  });

  it('stores session history, retries entries, and compares two results', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }))
      .mockResolvedValueOnce(jsonResponse(fixtureResult))
      .mockResolvedValueOnce(jsonResponse({
        ...fixtureResult,
        id: 'req-2',
        durationMs: 80,
        bodyPreview: '[{"id":1,"title":"Blue Train"}]',
      }));

    await openTestingWorkspace();
    fireEvent.click(screen.getAllByRole('button', { name: /load preset/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));
    await waitFor(() => expect(screen.getByText('Succeeded')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));
    await waitFor(() => expect(screen.getAllByText(/blue train/i).length).toBeGreaterThan(0));

    const compareChecks = screen.getAllByLabelText(/compare/i);
    fireEvent.click(compareChecks[0]);
    fireEvent.click(compareChecks[1]);

    expect(screen.getByText('Comparison')).toBeInTheDocument();
    expect(screen.getByText(/duration delta/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Copy request' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Copy response' })[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Retry' })[0]);
    expect(screen.getByDisplayValue('/api/catalog')).toBeInTheDocument();
  });

  it('labels utilities by safety and requires confirmation for state-changing actions', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }))
      .mockResolvedValueOnce(jsonResponse({
        utilityId: 'service-health-check',
        status: 'succeeded',
        message: 'Service health check completed.',
        details: { 'catalog-service': 'ready' },
      }));

    await openTestingWorkspace();

    expect(screen.getAllByText('Read-only').length).toBeGreaterThan(0);
    expect(screen.getAllByText('State-changing').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/confirm this state-changing utility/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /run utility/i })[0]);
    await waitFor(() => {
      expect(screen.getByText('Service health check completed.')).toBeInTheDocument();
    });
  });

  it('keeps the testing tab keyboard reachable with non-color status text', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ targets: fixtureTargets }));

    renderWithProviders(<LabsPage />);
    fireEvent.click(screen.getByRole('button', { name: /migration & decomposition/i }));

    const guideTab = screen.getByRole('tab', { name: 'Guide' });
    fireEvent.click(guideTab);
    fireEvent.keyDown(guideTab, { key: 'ArrowRight' });

    expect(screen.getByRole('tabpanel', { name: 'Testing' })).toBeInTheDocument();
    await screen.findByText('Lab testing workspace');
    expect(screen.getByText(/Requests are limited to known local lab services/i))
      .toBeInTheDocument();
  });
});
