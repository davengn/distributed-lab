# Feature Specification: Lab Testing Utilities

**Feature Branch**: `004-lab-testing-utilities`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "create a new spec plan to add ability to make request to services on UI to test and other utilities serve labs testing for user"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a Lab Service Request (Priority: P1)

A learner can open a lab testing workspace from the Labs UI, choose a lab service, compose a request, send it, and inspect the response without leaving the control panel.

**Why this priority**: The primary gap is that learners cannot exercise lab services directly from the UI while following a lab.

**Independent Test**: Select a running lab service, send a simple request, and verify that the UI shows the request status, elapsed time, response body, and any error details.

**Acceptance Scenarios**:

1. **Given** the lab environment is running and at least one service is available, **When** the learner selects a service, enters a supported request, and sends it, **Then** the UI displays the response status, elapsed time, response content, and the target service name.
2. **Given** a learner submits a malformed or unsupported request, **When** the request fails validation, **Then** the UI blocks submission and explains what must be fixed.
3. **Given** a target service is stopped or unreachable, **When** the learner sends a request to it, **Then** the UI displays a clear failure result and keeps the composed request available for correction or retry.

---

### User Story 2 - Use Lab Request Presets (Priority: P2)

A learner can start from guided request presets that match the selected lab module so they do not need to remember service paths, example payloads, or expected observations.

**Why this priority**: Presets reduce setup friction and make labs easier to follow, especially for learners who are new to the service topology.

**Independent Test**: Select a module-specific preset, confirm the request fields are populated, send it, and verify that the expected observation is visible next to the response.

**Acceptance Scenarios**:

1. **Given** a learner has selected a lab module, **When** they open the testing utilities, **Then** the UI shows relevant request presets for that module before generic utilities.
2. **Given** the learner chooses a preset, **When** the preset loads, **Then** the UI fills the target, request method, path, headers, body, and expected observation while still allowing edits before sending.
3. **Given** a preset is tied to a lab concept, **When** the learner runs it, **Then** the result explains how the response supports the lab exercise.

---

### User Story 3 - Compare and Reuse Testing Results (Priority: P3)

A learner can review recent requests, retry a request, copy request or response content, and compare before-and-after results during experiments such as fault injection, migration, or consistency drills.

**Why this priority**: Labs often require repeating the same request before, during, and after a change. Reuse and comparison make the learning loop faster.

**Independent Test**: Send the same request twice under different lab conditions, then verify that both results remain visible with timestamps, durations, statuses, and copy or retry actions.

**Acceptance Scenarios**:

1. **Given** a learner has sent multiple requests, **When** they review the session history, **Then** each entry includes target, method, path, status, duration, timestamp, and a summary of the response.
2. **Given** a learner chooses retry from a previous request, **When** the request is loaded again, **Then** the UI preserves the same target and request details while allowing edits.
3. **Given** two relevant results exist, **When** the learner compares them, **Then** the UI highlights status, timing, and response differences that matter for the lab observation.

---

### User Story 4 - Access Supporting Testing Utilities (Priority: P4)

A learner can use small supporting utilities from the same workspace, including service health checks, sample data helpers, cleanup reminders, and safe reset actions for lab exercises.

**Why this priority**: These utilities support lab completion but are secondary to sending service requests and inspecting results.

**Independent Test**: Use a service health check and a cleanup utility from the testing workspace and verify that both report success or actionable failure without disrupting the current request draft.

**Acceptance Scenarios**:

1. **Given** the lab stack is running, **When** the learner runs a health check utility, **Then** the UI shows which lab services are ready, degraded, or unavailable.
2. **Given** a lab module has cleanup guidance, **When** the learner opens utilities for that module, **Then** cleanup reminders and safe reset actions are grouped separately from request presets.
3. **Given** a utility cannot complete, **When** the failure is shown, **Then** the UI explains what happened and what the learner can try next.

### Edge Cases

- The selected service disappears or changes health while a request draft is open.
- A request takes longer than the configured limit.
- A response body is empty, binary-like, very large, or invalid structured data.
- A learner sends a request with missing target, missing path, invalid headers, or invalid body content.
- A lab preset references a service that is not available in the current stack.
- A fault, toggle, or experiment changes service behavior between two repeated requests.
- The browser refreshes during a session with unsaved request history.
- Multiple learners use separate browser sessions against the same local lab stack.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a lab testing workspace from the Labs UI for composing and sending requests to available lab services.
- **FR-002**: Users MUST be able to choose a target service from the services currently known to the lab environment.
- **FR-003**: Users MUST be able to enter or edit request method, path, headers, query information, and body before sending.
- **FR-004**: The system MUST validate required request fields before submission and show field-level guidance for invalid input.
- **FR-005**: The system MUST display each request result with target, request summary, response status, elapsed time, timestamp, response headers when available, response body, and error details when available.
- **FR-006**: The system MUST keep the request draft editable after success or failure so learners can adjust and retry quickly.
- **FR-007**: The system MUST provide module-aware request presets for the existing lab modules where representative service calls are known.
- **FR-008**: Request presets MUST include target, request method, path, optional headers, optional body, lab concept, and expected observation.
- **FR-009**: Users MUST be able to load a preset, edit it, send it, and return to the preset list without losing the latest result.
- **FR-010**: The system MUST maintain a recent request history for the current browser session.
- **FR-011**: Users MUST be able to retry a history entry and copy request or response content.
- **FR-012**: Users MUST be able to compare at least two recent results for status, timing, and response content differences.
- **FR-013**: The system MUST provide supporting utilities for service health checks, sample request data, lab cleanup reminders, and safe reset actions where the selected lab supports them.
- **FR-014**: The system MUST clearly distinguish safe read-only utilities from utilities that change lab state.
- **FR-015**: The system MUST protect learners from accidentally sending requests to services outside the local lab environment.
- **FR-016**: The system MUST show actionable messages for unreachable services, timed-out requests, unsupported request methods, invalid request content, and unavailable presets.
- **FR-017**: The system MUST preserve dark and light mode behavior, keyboard access, and existing Labs page navigation patterns.
- **FR-018**: The system MUST not require learners to leave the control panel or use an external command-line tool for the supported testing flow.

### Key Entities *(include if feature involves data)*

- **Service Target**: A lab service that can receive learner requests; includes display name, service identifier, readiness state, module relevance, and allowed request scope.
- **Service Request Draft**: The learner-composed request before submission; includes target, method, path, headers, query values, body, timeout preference, selected preset, and validation state.
- **Request Preset**: A guided request template connected to a lab module or concept; includes label, description, target, method, path, optional headers, optional body, expected observation, and safety classification.
- **Request Result**: The outcome of a sent request; includes request summary, status, duration, response metadata, body preview, error details, and timestamp.
- **Request History Entry**: A session-scoped record that links a request draft to its result and supports retry, copy, and comparison.
- **Testing Utility**: A supporting action such as health check, sample data helper, cleanup reminder, or safe reset; includes label, purpose, safety classification, required target, and result.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of learners can send a successful request to a running lab service and understand the response in under 2 minutes without external tools.
- **SC-002**: 100% of invalid or failed request attempts produce an actionable message that identifies the target, the failure category, and the next corrective step.
- **SC-003**: Learners can run a module preset, modify it, and retry it in under 60 seconds.
- **SC-004**: Learners can compare before-and-after results for an experiment using the UI history without retyping the request.
- **SC-005**: The testing workspace remains usable across desktop and tablet-sized screens with no loss of required request, result, or utility information.
- **SC-006**: The supported request and utility flow can be completed after `docker compose up` without additional learner setup.

## Assumptions

- The primary users are local learners running the DistributedLab stack for guided distributed-systems labs.
- The request workspace is scoped to local lab services and does not become a general-purpose internet request client.
- Request history can be session-scoped for the first version and does not need long-term persistence.
- Presets are curated for existing lab modules first; unsupported services can still be tested with a custom request if they are part of the local lab environment.
- State-changing utilities must be visibly labeled before execution, while read-only checks can run directly.
- Browser-based learners should not need a command-line tool for the supported happy path.
