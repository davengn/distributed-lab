# Implementation Plan: DistributedLab UI Prototype Alignment Patch

**Branch**: `002-distributed-lab-implementation` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-distributed-lab-implementation/spec.md`

## Summary

Patch the existing DistributedLab control panel so the implemented UI follows `references/ui-prototype.html` screen-by-screen. The work is scoped to the frontend application shell and four primary screens: Dashboard, Labs, Chaos, and Registry. The technical approach is to reuse the existing Next.js App Router, Tailwind token setup, and React components while correcting layout, labels, component density, prototype-only panels, responsive behavior, light/dark theme parity, and UI verification coverage.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 16 App Router, JavaScript for prototype reference only

**Primary Dependencies**: Existing control-panel dependencies: Next.js, React, Tailwind CSS, STOMP/SockJS client for live data; no new runtime dependency required for UI parity

**Storage**: N/A for this feature; UI consumes existing Lab API data and may use local theme preference only

**Testing**: Add/extend Jest + React Testing Library coverage for component/page structure; run `pnpm --filter control-panel build`; use browser visual checks against `references/ui-prototype.html` at 1440px, 1024px, 768px, and 375px

**Target Platform**: Local web control panel served by Docker Compose or the Next.js dev server; latest two versions of Chrome, Firefox, Safari, and Edge

**Project Type**: Web application frontend patch inside the existing monorepo

**Performance Goals**: Preserve control panel responsiveness while rendering prototype-density pages; avoid adding heavy client libraries or blocking visual assets

**Constraints**: Must preserve `docker compose up` workflow, dark/light mode, existing service boundaries, existing Lab API contracts where possible, and prototype semantics for labels/status colors

**Scale/Scope**: Four primary screens, shared shell components, shared visual primitives, and UI states for loading/empty/error data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate

- **I. Code Quality & Service Boundaries**: PASS. The feature stays inside `apps/control-panel` and does not introduce new services, shared schemas, or cross-service ownership changes. API contract changes are avoided unless the prototype requires fields already implied by existing entities.
- **II. Test-First Development**: PASS with mandatory task sequencing. Implementation tasks must add failing UI/component tests or explicit visual-check fixtures before changing components.
- **III. User Experience Consistency**: PASS. The purpose of the feature is to restore consistency with the approved prototype, distributed-systems labels, status-pill conventions, theme behavior, and select -> configure -> run -> observe flows.
- **IV. Performance & Resource Standards**: PASS. The patch does not add containers, storage systems, or heavyweight runtime dependencies. SVG topology and existing Tailwind tokens keep rendering lightweight.
- **V. Observability-First Engineering**: PASS/N/A. No experiment telemetry or service instrumentation changes are introduced. Existing real-time event surfaces remain visible and must keep WebSocket-backed updates where available.

No constitution violations require Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-distributed-lab-implementation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-fidelity-contract.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/control-panel/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── labs/page.tsx
│   │   ├── chaos/page.tsx
│   │   └── registry/page.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── StatusPill.tsx
│   │   ├── EventFeed.tsx
│   │   ├── ExperimentsTable.tsx
│   │   ├── FaultInjectionForm.tsx
│   │   ├── CircuitBreakerCard.tsx
│   │   └── CascadingFailureMap.tsx
│   ├── hooks/
│   │   ├── useEvents.ts
│   │   ├── useServices.ts
│   │   └── useTheme.tsx
│   ├── lib/
│   │   └── api-client.ts
│   └── styles/
│       └── globals.css
├── tailwind.config.ts
└── package.json

references/
└── ui-prototype.html
```

**Structure Decision**: Use the existing web application structure under `apps/control-panel`. Keep shared visual behavior in `components/`, screen composition in `src/app/*/page.tsx`, token definitions in `src/styles/globals.css` and `tailwind.config.ts`, and prototype comparison context in `references/ui-prototype.html`.

## Phase 0: Research

Research complete in [research.md](./research.md). Decisions cover the prototype as source of truth, existing component reuse, visual parity verification, fallback data behavior, accessibility, and dependency policy.

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md): UI-facing entities, validation rules, and state transitions for theme, navigation, selected module, faults, events, service health, and topology.
- [contracts/ui-fidelity-contract.md](./contracts/ui-fidelity-contract.md): Screen-by-screen UI contract derived from `references/ui-prototype.html`.
- [quickstart.md](./quickstart.md): Review and verification workflow for future implementation tasks.

### Post-Design Constitution Check

- **I. Code Quality & Service Boundaries**: PASS. Design confines work to `apps/control-panel` and documents UI contracts without backend boundary expansion.
- **II. Test-First Development**: PASS. Quickstart and future task generation must require UI tests/check fixtures before implementation changes.
- **III. User Experience Consistency**: PASS. The UI contract directly encodes prototype navigation, density, labels, theme, status colors, and responsive behavior.
- **IV. Performance & Resource Standards**: PASS. No new containers or heavy visual dependencies are planned.
- **V. Observability-First Engineering**: PASS/N/A. Existing event and service-health surfaces remain available; no observability stack changes are needed.

## Complexity Tracking

No constitution violations.
