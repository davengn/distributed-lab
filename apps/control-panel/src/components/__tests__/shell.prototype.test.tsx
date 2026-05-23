import { fireEvent, screen } from '@/test/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import { Layout } from '@/components/Layout';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;

describe('prototype shell fidelity', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/');
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders the required prototype navigation and active state', () => {
    renderWithProviders(
      <Layout>
        <div>Dashboard content</div>
      </Layout>
    );

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: /labs/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /chaos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /registry/i })).toBeInTheDocument();
  });

  it('shows the route title, environment badge, version badge, and theme toggle', () => {
    mockedUsePathname.mockReturnValue('/chaos');

    renderWithProviders(
      <Layout>
        <div>Chaos content</div>
      </Layout>
    );

    expect(screen.getByRole('heading', { name: 'Chaos Console' })).toBeInTheDocument();
    expect(screen.getByText(/environment running/i)).toBeInTheDocument();
    expect(screen.getByText('v0.1.0-alpha')).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(toggle);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('distributed-lab-theme')).toBe('dark');
  });
});
