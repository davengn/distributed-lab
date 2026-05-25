# Tasks: Lab Testing Utilities

**Input**: Design documents from `/specs/004-lab-testing-utilities/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included because the feature plan and constitution require test-first delivery. Do not add or run e2e tests for this feature.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after prerequisites for the phase are complete
- **[Story]**: Which user story this task belongs to
- Every task includes concrete repository paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared files and test locations used by the Lab API and control-panel implementation.

- [X] T001 Create Lab API test package directories in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ and apps/lab-api/src/test/java/com/distributedlab/labapi/service/
- [X] T002 [P] Create control-panel lab testing fixture helpers in apps/control-panel/src/test/lab-testing-fixtures.ts
- [X] T003 [P] Create shared control-panel lab testing types in apps/control-panel/src/lib/lab-testing-types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared request-runner contracts, target registry, and client plumbing that all user stories depend on.

**Critical**: No user story work can begin until this phase is complete.

- [X] T004 [P] Create ServiceRequestTarget record and status/method enums in apps/lab-api/src/main/java/com/distributedlab/labapi/model/ServiceRequestTarget.java
- [X] T005 [P] Create ServiceRequest record with validation-oriented fields in apps/lab-api/src/main/java/com/distributedlab/labapi/model/ServiceRequest.java
- [X] T006 [P] Create ServiceRequestResult record with status/error fields in apps/lab-api/src/main/java/com/distributedlab/labapi/model/ServiceRequestResult.java
- [X] T007 [P] Create TestingUtilityRun record with safety/result fields in apps/lab-api/src/main/java/com/distributedlab/labapi/model/TestingUtilityRun.java
- [X] T008 Implement ServiceTargetRegistry with local lab service allow-listing in apps/lab-api/src/main/java/com/distributedlab/labapi/service/ServiceTargetRegistry.java
- [X] T009 Implement ServiceRequestController route skeleton for targets, request execution, and utility runs in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ServiceRequestController.java
- [X] T010 Add typed service-request client methods and error mapping to apps/control-panel/src/lib/api-client.ts
- [X] T011 [P] Create bounded session history helpers for request results in apps/control-panel/src/lib/lab-testing-session.ts

**Checkpoint**: Backend and frontend contracts exist, but user-facing behavior is not complete yet.

---

## Phase 3: User Story 1 - Send a Lab Service Request (Priority: P1) MVP

**Goal**: A learner can choose a local lab service, compose a request, send it, and inspect the response without leaving the Labs UI.

**Independent Test**: Select a running lab service, send a simple request, and verify that status, elapsed time, response body, and error details appear while the draft remains editable.

### Tests for User Story 1

- [X] T012 [P] [US1] Add failing controller tests for target listing and blocked invalid requests in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceRequestControllerTest.java
- [X] T013 [P] [US1] Add failing service tests for allowed target dispatch, path validation, method validation, timeout, and body preview truncation in apps/lab-api/src/test/java/com/distributedlab/labapi/service/ServiceRequestRunnerTest.java
- [X] T014 [P] [US1] Add failing React tests for workspace rendering, request validation, pending state, success result, failure result, and editable retry draft in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

### Implementation for User Story 1

- [X] T015 [US1] Implement ServiceRequestRunner validation, timeout handling, RestTemplate dispatch, response preview capping, and structured outcome logging in apps/lab-api/src/main/java/com/distributedlab/labapi/service/ServiceRequestRunner.java
- [X] T016 [US1] Complete ServiceRequestController target listing and POST /api/v1/service-requests handling in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ServiceRequestController.java
- [X] T017 [P] [US1] Implement RequestComposer controls for target, method, path, query, headers, body, timeout, validation, and submit state in apps/control-panel/src/components/RequestComposer.tsx
- [X] T018 [P] [US1] Implement RequestResultPanel for status, duration, timestamp, headers, body preview, truncation state, and actionable errors in apps/control-panel/src/components/RequestResultPanel.tsx
- [X] T019 [US1] Implement LabTestingWorkspace target loading, draft state, submit flow, pending result state, and error recovery in apps/control-panel/src/components/LabTestingWorkspace.tsx
- [X] T020 [US1] Add a Testing tab entry while preserving Overview, Experiments, and Guide tab behavior in apps/control-panel/src/components/LabModuleDetail.tsx
- [X] T021 [US1] Wire the selected module into LabTestingWorkspace from apps/control-panel/src/app/labs/page.tsx

**Checkpoint**: User Story 1 is functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Use Lab Request Presets (Priority: P2)

**Goal**: A learner can start from module-aware guided request presets and see the expected lab observation next to the response.

**Independent Test**: Select a module-specific preset, confirm that request fields are populated, send it, and verify that the expected observation remains visible with the result.

### Tests for User Story 2

- [X] T022 [P] [US2] Add failing React tests for module-specific preset ordering, preset loading, editable preset fields, and expected observations in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx
- [X] T023 [P] [US2] Add failing unit coverage for preset metadata validity across existing lab modules in apps/control-panel/src/lib/lab-testing-presets.test.ts

### Implementation for User Story 2

- [X] T024 [US2] Define curated request presets for migration, consistency, resiliency, workflows, and observability modules in apps/control-panel/src/lib/lab-testing-presets.ts
- [X] T025 [P] [US2] Implement RequestPresetList with module-first sorting, safety labels, empty state, and preset selection in apps/control-panel/src/components/RequestPresetList.tsx
- [X] T026 [US2] Add preset loading, selected preset tracking, expected observation display, and return-to-list behavior in apps/control-panel/src/components/LabTestingWorkspace.tsx
- [X] T027 [US2] Connect preset target names to available ServiceRequestTarget values with unavailable-preset messaging in apps/control-panel/src/components/LabTestingWorkspace.tsx

**Checkpoint**: User Story 2 works independently on top of the request composer.

---

## Phase 5: User Story 3 - Compare and Reuse Testing Results (Priority: P3)

**Goal**: A learner can review recent requests, retry them, copy request or response content, and compare before-and-after results.

**Independent Test**: Send the same request twice under different conditions, then verify both results remain visible with timestamps, durations, statuses, retry, copy, and comparison behavior.

### Tests for User Story 3

- [X] T028 [P] [US3] Add failing React tests for session history retention, bounded history length, retry loading, copy actions, and comparison output in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx
- [X] T029 [P] [US3] Add failing unit tests for history serialization and comparison summaries in apps/control-panel/src/lib/lab-testing-session.test.ts

### Implementation for User Story 3

- [X] T030 [US3] Implement sessionStorage-backed request history append, load, trim-to-20, and clear helpers in apps/control-panel/src/lib/lab-testing-session.ts
- [X] T031 [P] [US3] Implement RequestHistoryPanel entries with target, method, path, status, duration, timestamp, response summary, retry, and copy actions in apps/control-panel/src/components/RequestHistoryPanel.tsx
- [X] T032 [P] [US3] Implement result comparison helpers for status, timing, and response preview differences in apps/control-panel/src/lib/lab-testing-compare.ts
- [X] T033 [US3] Add compare-selection state and comparison rendering to apps/control-panel/src/components/LabTestingWorkspace.tsx
- [X] T034 [US3] Persist successful, failed, timed-out, and blocked request outcomes into history from apps/control-panel/src/components/LabTestingWorkspace.tsx

**Checkpoint**: User Story 3 supports before-and-after lab observations without retyping requests.

---

## Phase 6: User Story 4 - Access Supporting Testing Utilities (Priority: P4)

**Goal**: A learner can run supporting utilities such as health checks, sample helpers, cleanup reminders, and confirmed safe reset actions.

**Independent Test**: Run a health check and a cleanup utility from the testing workspace and verify both report success or actionable failure without disrupting the current request draft.

### Tests for User Story 4

- [X] T035 [P] [US4] Add failing controller tests for utility execution, unknown utilities, and confirmation-required state-changing utilities in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceRequestControllerTest.java
- [X] T036 [P] [US4] Add failing React tests for read-only utility labels, state-changing confirmation, utility failures, and draft preservation in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx

### Implementation for User Story 4

- [X] T037 [US4] Implement utility definitions and execution rules in apps/lab-api/src/main/java/com/distributedlab/labapi/service/TestingUtilityService.java
- [X] T038 [US4] Complete POST /api/v1/service-requests/utilities/{utilityId}/runs handling in apps/lab-api/src/main/java/com/distributedlab/labapi/controller/ServiceRequestController.java
- [X] T039 [P] [US4] Define frontend utility metadata for health checks, sample data, cleanup reminders, and safe resets in apps/control-panel/src/lib/lab-testing-utilities.ts
- [X] T040 [P] [US4] Implement TestingUtilitiesPanel with safety grouping, confirmation controls, run status, and actionable failure display in apps/control-panel/src/components/TestingUtilitiesPanel.tsx
- [X] T041 [US4] Integrate utility run actions and draft-preserving result handling in apps/control-panel/src/components/LabTestingWorkspace.tsx

**Checkpoint**: User Story 4 provides supporting lab utilities without replacing the request workflow.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility, documentation alignment, and build checks across the completed feature.

- [X] T042 [P] Add accessibility assertions for keyboard navigation, tab semantics, non-color status messaging, and responsive content in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx
- [X] T043 [P] Add structured logging field assertions or logger verification for request outcomes in apps/lab-api/src/test/java/com/distributedlab/labapi/service/ServiceRequestRunnerTest.java
- [X] T044 Review and tighten copy, empty states, timeout messages, and unavailable-service guidance in apps/control-panel/src/components/LabTestingWorkspace.tsx
- [X] T045 [P] Update implementation notes and manual smoke instructions in specs/004-lab-testing-utilities/quickstart.md
- [X] T046 Run focused control-panel tests with pnpm --filter control-panel test -- src/app/labs/__tests__/labs.prototype.test.tsx --runInBand from apps/control-panel/package.json
- [X] T047 Run Lab API tests with mvn -f pom.xml -pl apps/lab-api -Dtest=ServiceRequestControllerTest,ServiceRequestRunnerTest test from pom.xml
- [X] T048 Run control-panel build with pnpm --filter control-panel build from package.json
- [X] T049 Run backend compile with mvn -f pom.xml -pl apps/lab-api -DskipTests compile from pom.xml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and can be developed after or alongside User Story 1, but its useful UI path expects the composer from User Story 1.
- **User Story 3 (Phase 5)**: Depends on Foundational and can be developed after User Story 1 produces request results.
- **User Story 4 (Phase 6)**: Depends on Foundational and can be developed independently from User Stories 2 and 3.
- **Polish (Phase 7)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Send a Lab Service Request (P1)**: Foundation only; no dependency on other stories.
- **US2 Use Lab Request Presets (P2)**: Foundation only for metadata, and integrates with US1 composer behavior for sending.
- **US3 Compare and Reuse Testing Results (P3)**: Foundation only for storage helpers, and integrates with US1 request results.
- **US4 Access Supporting Testing Utilities (P4)**: Foundation only; independent backend utility path and frontend utility panel.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Backend models and registry precede request-runner/controller behavior.
- UI types and client methods precede component integration.
- Component-level behavior precedes page-level wiring.
- Complete and verify one story before treating it as releasable.

---

## Parallel Opportunities

- Setup tasks T002 and T003 can run in parallel.
- Foundational model tasks T004 through T007 can run in parallel.
- US1 tests T012 through T014 can run in parallel, then UI component tasks T017 and T018 can run in parallel after client types exist.
- US2 tests T022 and T023 can run in parallel, and RequestPresetList T025 can run in parallel with preset metadata T024 after type definitions exist.
- US3 tests T028 and T029 can run in parallel, and RequestHistoryPanel T031 can run in parallel with comparison helper T032.
- US4 tests T035 and T036 can run in parallel, and frontend utility metadata T039 can run in parallel with backend utility service T037.
- Polish tests T042 and T043 can run in parallel before final command checks.

---

## Parallel Example: User Story 1

```bash
# After Phase 2, create failing US1 tests in parallel:
Task: "T012 Add failing controller tests in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceRequestControllerTest.java"
Task: "T013 Add failing service tests in apps/lab-api/src/test/java/com/distributedlab/labapi/service/ServiceRequestRunnerTest.java"
Task: "T014 Add failing React tests in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx"

# After request-runner contract exists, implement independent UI panels in parallel:
Task: "T017 Implement RequestComposer in apps/control-panel/src/components/RequestComposer.tsx"
Task: "T018 Implement RequestResultPanel in apps/control-panel/src/components/RequestResultPanel.tsx"
```

## Parallel Example: User Story 3

```bash
# After US1 result state exists, build history and comparison surfaces in parallel:
Task: "T031 Implement RequestHistoryPanel in apps/control-panel/src/components/RequestHistoryPanel.tsx"
Task: "T032 Implement result comparison helpers in apps/control-panel/src/lib/lab-testing-compare.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational contracts and client plumbing.
3. Complete Phase 3 tests first, then implementation for request sending and result viewing.
4. Stop and validate User Story 1 with focused React and Lab API tests.

### Incremental Delivery

1. Add US1 request sending and response viewing.
2. Add US2 guided presets for the five lab modules.
3. Add US3 session history, retry, copy, and comparison.
4. Add US4 testing utilities.
5. Finish polish and run the non-e2e verification commands.

### Verification Scope

- Focused React/Jest tests for Labs behavior.
- Spring controller/service tests for Lab API request validation, dispatch, and utility execution.
- Control-panel build.
- Lab API compile/test.
- Manual smoke check from quickstart after `docker compose up`.
- No e2e tests unless the user explicitly changes that direction.
