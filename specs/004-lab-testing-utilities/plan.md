# Implementation Plan: Lab Testing Utilities

**Branch**: `004-lab-testing-utilities` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-lab-testing-utilities/spec.md`

## Summary

Add a lab testing workspace to the Labs UI so learners can select a lab service, compose and send requests, inspect responses, reuse request presets, compare recent results, and run supporting lab utilities. The technical approach is to add a constrained request-runner contract to the Lab API, expose typed client methods in the control panel, and render a module-aware testing workspace inside the existing Labs detail flow while preserving the established select -> configure -> run -> observe interaction pattern.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 16 App Router for the control panel; Java 21 and Spring Boot 3.4.5 for the Lab API

**Primary Dependencies**: Existing control-panel dependencies only for the UI; existing Lab API Spring Web, RestTemplate, Docker Java service discovery, WebSocket infrastructure, and structured logging

**Storage**: No persistent database changes. Request history is browser-session scoped. Lab API request execution is stateless except for logs and existing observability signals.

**Testing**: Jest + React Testing Library for UI behavior; JUnit/WebMvc/Mockito-style tests through Spring Boot starter test for Lab API request validation and dispatch; existing build checks. No e2e tests are planned for this feature.

**Target Platform**: Local DistributedLab control panel and Lab API served by Docker Compose or local development servers

**Project Type**: Web application feature spanning `apps/control-panel` and `apps/lab-api`

**Performance Goals**: Request submission should show pending feedback immediately; request-runner calls should complete or time out within the configured request limit; the UI should remain responsive with at least 20 recent request history entries.

**Constraints**: Preserve `docker compose up` as the learner setup path; restrict requests to known local lab services; do not expose a general external HTTP client; keep dark/light mode and Labs page keyboard access; maintain actionable error states; avoid new runtime services or heavyweight UI dependencies.

**Scale/Scope**: One testing workspace in Labs detail, module-aware presets for the five existing lab modules, request history and comparison for the current browser session, Lab API target validation and request execution, and supporting utilities for health checks, sample data, cleanup reminders, and safe reset actions where applicable.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate

- **I. Code Quality & Service Boundaries**: PASS. The browser does not call arbitrary services directly. The control panel keeps UI composition, and Lab API owns service discovery, request validation, dispatch, and safety controls.
- **II. Test-First Development**: PASS with mandatory task sequencing. Tasks must add failing UI tests and Lab API contract/controller tests before implementation changes.
- **III. User Experience Consistency**: PASS. The workspace follows select -> configure -> run -> observe and stays in the Labs detail context with existing visual patterns.
- **IV. Performance & Resource Standards**: PASS. The design adds no containers or persistent services and uses bounded request timeouts/history.
- **V. Observability-First Engineering**: PASS. Request attempts and failures must emit structured Lab API logs and expose learner-visible timing/status signals.

No constitution violations require Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/004-lab-testing-utilities/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── service-request-api.md
│   └── ui-lab-testing-workspace.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
apps/control-panel/
├── src/
│   ├── app/
│   │   └── labs/
│   │       ├── page.tsx
│   │       └── __tests__/
│   │           └── labs.prototype.test.tsx
│   ├── components/
│   │   ├── LabModuleDetail.tsx
│   │   ├── LabTestingWorkspace.tsx
│   │   ├── RequestComposer.tsx
│   │   ├── RequestPresetList.tsx
│   │   ├── RequestResultPanel.tsx
│   │   ├── RequestHistoryPanel.tsx
│   │   └── TestingUtilitiesPanel.tsx
│   └── lib/
│       ├── api-client.ts
│       ├── lab-modules.ts
│       └── lab-testing-presets.ts
│
apps/lab-api/
├── src/main/java/com/distributedlab/labapi/
│   ├── controller/
│   │   └── ServiceRequestController.java
│   ├── model/
│   │   ├── ServiceRequest.java
│   │   ├── ServiceRequestResult.java
│   │   ├── ServiceRequestTarget.java
│   │   └── TestingUtilityRun.java
│   └── service/
│       ├── ServiceRequestRunner.java
│       └── ServiceTargetRegistry.java
└── src/test/java/com/distributedlab/labapi/
    ├── controller/
    │   └── ServiceRequestControllerTest.java
    └── service/
        └── ServiceRequestRunnerTest.java
```

**Structure Decision**: Keep learner-facing controls in `apps/control-panel`, centralize request execution and target safety in `apps/lab-api`, and store curated request presets as typed frontend metadata that can be matched to the existing lab module definitions.

## Phase 0: Research

Research complete in [research.md](./research.md). Decisions cover the Lab API request-runner boundary, target allow-listing, session-scoped history, preset storage, response rendering limits, utility safety labeling, and test strategy.

## Phase 1: Design & Contracts

Design artifacts:

- [data-model.md](./data-model.md): Data entities, validation rules, and state transitions for targets, requests, results, history, presets, utilities, and comparisons.
- [contracts/service-request-api.md](./contracts/service-request-api.md): Lab API request runner and utility execution contract.
- [contracts/ui-lab-testing-workspace.md](./contracts/ui-lab-testing-workspace.md): UI behavior contract for the Labs testing workspace.
- [quickstart.md](./quickstart.md): Planned verification workflow for implementation tasks.

### Post-Design Constitution Check

- **I. Code Quality & Service Boundaries**: PASS. Contracts keep request execution in Lab API and UI state in the control panel.
- **II. Test-First Development**: PASS. Quickstart requires failing focused UI and API tests before implementation.
- **III. User Experience Consistency**: PASS. UI contract preserves existing Labs tabs, panels, status conventions, dark/light mode, and keyboard behavior.
- **IV. Performance & Resource Standards**: PASS. The design has bounded request timeout, bounded history, response preview limits, and no additional runtime service.
- **V. Observability-First Engineering**: PASS. Contract requires structured request outcome logging, timing capture, and learner-visible status feedback.

## Complexity Tracking

No constitution violations.
