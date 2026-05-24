# Tasks: Lab Detail Content Completion

**Input**: Design documents from `/specs/003-lab-detail-content/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/labs-detail-content-contract.md](./contracts/labs-detail-content-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Required by the project constitution and quickstart. Write or update tests first, confirm they fail against the placeholder tabs, then implement.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or only reads/validates state
- **[Story]**: User story label from [spec.md](./spec.md)
- Every task includes an exact repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the feature context and current test surface before editing code.

- [X] T001 [P] Review feature scope, contract, and quickstart in specs/003-lab-detail-content/spec.md, specs/003-lab-detail-content/contracts/labs-detail-content-contract.md, and specs/003-lab-detail-content/quickstart.md
- [X] T002 [P] Inspect the existing Labs implementation in apps/control-panel/src/lib/lab-modules.ts, apps/control-panel/src/components/LabModuleDetail.tsx, and apps/control-panel/src/app/labs/page.tsx
- [X] T003 [P] Inspect the existing Labs test coverage in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared content shape that all user stories need.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [X] T004 Add shared LabExperimentDefinition, LabGuideStep, and LabGuideSection TypeScript interfaces in apps/control-panel/src/lib/lab-modules.ts
- [X] T005 Extend the LabModule interface with experiments and guide fields in apps/control-panel/src/lib/lab-modules.ts
- [X] T006 Add empty typed experiments and guide placeholders for all five existing modules in apps/control-panel/src/lib/lab-modules.ts so TypeScript exposes required missing content before story data is filled

**Checkpoint**: The data model is ready for story-specific content and rendering tasks.

---

## Phase 3: User Story 1 - Discover Runnable Module Experiments (Priority: P1) MVP

**Goal**: A learner can select any module and see concrete experiment definitions in the Experiments tab.

**Independent Test**: Open `/labs`, select each module, switch to Experiments, and verify module-specific titles, concepts, objective, setup or trigger, expected observation, and success signal are visible with no generic placeholder.

### Tests for User Story 1

> Write these tests first and confirm they fail before implementation.

- [X] T007 [US1] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert each module's Experiments tab shows non-placeholder experiment catalog content
- [X] T008 [US1] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert experiment entries show objective, setup or trigger, expected observation, and success signal labels
- [X] T009 [US1] Run the focused failing Labs test for User Story 1 using apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

### Implementation for User Story 1

- [X] T010 [US1] Add experiment definitions for Migration & Decomposition in apps/control-panel/src/lib/lab-modules.ts covering strangler routing, parallel response comparison, feature-toggle migration, and rollback or safe cutover
- [X] T011 [US1] Add experiment definitions for Distributed Data & Consistency in apps/control-panel/src/lib/lab-modules.ts covering CAP partition choice, replication lag, multi-model comparison, and CDC pause or replay
- [X] T012 [US1] Add experiment definitions for Resiliency & Chaos in apps/control-panel/src/lib/lab-modules.ts covering fault injection, circuit breaker behavior, and bulkhead or cascading failure containment
- [X] T013 [US1] Add experiment definitions for Workflow & Communication in apps/control-panel/src/lib/lab-modules.ts covering saga behavior, idempotency replay, communication comparison, and consumer contract breakage
- [X] T014 [US1] Add experiment definitions for Observability Suite in apps/control-panel/src/lib/lab-modules.ts covering metrics, tracing, log correlation, and registry dependency inspection
- [X] T015 [US1] Render the Experiments tab catalog from module.experiments in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T016 [US1] Replace the generic "No experiments running" placeholder with a compact inactive-runtime note that preserves the experiment catalog in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T017 [US1] Run the focused passing Labs test for User Story 1 using apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

**Checkpoint**: User Story 1 is independently testable and delivers the MVP.

---

## Phase 4: User Story 2 - Follow Module Guides Step by Step (Priority: P1)

**Goal**: A learner can select any module and follow the Guide tab to understand prerequisites, ordered steps, observations, validation, and cleanup or next steps.

**Independent Test**: Open `/labs`, select each module, switch to Guide, and verify each guide includes objective, prerequisites, setup check, ordered steps, observation checklist, validation criteria, and cleanup or next steps.

### Tests for User Story 2

> Write these tests first and confirm they fail before implementation.

- [X] T018 [US2] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert each module's Guide tab shows non-placeholder guide content
- [X] T019 [US2] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert Guide content includes objective, prerequisites, setup check, ordered steps, validation, and cleanup or next-step labels
- [X] T020 [US2] Run the focused failing Labs test for User Story 2 using apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

### Implementation for User Story 2

- [X] T021 [US2] Add guide content for Migration & Decomposition in apps/control-panel/src/lib/lab-modules.ts covering monolith start, route selection, behavior comparison, safe traffic shift, validation, and rollback
- [X] T022 [US2] Add guide content for Distributed Data & Consistency in apps/control-panel/src/lib/lab-modules.ts covering sample data setup, consistency stress case, divergence observation, recovery, validation, and cleanup
- [X] T023 [US2] Add guide content for Resiliency & Chaos in apps/control-panel/src/lib/lab-modules.ts covering target selection, bounded fault injection, breaker and failure-map observation, stop, recovery, and cleanup
- [X] T024 [US2] Add guide content for Workflow & Communication in apps/control-panel/src/lib/lab-modules.ts covering workflow execution, message-flow inspection, idempotent replay, coupling comparison, contract validation, and cleanup
- [X] T025 [US2] Add guide content for Observability Suite in apps/control-panel/src/lib/lab-modules.ts covering activity generation, metrics, logs, traces, request correlation, registry inspection, validation, and next steps
- [X] T026 [US2] Render the Guide tab sections and ordered steps from module.guide in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T027 [US2] Replace the generic "Lab guide and concept notes will appear here" placeholder with structured guide rendering in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T028 [US2] Run the focused passing Labs test for User Story 2 using apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Keep Content Consistent With the Existing Lab Overview (Priority: P2)

**Goal**: Overview, Experiments, and Guide content use the same module concepts and do not introduce contradictory naming.

**Independent Test**: For each module, compare Overview features against Experiments and Guide content and verify every Overview feature has a related experiment or guide step using learner-facing distributed-systems language.

### Tests for User Story 3

- [X] T029 [US3] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert every Overview feature is represented by related Experiments or Guide content
- [X] T030 [US3] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert module-specific content changes when selecting a different module

### Implementation for User Story 3

- [X] T031 [US3] Audit and adjust experiment concept labels for all modules in apps/control-panel/src/lib/lab-modules.ts so they match existing Overview feature language
- [X] T032 [US3] Audit and adjust guide step wording for all modules in apps/control-panel/src/lib/lab-modules.ts so learner-facing terms stay primary and implementation identifiers remain secondary
- [X] T033 [US3] Ensure module changes reset or refresh active tab content without stale text in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T034 [US3] Run the focused passing Labs test for User Story 3 using apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

**Checkpoint**: User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - Preserve Usability Across States and Viewports (Priority: P2)

**Goal**: Filled detail tabs remain accessible, readable, and responsive across inactive runtime state and common viewport widths.

**Independent Test**: Review `/labs` at desktop, tablet, and phone widths; select each module; switch tabs by mouse and keyboard; verify readable content, visible focus, no stale state, and no page-level horizontal overflow.

### Tests for User Story 4

- [X] T035 [US4] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert keyboard tab switching still exposes correct Experiments and Guide tabpanels
- [X] T036 [US4] Update apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx to assert inactive runtime text does not hide experiment definitions

### Implementation for User Story 4

- [X] T037 [US4] Add compact responsive layout classes for experiment entries in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T038 [US4] Add compact responsive layout classes for guide sections and ordered steps in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T039 [US4] Verify focus, wrapping, and no horizontal overflow behavior for the Labs detail panel in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T040 [US4] Run the focused passing Labs test for User Story 4 using apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

**Checkpoint**: All user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full feature and update task state.

- [X] T041 Run the full control-panel test suite with pnpm --filter control-panel test for apps/control-panel/package.json
- [X] T042 Run the control-panel production build with pnpm --filter control-panel build for apps/control-panel/package.json
- [X] T043 Skip additional e2e viewport review per user request after unit and build validation for specs/003-lab-detail-content/quickstart.md
- [X] T044 Confirm no placeholder copy remains in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T045 Confirm all tasks are marked complete in specs/003-lab-detail-content/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can be implemented after or alongside US1, but both write `apps/control-panel/src/lib/lab-modules.ts` and `apps/control-panel/src/components/LabModuleDetail.tsx`, so coordinate file edits carefully.
- **User Story 3 (Phase 5)**: Depends on US1 and US2 content existing.
- **User Story 4 (Phase 6)**: Depends on US1 and US2 rendering existing.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependency on other stories.
- **User Story 2 (P1)**: Can start after Foundational; no conceptual dependency on US1, but implementation touches the same files.
- **User Story 3 (P2)**: Depends on US1 and US2 because it audits cross-tab consistency.
- **User Story 4 (P2)**: Depends on US1 and US2 because it validates the final filled tab layouts.

### Within Each User Story

- Tests must be written and observed failing before implementation tasks.
- Data content in `apps/control-panel/src/lib/lab-modules.ts` must exist before rendering depends on it.
- Rendering changes in `apps/control-panel/src/components/LabModuleDetail.tsx` must happen before passing tab content tests.
- Focused tests must pass before moving to the next story checkpoint.

### Parallel Opportunities

- T001, T002, and T003 can be done in parallel because they only inspect docs and existing files.
- US1 module data tasks T010 through T014 can be split by module if contributors coordinate edits to `apps/control-panel/src/lib/lab-modules.ts`.
- US2 module guide data tasks T021 through T025 can be split by module if contributors coordinate edits to `apps/control-panel/src/lib/lab-modules.ts`.
- Manual review T043 can run after automated tests and build begin, but final completion still depends on all validation results.

---

## Parallel Example: User Story 1

```bash
# Coordinate same-file edits before running these in parallel:
Task: "T010 [US1] Add experiment definitions for Migration & Decomposition in apps/control-panel/src/lib/lab-modules.ts"
Task: "T011 [US1] Add experiment definitions for Distributed Data & Consistency in apps/control-panel/src/lib/lab-modules.ts"
Task: "T012 [US1] Add experiment definitions for Resiliency & Chaos in apps/control-panel/src/lib/lab-modules.ts"
Task: "T013 [US1] Add experiment definitions for Workflow & Communication in apps/control-panel/src/lib/lab-modules.ts"
Task: "T014 [US1] Add experiment definitions for Observability Suite in apps/control-panel/src/lib/lab-modules.ts"
```

---

## Parallel Example: User Story 2

```bash
# Coordinate same-file edits before running these in parallel:
Task: "T021 [US2] Add guide content for Migration & Decomposition in apps/control-panel/src/lib/lab-modules.ts"
Task: "T022 [US2] Add guide content for Distributed Data & Consistency in apps/control-panel/src/lib/lab-modules.ts"
Task: "T023 [US2] Add guide content for Resiliency & Chaos in apps/control-panel/src/lib/lab-modules.ts"
Task: "T024 [US2] Add guide content for Workflow & Communication in apps/control-panel/src/lib/lab-modules.ts"
Task: "T025 [US2] Add guide content for Observability Suite in apps/control-panel/src/lib/lab-modules.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate that every module has meaningful Experiments tab content.

### Incremental Delivery

1. Add User Story 1 to replace the Experiments placeholder.
2. Add User Story 2 to replace the Guide placeholder.
3. Add User Story 3 to tighten cross-tab consistency.
4. Add User Story 4 to verify accessibility, inactive state, and responsive behavior.

### Validation Commands

```bash
pnpm --filter control-panel test -- src/app/labs/__tests__/labs.prototype.test.tsx --runInBand
pnpm --filter control-panel test
pnpm --filter control-panel build
```

## Notes

- Keep content static and local to the control panel unless a later feature introduces live experiment orchestration.
- Do not add runtime dependencies for markdown or remote content loading.
- Preserve the existing five module inventory and selected-module flow.
- Mark tasks as `[X]` in this file as they are completed during `/speckit-implement`.
