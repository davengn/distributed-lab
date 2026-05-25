# Tasks: MusicCorp UI Service

**Input**: Design documents from `/specs/005-musiccorp-ui-service/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included because the feature specification and constitution require test-first implementation for storefront behavior, backend adapter behavior, and 004 regression protection.

**Organization**: Tasks are grouped by user story to keep each story independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: User story label from spec.md. Setup, foundational, and polish tasks do not use story labels.
- Every task includes exact repository paths for the intended change.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the separate MusicCorp UI workspace and baseline build/test/container files.

- [X] T001 Create `apps/musiccorp-ui/package.json` with Next.js 16, React 19, Tailwind CSS, shadcn/ui runtime dependencies, lucide-react, Jest, and React Testing Library scripts.
- [X] T002 [P] Create TypeScript and Next.js configuration in `apps/musiccorp-ui/tsconfig.json` and `apps/musiccorp-ui/next.config.js`.
- [X] T003 [P] Create Tailwind and PostCSS configuration in `apps/musiccorp-ui/tailwind.config.ts` and `apps/musiccorp-ui/postcss.config.js`.
- [X] T004 [P] Create Jest configuration and setup in `apps/musiccorp-ui/jest.config.js` and `apps/musiccorp-ui/jest.setup.ts`.
- [X] T005 Create the production and development container setup in `apps/musiccorp-ui/Dockerfile`.
- [X] T006 Add root workspace scripts for the MusicCorp UI in `package.json` without changing existing control-panel scripts.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared primitives, layout, domain types, adapter scaffolding, cart persistence, and test fixtures used by all stories.

**Critical**: No user story work should begin until this phase is complete.

- [X] T007 Initialize shadcn/ui configuration in `apps/musiccorp-ui/components.json` and `apps/musiccorp-ui/src/lib/utils.ts`.
- [X] T008 Add shadcn/ui primitives for Button, Card, Sheet, Dialog, Input, Label, Select, Alert, Badge, Skeleton, Sonner, and Tooltip in `apps/musiccorp-ui/src/components/ui/`.
- [X] T009 Create app shell, metadata, font loading, and Sonner provider in `apps/musiccorp-ui/src/app/layout.tsx`.
- [X] T010 Create global Tailwind styles, design tokens, focus states, and responsive base rules in `apps/musiccorp-ui/src/styles/globals.css`.
- [X] T011 [P] Define CatalogItem, CartItem, Cart, CheckoutDraft, OrderSubmission, PaymentSubmission, CheckoutResult, StorefrontEvent, and BackendStatusMessage types in `apps/musiccorp-ui/src/lib/types.ts`.
- [X] T012 [P] Implement currency and subtotal helpers in `apps/musiccorp-ui/src/lib/money.ts`.
- [X] T013 [P] Implement session-scoped storefront event helpers in `apps/musiccorp-ui/src/lib/storefront-events.ts`.
- [X] T014 Implement typed backend adapter scaffolding, base URL configuration, timeouts, correlation IDs, and normalized BackendResult handling in `apps/musiccorp-ui/src/lib/musiccorp-api.ts`.
- [X] T015 Implement local cart persistence scaffolding and validation helpers in `apps/musiccorp-ui/src/lib/cart-store.ts`.
- [X] T016 [P] Create reusable catalog, cart, checkout, order, payment, and failure fixtures in `apps/musiccorp-ui/src/test/fixtures.ts`.
- [X] T017 [P] Create React Testing Library render helpers and fetch mocks in `apps/musiccorp-ui/src/test/test-utils.tsx`.

**Checkpoint**: The workspace builds enough for tests to import shared types, UI primitives, and adapter/cart scaffolding.

---

## Phase 3: User Story 1 - Browse the MusicCorp Storefront (Priority: P1)

**Goal**: A learner opens a customer-facing MusicCorp catalog, searches or filters albums, sees backend/empty/error states, and manages cart contents without using the 004 lab testing UI.

**Independent Test**: Start the backend, open the MusicCorp UI, verify catalog items from `/api/catalog` are visible, filterable, and addable to the cart, then refresh to verify cart restoration.

### Tests for User Story 1

Write these tests first and verify they fail before implementation.

- [X] T018 [P] [US1] Add failing catalog adapter tests for success, empty, unavailable, timeout, and malformed responses in `apps/musiccorp-ui/src/lib/musiccorp-api.catalog.test.ts`.
- [X] T019 [P] [US1] Add failing cart persistence tests for add, update, remove, blocked unavailable item, and restore flows in `apps/musiccorp-ui/src/lib/cart-store.test.ts`.
- [X] T020 [P] [US1] Add failing catalog page tests for loading, loaded, empty, no-results, retry, search, genre filter, and add-to-cart behavior in `apps/musiccorp-ui/src/app/__tests__/catalog-page.test.tsx`.
- [X] T021 [P] [US1] Add failing CartDrawer interaction tests for quantity changes, item removal, disabled checkout, and restored cart state in `apps/musiccorp-ui/src/components/__tests__/CartDrawer.test.tsx`.

### Implementation for User Story 1

- [X] T022 [US1] Implement `listCatalogItems()` and `getCatalogItem()` against `/api/catalog` and `/api/catalog/{id}` in `apps/musiccorp-ui/src/lib/musiccorp-api.ts`.
- [X] T023 [US1] Complete add, update, remove, subtotal, availability blocking, and restore behavior in `apps/musiccorp-ui/src/lib/cart-store.ts`.
- [X] T024 [P] [US1] Implement customer-readable catalog error and retry states in `apps/musiccorp-ui/src/components/BackendStatusBanner.tsx`.
- [X] T025 [P] [US1] Implement album card UI with shadcn Card, Button, Badge, Tooltip, local cover visual fallback, price, stock state, and add action in `apps/musiccorp-ui/src/components/ProductCard.tsx`.
- [X] T026 [P] [US1] Implement search, genre select, and available-only controls with shadcn Input, Select, and Label in `apps/musiccorp-ui/src/components/CatalogFilters.tsx`.
- [X] T027 [P] [US1] Implement responsive catalog grid, loading skeletons, empty state, and filtered no-results state in `apps/musiccorp-ui/src/components/CatalogGrid.tsx`.
- [X] T028 [US1] Implement cart drawer with shadcn Sheet controls, quantity buttons, removal, subtotal, disabled checkout state, and checkout link in `apps/musiccorp-ui/src/components/CartDrawer.tsx`.
- [X] T029 [US1] Implement the catalog route composition and data loading in `apps/musiccorp-ui/src/app/page.tsx`.
- [X] T030 [US1] Add local album cover placeholder assets and references in `apps/musiccorp-ui/public/covers/`.

**Checkpoint**: User Story 1 is independently functional and testable with mocked adapter responses or a healthy backend.

---

## Phase 4: User Story 2 - Complete a Simple Checkout (Priority: P1)

**Goal**: A learner can review the cart, enter customer details, create an order, submit payment, and see customer-readable confirmation or failure states while preserving input for retry.

**Independent Test**: Add albums to the cart, submit checkout with a valid email and supported payment method, and verify the confirmation shows backend order and payment status.

### Tests for User Story 2

Write these tests first and verify they fail before implementation.

- [X] T031 [P] [US2] Add failing order and payment adapter tests for success, validation error, unavailable backend, timeout, malformed response, and partial payment failure in `apps/musiccorp-ui/src/lib/musiccorp-api.checkout.test.ts`.
- [X] T032 [P] [US2] Add failing checkout form tests for invalid email, empty cart, payment method selection, duplicate-submit prevention, order failure, payment failure, and preserved draft state in `apps/musiccorp-ui/src/components/__tests__/CheckoutForm.test.tsx`.
- [X] T033 [P] [US2] Add failing checkout route tests for cart review, submitting order, submitting payment, success handoff, and return-to-catalog behavior in `apps/musiccorp-ui/src/app/checkout/__tests__/checkout-page.test.tsx`.
- [X] T034 [P] [US2] Add failing confirmation route tests for confirmed checkout, order-created-payment-failed state, missing result context, retry payment, and start-new-cart behavior in `apps/musiccorp-ui/src/app/confirmation/__tests__/confirmation-page.test.tsx`.

### Implementation for User Story 2

- [X] T035 [US2] Implement `createOrder()` and `submitPayment()` with backend-compatible bodies and `X-Correlation-ID` in `apps/musiccorp-ui/src/lib/musiccorp-api.ts`.
- [X] T036 [US2] Implement checkout server actions for order creation, payment submission, error normalization, and partial success handling in `apps/musiccorp-ui/src/app/checkout/actions.ts`.
- [X] T037 [US2] Implement checkout validation, shadcn form controls, duplicate-submit disabling, retry actions, and preserved form state in `apps/musiccorp-ui/src/components/CheckoutForm.tsx`.
- [X] T038 [US2] Implement cart review, backend status messages, and checkout flow orchestration in `apps/musiccorp-ui/src/app/checkout/page.tsx`.
- [X] T039 [US2] Implement order/payment confirmation UI, partial failure messaging, retry payment action, and clear-cart action in `apps/musiccorp-ui/src/components/OrderConfirmation.tsx`.
- [X] T040 [US2] Implement the confirmation route for confirmed, partial, and missing-context states in `apps/musiccorp-ui/src/app/confirmation/page.tsx`.

**Checkpoint**: User Story 2 works independently after a cart exists, and failures preserve the cart and checkout draft.

---

## Phase 5: User Story 3 - Experiment Through Website Behavior (Priority: P2)

**Goal**: A learner can use storefront actions during lab conditions to generate realistic catalog, order, and payment traffic and understand degraded backend behavior without raw API tooling.

**Independent Test**: Introduce a backend delay or outage, repeat catalog refresh or checkout, and verify the storefront displays matching loading, degraded, failure, retry, and action timing states.

### Tests for User Story 3

Write these tests first and verify they fail before implementation.

- [X] T041 [P] [US3] Add failing storefront activity tests for catalog load, add to cart, order submit, payment submit, retry, status, timestamp, and duration display in `apps/musiccorp-ui/src/components/__tests__/StorefrontActivityPanel.test.tsx`.
- [X] T042 [P] [US3] Add failing degraded-behavior tests for delayed catalog, failed order retry, payment timeout retry, and preserved cart/form context in `apps/musiccorp-ui/src/app/__tests__/storefront-degraded-states.test.tsx`.

### Implementation for User Story 3

- [X] T043 [US3] Extend adapter timeout categories, duration tracking, and action IDs for catalog, order, and payment calls in `apps/musiccorp-ui/src/lib/musiccorp-api.ts`.
- [X] T044 [US3] Persist recent storefront events without raw request editing in `apps/musiccorp-ui/src/lib/storefront-events.ts`.
- [X] T045 [US3] Implement the recent customer action summary using shadcn Card, Badge, and Tooltip in `apps/musiccorp-ui/src/components/StorefrontActivityPanel.tsx`.
- [X] T046 [US3] Integrate StorefrontActivityPanel and retry event recording into `apps/musiccorp-ui/src/app/page.tsx`.
- [X] T047 [US3] Integrate checkout action timing, degraded states, and retry event recording into `apps/musiccorp-ui/src/app/checkout/page.tsx`.

**Checkpoint**: User Story 3 generates lab-observable storefront actions while keeping the UI customer-facing.

---

## Phase 6: User Story 4 - Keep the Website Separate From Lab Controls (Priority: P3)

**Goal**: The MusicCorp website runs as its own service beside the existing control panel and 004 lab testing utilities, without importing or replacing request-composer behavior.

**Independent Test**: Start the platform and verify `http://localhost:3003` serves the MusicCorp website while `http://localhost:3000` still serves the existing control panel and 004 testing utilities.

### Tests for User Story 4

Write these tests first and verify they fail before implementation where applicable.

- [X] T048 [P] [US4] Add failing separation tests proving the MusicCorp UI does not render method/path/header/body composer controls or 004 request preset text in `apps/musiccorp-ui/src/app/__tests__/separation.test.tsx`.
- [X] T049 [P] [US4] Add or preserve focused 004 regression coverage for lab testing utilities in `apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx`.
- [X] T050 [P] [US4] Add or preserve focused 004 Lab API regression coverage for request runner behavior in `apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceRequestControllerTest.java` and `apps/lab-api/src/test/java/com/distributedlab/labapi/service/ServiceRequestRunnerTest.java`.

### Implementation for User Story 4

- [X] T051 [US4] Add `musiccorp-ui` service on port 3003 with `MUSICCORP_BACKEND_BASE_URL=http://monolith:8080`, health check, dependency on monolith, and 512 MB memory limit in `docker-compose.yml`.
- [X] T052 [US4] Add MusicCorp UI development bind mounts and dev command in `docker-compose.dev.yml`.
- [X] T053 [US4] Include MusicCorp UI in the smoke test runner dependencies and health output in `docker-compose.test.yml`.
- [X] T054 [US4] Verify no imports from `apps/control-panel/src/components/RequestComposer.tsx`, `apps/control-panel/src/components/RequestPresetList.tsx`, or 004 lab testing UI files are used in `apps/musiccorp-ui/src/`.

**Checkpoint**: User Story 4 confirms the new website complements 004 instead of replacing it.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility, responsive behavior, documentation, and regression checks across all stories.

- [X] T055 [P] Add MusicCorp UI usage and local endpoint documentation to `README.md`.
- [X] T056 [P] Add implementation notes for shadcn/ui primitives and backend adapter configuration to `apps/musiccorp-ui/README.md`.
- [X] T057 Run and fix MusicCorp UI unit/component tests from `specs/005-musiccorp-ui-service/quickstart.md`.
- [X] T058 Run and fix the MusicCorp UI production build from `specs/005-musiccorp-ui-service/quickstart.md`.
- [X] T059 Run and fix focused 004 regression commands from `specs/005-musiccorp-ui-service/quickstart.md`.
- [X] T060 Validate desktop, tablet, and mobile layouts at 375px, 768px, 1024px, and 1440px and record any fixes in `apps/musiccorp-ui/src/styles/globals.css`.
- [X] T061 Validate Docker Compose startup and health checks for MusicCorp UI, control-panel, lab-api, monolith, and postgres using `docker-compose.yml` and `docker-compose.test.yml`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. Blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational. MVP storefront browsing and cart.
- **User Story 2 (Phase 4)**: Depends on Foundational and uses cart behavior from US1 for the normal checkout path.
- **User Story 3 (Phase 5)**: Depends on Foundational and can be layered onto US1/US2 once those screens exist.
- **User Story 4 (Phase 6)**: Depends on Setup and can proceed after the app has a runnable route, but final validation needs US1.
- **Polish (Phase 7)**: Depends on all selected stories being complete.

### User Story Dependencies

- **US1 Browse the MusicCorp Storefront (P1)**: First MVP target after foundation.
- **US2 Complete a Simple Checkout (P1)**: Requires cart state from US1 for the full customer flow.
- **US3 Experiment Through Website Behavior (P2)**: Can extend US1 and US2 states without changing their acceptance criteria.
- **US4 Keep the Website Separate From Lab Controls (P3)**: Can be developed in parallel with US1/US2 Compose work once the app workspace exists.

### Within Each User Story

- Tests come before implementation and should fail first.
- Domain and adapter behavior come before UI composition.
- Shared UI primitives come before story components.
- Story checkpoint validation comes before starting lower-priority story work when implementing sequentially.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T011, T012, T013, T016, and T017 can run in parallel after T007-T010 are started.
- US1 tests T018-T021 can be written in parallel.
- US1 components T024-T027 can be implemented in parallel after T022-T023 define data behavior.
- US2 tests T031-T034 can be written in parallel.
- US4 regression/separation tests T048-T050 can be prepared in parallel with Compose tasks T051-T053.
- Documentation tasks T055-T056 can run in parallel after implementation paths are stable.

## Parallel Example: User Story 1

```bash
# Parallel test-authoring work:
Task: "T018 [P] [US1] Add failing catalog adapter tests in apps/musiccorp-ui/src/lib/musiccorp-api.catalog.test.ts"
Task: "T019 [P] [US1] Add failing cart persistence tests in apps/musiccorp-ui/src/lib/cart-store.test.ts"
Task: "T020 [P] [US1] Add failing catalog page tests in apps/musiccorp-ui/src/app/__tests__/catalog-page.test.tsx"
Task: "T021 [P] [US1] Add failing CartDrawer interaction tests in apps/musiccorp-ui/src/components/__tests__/CartDrawer.test.tsx"

# Parallel component work after adapter and cart behavior exist:
Task: "T024 [P] [US1] Implement BackendStatusBanner in apps/musiccorp-ui/src/components/BackendStatusBanner.tsx"
Task: "T025 [P] [US1] Implement ProductCard in apps/musiccorp-ui/src/components/ProductCard.tsx"
Task: "T026 [P] [US1] Implement CatalogFilters in apps/musiccorp-ui/src/components/CatalogFilters.tsx"
Task: "T027 [P] [US1] Implement CatalogGrid in apps/musiccorp-ui/src/components/CatalogGrid.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T031 [P] [US2] Add failing order and payment adapter tests in apps/musiccorp-ui/src/lib/musiccorp-api.checkout.test.ts"
Task: "T032 [P] [US2] Add failing checkout form tests in apps/musiccorp-ui/src/components/__tests__/CheckoutForm.test.tsx"
Task: "T033 [P] [US2] Add failing checkout route tests in apps/musiccorp-ui/src/app/checkout/__tests__/checkout-page.test.tsx"
Task: "T034 [P] [US2] Add failing confirmation route tests in apps/musiccorp-ui/src/app/confirmation/__tests__/confirmation-page.test.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T048 [P] [US4] Add failing separation tests in apps/musiccorp-ui/src/app/__tests__/separation.test.tsx"
Task: "T049 [P] [US4] Preserve 004 control-panel regression coverage in apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx"
Task: "T050 [P] [US4] Preserve 004 Lab API regression coverage in apps/lab-api/src/test/java/com/distributedlab/labapi/controller/ServiceRequestControllerTest.java and apps/lab-api/src/test/java/com/distributedlab/labapi/service/ServiceRequestRunnerTest.java"
Task: "T051 [US4] Add musiccorp-ui service in docker-compose.yml"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for User Story 1.
3. Stop and validate catalog load, filtering, cart add/update/remove, cart restoration, and backend error retry.
4. Demo MusicCorp UI browsing before implementing checkout.

### Incremental Delivery

1. Setup plus foundation creates a runnable isolated workspace.
2. US1 delivers the storefront and cart MVP.
3. US2 delivers checkout and confirmation.
4. US3 adds lab experiment behavior and action correlation.
5. US4 finishes service separation, Compose integration, and 004 regression protection.
6. Polish validates tests, builds, responsiveness, accessibility, and Docker health.

### Notes

- Keep `apps/control-panel` and `apps/lab-api` changes limited to regression test preservation unless a task explicitly says otherwise.
- Use shadcn/ui source components inside `apps/musiccorp-ui/src/components/ui/`; do not import a hosted UI service.
- Do not expose arbitrary HTTP method, path, header, or body editing in the MusicCorp UI.
- Commit after a completed phase or independently validated story when using the optional git hook workflow.
