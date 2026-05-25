# MusicCorp UI

MusicCorp UI is a standalone Next.js storefront under `apps/musiccorp-ui`. It uses local
shadcn-style source components in `src/components/ui` and never imports the 004 request composer or
request preset list.

## Backend Adapter

The server-side adapter lives in `src/lib/musiccorp-api.ts` and normalizes:

- `GET /api/catalog`
- `GET /api/catalog/{id}`
- `POST /api/orders`
- `POST /api/payments`

Set `MUSICCORP_BACKEND_BASE_URL` when pointing the storefront at a different lab route. The adapter
adds `X-Correlation-ID` to order and payment calls and returns customer-readable failure categories
for unavailable, validation, timeout, and unexpected responses.

## Component Notes

Shared primitives are source-owned in `src/components/ui` so the storefront can evolve without a
hosted design-system dependency. The customer screens use Button, Card, Sheet, Input, Label, Select,
Alert, Badge, Skeleton, Sonner, and Tooltip primitives with visible focus states and 44px touch
targets.
