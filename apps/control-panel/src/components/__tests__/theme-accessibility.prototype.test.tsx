import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';
import { LabModuleDetail } from '@/components/LabModuleDetail';
import { Layout } from '@/components/Layout';
import { StatusPill } from '@/components/StatusPill';
import { FaultInjectionForm } from '@/components/FaultInjectionForm';
import { labModules } from '@/lib/lab-modules';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const mockedUsePathname = usePathname as jest.Mock;

describe('theme and accessibility fidelity', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/labs');
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('persists the shell theme and exposes current page state', async () => {
    localStorage.setItem('distributed-lab-theme', 'dark');

    renderWithProviders(
      <Layout>
        <div>Lab content</div>
      </Layout>
    );

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
    expect(screen.getByRole('link', { name: 'Labs' })).toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
    expect(localStorage.getItem('distributed-lab-theme')).toBe('light');
  });

  it('keeps semantic status color classes available', () => {
    renderWithProviders(
      <div>
        <StatusPill status="running" />
        <StatusPill status="degraded" />
        <StatusPill status="failed" />
        <StatusPill status="completed" label="Done" />
      </div>
    );

    expect(screen.getByText('running')).toHaveClass('text-success-fg');
    expect(screen.getByText('degraded')).toHaveClass('text-attention-fg');
    expect(screen.getByText('failed')).toHaveClass('text-danger-fg');
    expect(screen.getByText('Done')).toHaveClass('text-done-fg');
  });

  it('supports keyboard navigation through module detail tabs', () => {
    renderWithProviders(<LabModuleDetail module={labModules[0]} />);

    const overview = screen.getByRole('tab', { name: 'Overview' });
    fireEvent.keyDown(overview, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: 'Experiments' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel', { name: 'Experiments' })).toBeInTheDocument();
  });

  it('associates fault form labels and validation errors with controls', () => {
    renderWithProviders(<FaultInjectionForm />);

    const magnitude = screen.getByLabelText('Magnitude');
    fireEvent.change(magnitude, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Inject Fault' }));

    expect(screen.getByText('Magnitude is required')).toBeInTheDocument();
    expect(magnitude).toHaveAttribute('aria-describedby', 'fault-error');
  });
});
