# Tasks: DistributedLab UI Prototype Alignment Patch

**Input**: Design documents from `/specs/002-distributed-lab-implementation/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-fidelity-contract.md](./contracts/ui-fidelity-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Tests are required because the project constitution mandates TDD and the feature spec defines independent test criteria for each story. Write or update tests first, confirm they fail for the missing prototype behavior, then implement.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks
- **[Story]**: User story label for traceability
- All task descriptions include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare test and review scaffolding for the UI fidelity patch.

- [X] T001 Create the visual review checklist shell in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T002 [P] Configure Jest for Next.js + React Testing Library in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/jest.config.ts`
- [X] T003 [P] Add shared Jest DOM setup in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/jest.setup.ts`
- [X] T004 [P] Add React Testing Library render helpers in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/test/test-utils.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared prototype data, UI primitives, shell behavior, and token rules that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Add failing shell fidelity tests for sidebar navigation, topbar title, environment badge, and theme toggle in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/__tests__/shell.prototype.test.tsx`
- [X] T006 [P] Add prototype fallback fixtures for services, experiments, events, modules, faults, circuit breakers, and topology nodes in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/lib/prototype-data.ts`
- [X] T007 [P] Add shared panel, table, and tab primitives matching the prototype density in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Panel.tsx`
- [X] T008 [P] Add shared topology SVG primitives for service and failure maps in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/TopologyMap.tsx`
- [X] T009 Update focus states, button/input defaults, reduced-motion handling, and responsive overflow rules in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/styles/globals.css`
- [X] T010 Update the application shell layout, sidebar active state, sidebar footer, topbar title, environment badge, and theme toggle in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Layout.tsx`, `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Sidebar.tsx`, and `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Topbar.tsx`
- [X] T011 Run the shell fidelity tests and record the expected red/green result in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`

**Checkpoint**: Shared shell, fixtures, primitives, and test setup are ready; user stories can now proceed.

---

## Phase 3: User Story 1 - Match the Main Dashboard Experience (Priority: P1) MVP

**Goal**: Dashboard matches `references/ui-prototype.html` with fixed shell, metric cards, service health grid, active experiments table, and recent events feed.

**Independent Test**: Open the dashboard and compare it against the prototype at desktop and mobile widths. Verify the metric row, Service Health panel, Active Experiments table, Recent Events panel, status colors, and responsive stacking.

### Tests for User Story 1

- [X] T012 [P] [US1] Add failing dashboard page structure tests for metrics, panels, table headings, event feed, and responsive classes in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/__tests__/dashboard.prototype.test.tsx`
- [X] T013 [P] [US1] Add failing dashboard component tests for metric cards, service cards, progress bars, status pills, experiment rows, and event items in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/__tests__/dashboard-components.prototype.test.tsx`

### Implementation for User Story 1

- [X] T014 [P] [US1] Update dashboard metric card sparkline, value, subtext, and compact card styling in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/MetricCard.tsx`
- [X] T015 [P] [US1] Update service health card metadata, status placement, CPU/MEM rows, progress thresholds, and truncation in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ServiceCard.tsx` and `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ProgressBar.tsx`
- [X] T016 [P] [US1] Update experiment table columns, monospace IDs, status pills, and truncation behavior in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ExperimentsTable.tsx`
- [X] T017 [P] [US1] Update recent events timestamp, severity indicator, compact row styling, and empty-state layout in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/EventFeed.tsx`
- [X] T018 [US1] Compose the dashboard page in prototype order with fallback data that yields to real Lab API/WebSocket data in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/page.tsx`
- [X] T019 [US1] Verify dashboard light/dark and 1440px, 1024px, 768px, 375px layout results and record them in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T020 [US1] Run dashboard tests and fix any regressions in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/__tests__/dashboard.prototype.test.tsx` and `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/__tests__/dashboard-components.prototype.test.tsx`

**Checkpoint**: User Story 1 is independently functional and demonstrates the MVP dashboard parity.

---

## Phase 4: User Story 2 - Match the Lab Modules Flow (Priority: P1)

**Goal**: Labs screen shows the five prototype modules, selected card state, module detail panel, and Overview/Experiments/Guide tabs.

**Independent Test**: Open Labs, select each module, and verify card labels, tags, selected styling, detail panel behavior, and tab states match the prototype.

### Tests for User Story 2

- [X] T021 [P] [US2] Add failing Labs page tests for all five module cards, required tags, selected state, detail panel, and tab switching in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx`

### Implementation for User Story 2

- [X] T022 [P] [US2] Add lab module display data and feature lists from the prototype in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/lib/lab-modules.ts`
- [X] T023 [P] [US2] Add the accessible module detail tabs component with Overview, Experiments, and Guide states in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/LabModuleDetail.tsx`
- [X] T024 [P] [US2] Add the selectable module card component with prototype color identities and selected-state styling in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/LabModuleCard.tsx`
- [X] T025 [US2] Recompose the Labs page with module cards, selected module state, and detail panel in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/labs/page.tsx`
- [X] T026 [US2] Verify Labs light/dark and 1440px, 1024px, 768px, 375px layout results and record them in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T027 [US2] Run Labs tests and fix any regressions in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx`

**Checkpoint**: User Story 2 is independently functional and the Labs entry flow matches the prototype.

---

## Phase 5: User Story 3 - Match the Chaos Console Workflow (Priority: P2)

**Goal**: Chaos screen matches the prototype fault injection workflow with active faults, circuit breakers, cascading failure map, and toast feedback.

**Independent Test**: Open Chaos, inject a sample fault, stop a fault, and verify form layout, active faults table, circuit breaker cards, failure map, and toast behavior match the prototype.

### Tests for User Story 3

- [X] T028 [P] [US3] Add failing Chaos page tests for two-row panel layout, fault form controls, active faults table, circuit breaker cards, failure map, and toast trigger in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/chaos/__tests__/chaos.prototype.test.tsx`
- [X] T029 [P] [US3] Add failing fault workflow component tests for submit, stop, loading, and error states in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/__tests__/fault-workflow.prototype.test.tsx`

### Implementation for User Story 3

- [X] T030 [P] [US3] Update fault injection labels, target options, validation, disabled state, and prototype form layout in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/FaultInjectionForm.tsx`
- [X] T031 [P] [US3] Add the active faults table with ID, type, target, magnitude, and Stop action in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ActiveFaultsTable.tsx`
- [X] T032 [P] [US3] Update circuit breaker cards to the prototype pill-plus-stats layout in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/CircuitBreakerCard.tsx`
- [X] T033 [P] [US3] Update cascading failure map nodes, dashed degraded/failed links, and responsive SVG sizing in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/CascadingFailureMap.tsx`
- [X] T034 [P] [US3] Update toast positioning, auto-dismiss, and compact feedback styling in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Toast.tsx`
- [X] T035 [US3] Compose the Chaos page with the prototype two-column panel rows and fallback data that yields to real fault/circuit-breaker data in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/chaos/page.tsx`
- [X] T036 [US3] Verify Chaos light/dark and 1440px, 1024px, 768px, 375px layout results and record them in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`

**Checkpoint**: User Story 3 is independently functional and the Chaos workflow can be demonstrated.

---

## Phase 6: User Story 4 - Match the Service Registry View (Priority: P2)

**Goal**: Registry screen shows the prototype topology panel followed by the service catalog table with required columns and responsive scrolling.

**Independent Test**: Open Registry and verify topology layers, node labels, link states, table columns, status pills, and narrow-width table behavior match the prototype.

### Tests for User Story 4

- [X] T037 [P] [US4] Add failing Registry page tests for topology panel, layer labels, required nodes, service catalog columns, and table overflow behavior in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/registry/__tests__/registry.prototype.test.tsx`

### Implementation for User Story 4

- [X] T038 [P] [US4] Add the service topology component with Control, Gateway, Application, Services, and Data layers in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ServiceTopology.tsx`
- [X] T039 [P] [US4] Add the service catalog table component with Service, Status, Version, Image, Dependencies, and Port columns in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ServiceCatalogTable.tsx`
- [X] T040 [P] [US4] Add registry display mapping from service data plus prototype fallback rows in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/lib/registry-display.ts`
- [X] T041 [US4] Recompose the Registry page with topology above catalog table and controlled horizontal panel scrolling in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/registry/page.tsx`
- [X] T042 [US4] Verify Registry light/dark and 1440px, 1024px, 768px, 375px layout results and record them in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T043 [US4] Run Registry tests and fix any regressions in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/app/registry/__tests__/registry.prototype.test.tsx`

**Checkpoint**: User Story 4 is independently functional and the Registry matches the prototype.

---

## Phase 7: User Story 5 - Preserve Theme and Accessibility Fidelity (Priority: P2)

**Goal**: Light/dark mode, keyboard navigation, visible focus, readable contrast, and touch targets remain correct across all four primary screens.

**Independent Test**: Toggle theme, navigate all four screens by keyboard, and check desktop/mobile widths for contrast, focus visibility, and non-overlapping content.

### Tests for User Story 5

- [X] T044 [P] [US5] Add failing theme and accessibility tests for theme persistence, semantic status colors, focusable controls, and tab roles in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/__tests__/theme-accessibility.prototype.test.tsx`

### Implementation for User Story 5

- [X] T045 [P] [US5] Update theme persistence, default mode, and `data-theme` synchronization in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/hooks/useTheme.tsx`
- [X] T046 [P] [US5] Add aria labels, current-page state, focus-visible classes, and touch target sizing for shell controls in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Sidebar.tsx` and `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/Topbar.tsx`
- [X] T047 [P] [US5] Add accessible tab roles, keyboard handling, and focus styles to module detail tabs in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/LabModuleDetail.tsx`
- [X] T048 [P] [US5] Add form labels, error associations, and disabled/submit accessibility states in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/FaultInjectionForm.tsx`
- [X] T049 [US5] Verify keyboard navigation and touch target behavior across Dashboard, Labs, Chaos, and Registry and record results in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T050 [US5] Run theme/accessibility tests and fix any regressions in `/Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/__tests__/theme-accessibility.prototype.test.tsx`

**Checkpoint**: User Story 5 is independently verifiable across every primary screen and theme.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final checks and cleanup across all delivered stories.

- [X] T051 [P] Update UI implementation notes and any task-specific review findings in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T052 [P] Ensure all prototype references and scope guardrails remain current in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/quickstart.md`
- [X] T053 Run `pnpm --filter control-panel test` and record the result in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T054 Run `pnpm --filter control-panel build` and record the result in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`
- [X] T055 Check for page-level horizontal overflow, clipped text, and prototype-prohibited styles across Dashboard, Labs, Chaos, and Registry and record final signoff in `/Users/ducduy/Projects/distributed-lab/specs/002-distributed-lab-implementation/visual-review.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 8)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependency on other user stories.
- **User Story 2 (P1)**: Can start after Foundational; no dependency on other user stories.
- **User Story 3 (P2)**: Can start after Foundational; uses shared primitives and may reuse toast/topology behavior.
- **User Story 4 (P2)**: Can start after Foundational; uses shared topology/table primitives.
- **User Story 5 (P2)**: Can start after Foundational, but final verification is strongest after the visual stories are implemented.

### Within Each User Story

- Tests must be written first and confirmed failing for missing prototype behavior.
- Story-specific data/components come before page composition.
- Page composition comes before viewport/theme review.
- Each checkpoint can be used to validate the story independently.

---

## Parallel Opportunities

- Setup tasks T002, T003, and T004 can run in parallel.
- Foundational fixture, primitive, topology, and CSS work T006 through T009 can run in parallel after T005 is written.
- User Story 1 component tasks T014 through T017 can run in parallel after US1 tests are written.
- User Story 2 component/data tasks T022 through T024 can run in parallel after US2 tests are written.
- User Story 3 component tasks T030 through T034 can run in parallel after US3 tests are written.
- User Story 4 component/data tasks T038 through T040 can run in parallel after US4 tests are written.
- User Story 5 accessibility tasks T045 through T048 can run in parallel after US5 tests are written.

---

## Parallel Examples

### User Story 1

```text
Task: "Update dashboard metric card sparkline, value, subtext, and compact card styling in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/MetricCard.tsx"
Task: "Update experiment table columns, monospace IDs, status pills, and truncation behavior in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ExperimentsTable.tsx"
Task: "Update recent events timestamp, severity indicator, compact row styling, and empty-state layout in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/EventFeed.tsx"
```

### User Story 2

```text
Task: "Add lab module display data and feature lists from the prototype in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/lib/lab-modules.ts"
Task: "Add the accessible module detail tabs component with Overview, Experiments, and Guide states in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/LabModuleDetail.tsx"
Task: "Add the selectable module card component with prototype color identities and selected-state styling in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/LabModuleCard.tsx"
```

### User Story 3

```text
Task: "Update fault injection labels, target options, validation, disabled state, and prototype form layout in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/FaultInjectionForm.tsx"
Task: "Add the active faults table with ID, type, target, magnitude, and Stop action in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ActiveFaultsTable.tsx"
Task: "Update cascading failure map nodes, dashed degraded/failed links, and responsive SVG sizing in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/CascadingFailureMap.tsx"
```

### User Story 4

```text
Task: "Add the service topology component with Control, Gateway, Application, Services, and Data layers in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ServiceTopology.tsx"
Task: "Add the service catalog table component with Service, Status, Version, Image, Dependencies, and Port columns in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/ServiceCatalogTable.tsx"
Task: "Add registry display mapping from service data plus prototype fallback rows in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/lib/registry-display.ts"
```

### User Story 5

```text
Task: "Update theme persistence, default mode, and data-theme synchronization in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/hooks/useTheme.tsx"
Task: "Add accessible tab roles, keyboard handling, and focus styles to module detail tabs in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/LabModuleDetail.tsx"
Task: "Add form labels, error associations, and disabled/submit accessibility states in /Users/ducduy/Projects/distributed-lab/apps/control-panel/src/components/FaultInjectionForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate Dashboard independently against `references/ui-prototype.html`.
5. Demo if the Dashboard parity checkpoint passes.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Deliver User Story 1 Dashboard parity as MVP.
3. Deliver User Story 2 Labs parity.
4. Deliver User Story 3 Chaos parity.
5. Deliver User Story 4 Registry parity.
6. Deliver User Story 5 theme/accessibility parity across all screens.
7. Run Phase 8 final checks.

### Parallel Team Strategy

After Foundational completes:

- Developer A: User Story 1 Dashboard.
- Developer B: User Story 2 Labs.
- Developer C: User Story 3 Chaos.
- Developer D: User Story 4 Registry.
- Accessibility owner: User Story 5 after the first screen implementations stabilize.

---

## Independent Test Criteria Summary

- **US1**: Dashboard shows prototype shell, metric cards, Service Health, Active Experiments, Recent Events, status colors, and responsive stacking.
- **US2**: Labs shows five prototype modules, selected card state, module detail panel, and Overview/Experiments/Guide tab behavior.
- **US3**: Chaos supports prototype fault injection, active fault stopping, circuit breaker display, failure map, and toast feedback.
- **US4**: Registry shows service topology layers before the service catalog table with required columns and controlled narrow-width scrolling.
- **US5**: Theme toggle, keyboard navigation, focus states, contrast, and touch targets work across all four primary screens.

## Notes

- [P] tasks touch different files and can run in parallel after their phase prerequisites.
- [US1] through [US5] labels map directly to user stories in [spec.md](./spec.md).
- Fallback prototype data must never override real backend data when real data is available.
- Do not add new runtime UI dependencies unless a later task explicitly updates the plan and contract.
- Keep UI language aligned with distributed-systems concepts from `references/ui-prototype.html` and `specs/001-distributed-lab-docs/`.
