# Research: Lab Testing Utilities

## Decision: Route service requests through Lab API instead of direct browser-to-service calls

**Rationale**: The Lab API already owns service discovery, Docker-backed service status, structured logging, and local orchestration boundaries. Routing requests through it avoids browser CORS issues, avoids requiring every lab service to expose public ports, and gives the platform a single place to restrict requests to known local lab services.

**Alternatives considered**:

- Direct browser requests to service ports: rejected because many services may not be browser-accessible and the UI would become a general HTTP client.
- A dedicated request-proxy service: rejected because it adds a container and duplicates Lab API orchestration responsibility.
- Hardcoded service URLs in the frontend: rejected because service names and ports can vary by environment.

## Decision: Allow-list request targets from the lab service catalog

**Rationale**: Learners need to test lab services, not arbitrary external hosts. Target allow-listing keeps the feature aligned with the local sandbox and prevents accidental requests outside the lab environment.

**Alternatives considered**:

- Free-form URL input: rejected because it expands scope and safety risk.
- Module-only presets with no custom target selection: rejected because learners still need to explore service behavior beyond presets.

## Decision: Keep request history in the browser session

**Rationale**: The spec requires reuse and comparison during a lab session but does not require long-term audit history. Browser-session history keeps the implementation light and avoids new persistence concerns while supporting refresh-tolerant workflows if `sessionStorage` is used.

**Alternatives considered**:

- Backend persistence: rejected for v1 because it introduces storage, cleanup, and multi-user semantics not required by the user request.
- In-memory component-only history: rejected because a refresh during a lab would lose useful before-and-after results.
- Long-lived local storage: rejected because old lab results can become misleading after stack resets.

## Decision: Store curated request presets as typed control-panel metadata

**Rationale**: Presets are learning content tied to existing lab modules and concepts. A typed metadata file near `lab-modules.ts` keeps them reviewable with the UI and avoids adding a backend content store.

**Alternatives considered**:

- Embed presets directly in the detail component: rejected because it would mix content with rendering.
- Fetch presets from Lab API: rejected for v1 because no server-side authoring or persistence is required.
- Generate presets dynamically from service discovery: rejected because service health does not explain lab objectives or expected observations.

## Decision: Bound response rendering and request execution

**Rationale**: Learners need enough response content to understand behavior, but unbounded bodies can freeze the UI. The request runner should enforce request timeout, and the UI should render a capped structured preview with copy access for full supported content when safe.

**Alternatives considered**:

- Render every response fully: rejected because large payloads can hurt responsiveness.
- Hide large response bodies completely: rejected because it weakens the lab learning loop.

## Decision: Classify utilities by safety

**Rationale**: Health checks and sample data helpers are different from reset actions. The UI must make state-changing utilities visibly different and require deliberate user action before running them.

**Alternatives considered**:

- Treat all utilities as simple buttons: rejected because destructive or state-changing lab actions need clear learner intent.
- Remove state-changing utilities from v1: rejected because cleanup and safe reset are useful lab support flows.

## Decision: Use focused unit, component, and API tests, not e2e tests

**Rationale**: The requested planning scope can be validated with component tests for UI states and Lab API tests for validation/dispatch. The user previously asked to skip e2e tests, so the plan excludes them.

**Alternatives considered**:

- Browser e2e automation: rejected due the user's explicit skip-e2e direction.
- Manual-only verification: rejected because the constitution requires test-first development.
