# Control Panel ↔ Lab API Contract

## Design System

The control panel MUST follow the UI Design System defined in [ui-design-system.md](ui-design-system.md), sourced from `references/brand-spec.md`. Key requirements:

- CSS custom properties for all color tokens (light + dark themes)
- System-ui font stack (no custom web fonts)
- Hairline borders, no drop shadows (except toasts)
- 6px border-radius on all components; 9999px on status pills
- One accent color (Primer blue), status-driven semantics (green/amber/red/purple)
- Responsive breakpoints: 1100px, 860px, 600px
- Sidebar 240px (collapses to 56px icon-only below 860px)

## Communication Patterns

### Initial Page Load (REST)

The control panel fetches initial state via REST on page load:

1. `GET /api/v1/services` → Service list with health/metrics for Dashboard
2. `GET /api/v1/experiments` → Active experiments for Dashboard and Labs
3. `GET /api/v1/modules` → Lab module definitions for Labs page
4. `GET /api/v1/faults` → Active faults for Chaos page
5. `GET /api/v1/circuit-breakers` → Circuit breaker states for Chaos page

### Real-Time Updates (WebSocket/STOMP)

After initial load, the control panel subscribes to WebSocket topics for live updates:

| Page | Subscriptions |
|------|--------------|
| Dashboard | `/topic/services`, `/topic/experiments`, `/topic/events` |
| Labs | `/topic/experiments` |
| Chaos | `/topic/faults`, `/topic/circuit-breakers`, `/topic/services` |
| Registry | `/topic/services` |

### User Actions (REST or STOMP)

| Action | Method | Endpoint/STOMP Destination |
|--------|--------|---------------------------|
| Start experiment | POST | `/api/v1/experiments` |
| Stop experiment | DELETE | `/api/v1/experiments/{id}` |
| Inject fault | POST | `/api/v1/faults` |
| Stop fault | DELETE | `/api/v1/faults/{id}` |
| Toggle feature flag | PUT | `/api/v1/toggles/{key}` |
| Start saga | POST | `/api/v1/sagas/start` |

## Error Handling

All REST errors return:
```json
{
  "error": "Error category",
  "details": "Human-readable description",
  "timestamp": "2026-05-23T14:18:00Z"
}
```

HTTP status codes:
- `400`: Invalid request parameters
- `404`: Resource not found
- `409`: Conflicting state (e.g., fault already active on target)
- `500`: Internal Lab API error
- `503`: Docker socket or Toxiproxy unavailable

## CORS

The Lab API MUST allow requests from `http://localhost:3000` (Next.js dev server) in development mode.
