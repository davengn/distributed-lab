import type { TestingUtility } from './lab-testing-types';

export const testingUtilities: TestingUtility[] = [
  {
    id: 'service-health-check',
    label: 'Service health check',
    description: 'Check readiness for local lab services before running requests.',
    safety: 'read_only',
    kind: 'health_check',
    requiresConfirmation: false,
  },
  {
    id: 'sample-data-helper',
    label: 'Sample data helper',
    description: 'Show a representative request shape for the selected lab.',
    safety: 'read_only',
    kind: 'sample_data',
    requiresConfirmation: false,
  },
  {
    id: 'cleanup-reminder',
    label: 'Cleanup reminder',
    description: 'Review reset steps before leaving the current lab module.',
    safety: 'read_only',
    kind: 'cleanup_reminder',
    requiresConfirmation: false,
  },
  {
    id: 'safe-reset',
    label: 'Safe reset action',
    description: 'Confirm a state-changing reset support action for the current lab.',
    safety: 'state_changing',
    kind: 'safe_reset',
    requiresConfirmation: true,
  },
];
