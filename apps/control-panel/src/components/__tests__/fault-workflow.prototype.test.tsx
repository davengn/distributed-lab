import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/test-utils';
import { ActiveFaultsTable } from '@/components/ActiveFaultsTable';
import { FaultInjectionForm } from '@/components/FaultInjectionForm';
import { prototypeActiveFaults } from '@/lib/prototype-data';
import { apiClient } from '@/lib/api-client';

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const mockedPost = apiClient.post as jest.Mock;

describe('fault workflow components', () => {
  beforeEach(() => {
    mockedPost.mockResolvedValue({});
  });

  it('submits prototype fault config with loading and success callback', async () => {
    const onInjected = jest.fn();
    renderWithProviders(<FaultInjectionForm onInjected={onInjected} />);

    expect(screen.getByLabelText('Fault type')).toBeInTheDocument();
    expect(screen.getByLabelText('Target service')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration (seconds)')).toBeInTheDocument();
    expect(screen.getByLabelText('Magnitude')).toHaveValue('200ms');

    fireEvent.click(screen.getByRole('button', { name: 'Inject Fault' }));

    await waitFor(() => expect(onInjected).toHaveBeenCalledWith(expect.objectContaining({
      target: 'monolith',
      magnitude: '+200ms',
    })));
  });

  it('renders active faults and calls stop action', () => {
    const onStop = jest.fn();
    renderWithProviders(<ActiveFaultsTable faults={prototypeActiveFaults} onStop={onStop} />);

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Target' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Magnitude' })).toBeInTheDocument();
    expect(screen.getByText('FLT-002')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Stop' })[0]);
    expect(onStop).toHaveBeenCalledWith('FLT-001');
  });
});
