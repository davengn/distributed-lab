import { Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { StorefrontEvent } from '@/lib/types';

interface StorefrontActivityPanelProps {
  events: StorefrontEvent[];
  onClear?: () => void;
}

function statusVariant(status: StorefrontEvent['status']) {
  if (status === 'succeeded') {
    return 'success';
  }
  if (status === 'pending') {
    return 'secondary';
  }
  if (status === 'timed_out') {
    return 'warning';
  }
  return 'destructive';
}

export function StorefrontActivityPanel({ events, onClear }: StorefrontActivityPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Recent customer actions
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Correlate these with backend timing.</p>
        </div>
        {events.length > 0 && onClear ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No storefront actions yet.</p>
        ) : (
          <ol className="space-y-3">
            {events.map((event) => (
              <li key={event.clientActionId} className="rounded-md border border-border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{event.label}</span>
                  <Badge variant={statusVariant(event.status)}>{event.status.replace('_', ' ')}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.businessSummary}</p>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="mt-2 w-fit text-xs font-medium text-muted-foreground">
                        {event.durationMs} ms at {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md border bg-card px-3 py-2 text-sm shadow-storefront">
                      {event.clientActionId}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
