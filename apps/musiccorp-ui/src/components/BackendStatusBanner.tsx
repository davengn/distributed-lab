import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { BackendResult, BackendStatusMessage } from '@/lib/types';

function categoryTitle(category: string): string {
  if (category === 'timeout') {
    return 'The service is slow right now';
  }
  if (category === 'validation') {
    return 'Check the details and try again';
  }
  if (category === 'unavailable') {
    return 'MusicCorp is not reachable';
  }
  return 'MusicCorp returned an unexpected response';
}

export function backendResultToStatusMessage(
  result: BackendResult<unknown>
): BackendStatusMessage | null {
  if (result.ok) {
    return null;
  }

  return {
    scope: result.scope,
    severity: result.category === 'validation' ? 'warning' : 'error',
    title: categoryTitle(result.category),
    message: result.message,
    retryAvailable: true,
    technicalHint: `Action ${result.actionId} finished in ${result.durationMs} ms.`,
  };
}

interface BackendStatusBannerProps {
  message?: BackendStatusMessage | null;
  result?: BackendResult<unknown> | null;
  onRetry?: () => void;
}

export function BackendStatusBanner({ message, result, onRetry }: BackendStatusBannerProps) {
  const status = message ?? (result ? backendResultToStatusMessage(result) : null);

  if (!status) {
    return null;
  }

  const variant =
    status.severity === 'success'
      ? 'success'
      : status.severity === 'warning'
        ? 'warning'
        : status.severity === 'error'
          ? 'destructive'
          : 'default';

  return (
    <Alert variant={variant}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <AlertTitle>{status.title}</AlertTitle>
          <AlertDescription>
            <p>{status.message}</p>
            {status.technicalHint ? (
              <p className="mt-1 text-xs opacity-80">{status.technicalHint}</p>
            ) : null}
          </AlertDescription>
        </div>
        {status.retryAvailable && onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}
