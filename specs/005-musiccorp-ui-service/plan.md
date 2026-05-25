# Implementation Plan: MusicCorp UI Service

**Branch**: `005-musiccorp-ui-service` | **Date**: 2026-05-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-musiccorp-ui-service/spec.md`

## Summary

Create a separate MusicCorp storefront service that learners can use like a simple customer website while doing labs. The technical approach is to add a new `apps/musiccorp-ui` Next.js application with a server-side MusicCorp backend adapter, Docker Compose service wiring, focused storefront tests, and contracts for catalog, cart, checkout, backend failure handling, and lab-observable customer actions. The existing 004 lab testing utilities stay in `apps/control-panel` and `apps/lab-api` unchanged.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 16 App Router for the new MusicCorp UI; existing Java 21/Spring Boot MusicCorp backend is consumed without changing backend behavior

**Primary Dependencies**: Next.js, React, Tailwind CSS, shadcn/ui component source, Radix UI primitives via shadcn/ui, lucide-react icons, Jest, React Testing Library, existing MusicCorp monolith/catalog/order/payment endpoints, Docker Compose

**Storage**: No new persistent storage. Cart and checkout draft are browser-local. Catalog, order, and payment data remain owned by the existing MusicCorp backend.

**Testing**: Jest + React Testing Library for storefront behavior, backend adapter tests with mocked fetch responses, existing control-panel and lab-api tests to verify 004 remains unaffected, Docker Compose health checks for service startup

**Target Platform**: Local DistributedLab Docker Compose stack and local developer servers

**Project Type**: Web application service added under `apps/` with no new backend service or database schema

**Performance Goals**: Catalog page renders usable loading feedback immediately; catalog data appears within 2 seconds after the backend is healthy under normal local conditions; cart interactions respond within 100 ms in the browser; checkout disables duplicate submissions; the new container stays within a 512 MB memory limit.

**Constraints**: Keep 004 implementation intact; do not move the request composer into the storefront; do not expose a general-purpose API client; use the existing MusicCorp backend; support `docker compose up`; preserve control-panel lab ownership; provide accessible keyboard and focus behavior; avoid external SaaS dependencies.

**Scale/Scope**: One separate MusicCorp UI service, catalog storefront, item detail affordance, cart, checkout, confirmation, backend status/error states, optional learner activity summary, Docker Compose wiring, and focused tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate

- **I. Code Quality & Service Boundaries**: PASS. The feature adds a new UI app under `apps/` and consumes existing MusicCorp services through a constrained adapter. It does not change service-owned data models or the 004 Lab API request-runner boundary.
- **II. Test-First Development**: PASS with mandatory task sequencing. Implementation tasks must add failing storefront, adapter, and regression tests before UI or Compose changes.
- **III. User Experience Consistency**: PASS. The MusicCorp site is intentionally customer-facing while the control panel remains the lab control surface. Error states, startup path, and responsive behavior are explicit requirements.
- **IV. Performance & Resource Standards**: PASS. No new database or observability container is introduced. The new UI service gets a bounded memory target and uses browser-local cart state.
- **V. Observability-First Engineering**: PASS. Storefront actions produce catalog, order, and payment backend traffic and include learner-visible action timing/status. Existing observability remains the paved road for lab inspection.

No constitution violations require Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/005-musiccorp-ui-service/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── backend-adapter-contract.md
│   └── musiccorp-ui-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
apps/musiccorp-ui/
├── Dockerfile
├── package.json
├── next.config.js
├── components.json
├── tailwind.config.ts
├── jest.config.js
├── jest.setup.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── confirmation/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── tooltip.tsx
│   │   ├── BackendStatusBanner.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CatalogFilters.tsx
│   │   ├── CatalogGrid.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── ProductCard.tsx
│   │   └── StorefrontActivityPanel.tsx
│   ├── lib/
│   │   ├── cart-store.ts
│   │   ├── money.ts
│   │   ├── musiccorp-api.ts
│   │   ├── storefront-events.ts
│   │   └── types.ts
│   └── test/
│       ├── fixtures.ts
│       └── test-utils.tsx
└── public/
    └── covers/

docker-compose.yml
docker-compose.dev.yml
docker-compose.test.yml
package.json
pnpm-workspace.yaml
```

**Structure Decision**: Add a new app workspace instead of extending `apps/control-panel`. The MusicCorp UI owns customer-facing screens and a server-side adapter, while existing backend services own domain data and 004 continues to own lab testing utilities.

## Phase 0: Research

Research complete in [research.md](./research.md). Decisions cover service separation, backend adapter boundaries, initial backend entrypoint, UI style, cart persistence, checkout failure handling, observability signals, Compose integration, and regression protection for 004.

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md): Storefront entities, validation rules, and state transitions for catalog browsing, cart, checkout, backend status, and lab-visible events.
- [contracts/backend-adapter-contract.md](./contracts/backend-adapter-contract.md): Internal adapter and existing backend endpoint contract.
- [contracts/musiccorp-ui-contract.md](./contracts/musiccorp-ui-contract.md): UI behavior contract for catalog, cart, checkout, confirmation, responsive states, and separation from 004.
- [quickstart.md](./quickstart.md): Planned verification workflow for implementation tasks.

### Post-Design Constitution Check

- **I. Code Quality & Service Boundaries**: PASS. The plan keeps customer UI code in `apps/musiccorp-ui`, backend access behind a typed adapter, and 004 code paths separate.
- **II. Test-First Development**: PASS. Quickstart and contracts require failing UI and adapter tests before implementation plus targeted 004 regression checks.
- **III. User Experience Consistency**: PASS. The website has customer-facing navigation, clear loading/error states, accessible controls, and keeps the control panel as the lab surface.
- **IV. Performance & Resource Standards**: PASS. No persistent storage is added, cart state is local, Compose memory remains bounded, and duplicate checkout submissions are prevented.
- **V. Observability-First Engineering**: PASS. Storefront actions are explicitly represented as observable events and backend traffic stays visible through the existing observability stack.

## Complexity Tracking

No constitution violations.
