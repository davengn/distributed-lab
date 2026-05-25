# Quickstart: Lab Testing Utilities

Use this workflow when implementing the feature from this plan.

## 1. Review Scope

- Read [spec.md](./spec.md), [data-model.md](./data-model.md), and both contracts in [contracts/](./contracts).
- Confirm the feature remains scoped to local lab services and does not become a general external request client.

## 2. Add Tests First

- Add failing control-panel tests for:
  - Rendering the testing workspace after selecting a lab module.
  - Loading a module preset into the composer.
  - Validating missing target/path/method fields.
  - Displaying success, failure, timeout, and truncated response states.
  - Keeping session request history, retrying an entry, and comparing two entries.
  - Labeling read-only versus state-changing utilities.
- Add failing Lab API tests for:
  - Listing allowed service request targets.
  - Blocking absolute URLs, parent-directory paths, unsupported methods, and unknown targets.
  - Returning structured success, validation, target unavailable, downstream failure, and timeout responses.
  - Requiring confirmation for state-changing utilities.

## 3. Implement Backend Contract

- Add Lab API models for targets, request drafts, request results, and utility run results.
- Add a target registry that resolves only known local lab services.
- Add a request runner that validates target, method, path, timeout, headers, and body before dispatch.
- Add structured logging for request outcome, target, method, path, duration, and error category.
- Add bounded response body preview handling.

## 4. Implement Control Panel Workspace

- Add typed client methods for the service-request contract.
- Add typed request presets for existing lab modules.
- Add the testing workspace, composer, preset list, result viewer, history panel, comparison behavior, and utilities panel.
- Integrate the workspace into the selected Labs detail flow without removing existing Overview, Experiments, or Guide content.
- Preserve dark/light mode, keyboard access, and existing panel/status styling.

## 5. Verify

Run focused checks:

```bash
pnpm --filter control-panel test -- src/app/labs/__tests__/labs.prototype.test.tsx src/lib/lab-testing-presets.test.ts src/lib/lab-testing-session.test.ts --runInBand
mvn -f pom.xml -pl apps/lab-api -Dtest=ServiceRequestControllerTest,ServiceRequestRunnerTest test
pnpm --filter control-panel build
mvn -f pom.xml -pl apps/lab-api -DskipTests compile
```

Do not add or run e2e tests for this feature unless the user explicitly changes that direction.

Notes from implementation:

- Lab API tests avoid Mockito mocks so they run under the local Java 25 runtime.
- Maven may print JaCoCo instrumentation warnings on Java 25 while still reporting test success.
- Control-panel verification covers the Labs workspace, request presets, session history, retry, comparison, and utility safety labels.

## 6. Manual Smoke Check

With the stack running, select a lab module in the Labs UI and verify:

- A service target can be selected.
- A preset loads into the composer.
- A request result shows status, duration, and response preview.
- A failed request keeps the draft and shows an actionable error.
- Recent history supports retry and comparison.
- Read-only and state-changing utilities are clearly distinguished.
