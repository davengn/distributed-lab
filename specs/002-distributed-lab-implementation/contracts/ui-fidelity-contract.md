# UI Fidelity Contract: DistributedLab Prototype Alignment

**Source of Truth**: `references/ui-prototype.html`

This contract defines the visible UI expectations for the corrective implementation. It is intentionally screen-oriented so future tasks can be tested against the approved prototype.

## Global Shell

### Required Navigation

| Item | Route | Icon Style | Active Behavior |
|---|---|---|---|
| Dashboard | `/` | Simple line icon | Neutral muted active background, stronger label weight |
| Labs | `/labs` | Simple line icon | Same active convention |
| Chaos | `/chaos` | Simple line icon | Same active convention |
| Registry | `/registry` | Simple line icon | Same active convention |

### Required Shell Behavior

- Sidebar width is 240px on wide screens.
- Sidebar collapses to 56px icon-only below the prototype breakpoint.
- Topbar height is 48px.
- Topbar shows the current screen title and an environment status badge.
- Theme toggle remains available from the shell.
- Version badge remains visible in the sidebar footer when the full sidebar is shown.

### Visual Rules

- Use the existing Primer-like tokens from the prototype for light and dark mode.
- Use 6px radii for panels, cards, buttons, inputs, and tabs.
- Use hairline borders and compact spacing.
- Do not add marketing hero sections, gradients, decorative background effects, or oversized typography.
- Status semantics:
  - Green: running, healthy, closed, success
  - Amber: degraded, warning
  - Red: failed, open, destructive
  - Purple: completed or done

## Dashboard Contract

### Required Layout

1. Metric row with four cards:
   - Services
   - Active Experiments
   - System Health
   - Uptime
2. Two-column row:
   - Service Health panel
   - Active Experiments panel
3. Full-width Recent Events panel below.

### Service Health Panel

Each service card must show:

- Service name in compact label styling
- Status pill
- Description/version/port metadata
- CPU progress row
- Memory progress row

### Active Experiments Panel

Table columns:

- ID
- Experiment
- Module
- Status

Rows must support truncation for long experiment descriptions.

### Recent Events Panel

Each event item must show:

- Timestamp
- Severity indicator
- Event text with code-style treatment for technical route/service identifiers where appropriate

## Labs Contract

### Required Modules

| Module | Name | Required Tags |
|---|---|---|
| 01 | Migration & Decomposition | Strangler Fig, Parallel Run, Feature Toggles |
| 02 | Distributed Data & Consistency | CAP, Replication, Event Sourcing |
| 03 | Resiliency & Chaos | Chaos, Circuit Breaker, Bulkhead |
| 04 | Workflow & Communication | Saga, Idempotency, Messaging |
| 05 | Observability Suite | Metrics, Tracing, Registry |

### Card Behavior

- Cards use the prototype module color identities.
- Hover state changes border color to accent.
- Selected state uses accent border and subtle accent ring.
- Selecting a card opens the detail panel below the grid.

### Detail Panel

Required tabs:

- Overview
- Experiments
- Guide

Tab active state must use accent text and underline. The panel must remain compact and bordered like other prototype panels.

## Chaos Contract

### Required Layout

1. Two-column row:
   - Fault Injection panel
   - Active Faults panel
2. Two-column row:
   - Circuit Breakers panel
   - Cascading Failure Map panel

### Fault Injection Form

Required controls:

- Fault type
- Target service
- Duration in seconds
- Magnitude
- Inject Fault button

Controls must use prototype label, input, select, focus, and button styling.

### Active Faults Table

Table columns:

- ID
- Type
- Target
- Magnitude
- Action

The stop action uses the prototype danger outline behavior.

### Circuit Breakers

Each card must show:

- Status pill
- Service name
- Failure count
- Success rate
- Threshold

Open states use danger semantics; closed states use success semantics.

### Cascading Failure Map

- Nodes use compact SVG boxes with service labels and ports.
- Healthy links are solid neutral lines.
- Degraded links are dashed amber lines.
- Failed links are dashed red lines.

## Registry Contract

### Required Layout

1. Service Topology panel
2. Service Catalog panel

### Service Topology

Required layers:

- CONTROL
- GATEWAY
- APPLICATION
- SERVICES
- DATA

The topology must show lab-api, api-gateway, monolith, catalog-service, order-service, payment-service, PostgreSQL, MongoDB, Kafka, and Redis when data is available or fallback review data is active.

### Service Catalog

Table columns:

- Service
- Status
- Version
- Image
- Dependencies
- Port

The table may scroll inside its panel on narrow widths.

## Responsive Contract

| Width | Expected Behavior |
|---|---|
| 1440px | Full sidebar, four metric cards, two-column dashboard/chaos rows |
| 1024px | Full or near-full desktop layout, panels remain two-column where space allows |
| 768px | Icon-only sidebar, two-column metric cards, content stacks where needed |
| 375px | Icon-only sidebar, single-column metrics/cards/panels, no page-level horizontal overflow |

## Empty, Loading, and Error States

- Preserve panel headers and layout even when data is missing.
- Show compact empty/loading/error text inside the panel body.
- Do not replace full screens with large blank states.
- Do not hide primary navigation due to a panel-level error.

## Verification Requirements

Each implementation task that changes UI composition must verify:

- Matching screen inventory and order against `references/ui-prototype.html`
- Light and dark mode behavior
- Keyboard focus visibility
- No clipped or overlapping text at 1440px, 1024px, 768px, and 375px
- No page-level horizontal overflow except controlled table scrolling inside panels
