# Research: MusicCorp UI Service

## Decision: Add a separate `apps/musiccorp-ui` service

**Rationale**: The user asked for a real MusicCorp-like website, not another lab request composer. A separate app keeps customer simulation, lab orchestration, and 004 testing utilities in distinct ownership boundaries.

**Alternatives considered**:

- Extend `apps/control-panel`: rejected because it would mix customer traffic generation with lab controls and risk changing 004 behavior.
- Add the storefront inside the 004 testing workspace: rejected because the learner would still be operating through lab tooling rather than a realistic website.

## Decision: Use a server-side MusicCorp backend adapter

**Rationale**: The browser should interact with the storefront through same-origin UI behavior, while the app server talks to the local backend over Docker or localhost networking. This avoids CORS surprises, keeps backend URLs out of client code, and gives one place to normalize backend errors.

**Alternatives considered**:

- Browser calls directly to `localhost:8080`: rejected because Docker, gateway, and local development URLs differ and direct browser calls would expose backend topology.
- Send all storefront actions through the Lab API request runner from 004: rejected because it would preserve raw testing-tool semantics instead of customer-facing website behavior.

## Decision: Default to the existing MusicCorp monolith-compatible endpoint shape

**Rationale**: The current backend includes catalog, order, and payment behavior in the monolith and extracted service code. The safest first version points the storefront adapter at a configured MusicCorp backend base URL and expects the existing `/api/catalog`, `/api/orders`, and `/api/payments` capabilities.

**Alternatives considered**:

- Add new backend endpoints only for the storefront: rejected because the user asked to use the developed backend.
- Require all extracted services and gateway routes before the website works: rejected because the website should be usable from the standard local stack while still supporting lab experiments as backend routing changes.

## Decision: Keep checkout simple and failure-tolerant

**Rationale**: Labs intentionally create backend delay, outage, and inconsistent route states. The storefront should preserve cart and form state across failures and explain order/payment problems in business language while still surfacing enough status context for lab observation.

**Alternatives considered**:

- Hide backend failures behind generic customer messages: rejected because learners need to understand experiment outcomes.
- Treat every checkout failure as a cart reset: rejected because it makes repeat experiments slow and frustrating.

## Decision: Store cart state in the browser

**Rationale**: No learner accounts or long-term persistence are needed for the first version. Browser-local cart state supports refresh and retry while avoiding new database ownership.

**Alternatives considered**:

- Persist carts in a backend database: rejected because it adds service/data ownership not needed for lab traffic generation.
- Keep cart state only in component memory: rejected because a refresh during a lab would erase the experiment setup.

## Decision: Use a catalog-first storefront design

**Rationale**: UI guidance from `ui-ux-pro-max` recommends an entertainment-oriented, high-contrast, block-based style with simple calls to action. For this app, the first viewport should show real catalog content quickly, not a marketing landing page. Use album imagery or cover placeholders, clear pricing, accessible filters, and compact cart affordances.

**Alternatives considered**:

- Large hero-first marketing page: rejected because learners need a usable testing surface immediately.
- Dense control-panel visual style: rejected because this is a simulated customer website, not a developer tool.

## Decision: Use shadcn/ui as the storefront component primitive layer

**Rationale**: shadcn/ui provides source-owned React components for the exact primitives this storefront needs, including buttons, cards, dialogs, sheets, inputs, selects, alerts, skeletons, badges, tooltips, and toast notifications. Keeping those components inside `apps/musiccorp-ui/src/components/ui` speeds delivery while preserving local styling control and avoiding a hosted design-system dependency.

**Alternatives considered**:

- Hand-build every UI primitive: rejected because it slows implementation without adding meaningful lab value.
- Reuse control-panel components: rejected because the storefront needs a distinct customer-facing visual language and must keep 004 boundaries intact.

## Decision: Make storefront actions observable

**Rationale**: Customer actions should help learners correlate website behavior with backend metrics, logs, and traces. The UI can track action labels, timestamps, durations, status, and the business operation attempted without becoming a raw request tool.

**Alternatives considered**:

- No action summary in the website: rejected because learners would have less context while observing labs.
- Full HTTP request inspector: rejected because it duplicates 004 request-runner functionality.

## Decision: Add Compose wiring without changing 004

**Rationale**: The new app should start alongside the platform with its own port and health check. The control panel and Lab API keep their current contracts and tests.

**Alternatives considered**:

- Replace the control panel route for labs: rejected because it violates the user's requirement to keep 004.
- Run the website only as a manual local dev command: rejected because labs should work through the standard Docker Compose path.
