# Labs Detail Content Contract

This contract defines the visible content expectations for completing the Labs detail panel.

## Global Detail Panel Requirements

Every selected module detail panel must include:

- The existing Overview tab with module feature summaries.
- An Experiments tab with an experiment catalog.
- A Guide tab with structured learner instructions.
- Consistent tab behavior, active styling, keyboard access, and compact panel density.

The Experiments tab must never be replaced by only "No experiments running" text. If no live activity is active, show the available experiment catalog and optionally show a compact inactive-status note.

## Experiment Entry Contract

Each experiment entry must show:

- Title
- Covered concept or concepts
- Learning objective
- Setup or trigger
- Expected observation
- Success signal
- Optional duration or difficulty

## Guide Contract

Each module guide must show:

- Objective
- Prerequisites
- Setup check
- Ordered steps
- Observation checklist
- Validation criteria
- Cleanup or next steps

## Module Content Coverage

| Module | Required experiment coverage | Required guide emphasis |
|---|---|---|
| Migration & Decomposition | Strangler routing, parallel response comparison, feature-toggle migration, rollback or safe cutover | Start from the monolith, route one capability, compare behavior, flip traffic safely, validate rollback |
| Distributed Data & Consistency | CAP partition choice, replication lag/read-your-writes, multi-model query comparison, CDC pause/replay/corruption | Prepare sample data, create a consistency stress case, observe divergence, validate recovery |
| Resiliency & Chaos | Fault injection, circuit breaker behavior, bulkhead or cascading failure containment | Pick a target service, inject a bounded fault, observe breaker/failure-map behavior, stop and recover |
| Workflow & Communication | Orchestrated vs choreographed saga, idempotency replay, REST/gRPC/Kafka comparison, consumer contract breakage | Run a workflow, inspect message flow, replay safely, compare coupling, validate contract protection |
| Observability Suite | Metrics inspection, request tracing, log correlation, registry dependency inspection | Generate activity, find metrics/logs/traces, correlate one request, inspect dependency ownership and health |

## Accessibility and Responsiveness

- Tab controls must expose tab and tabpanel semantics.
- Keyboard focus must remain visible on module cards, tabs, and any actions or links.
- Content must wrap within the detail panel at 1440px, 1024px, 768px, and 375px.
- Long experiment names, concepts, and guide steps must not cause page-level horizontal overflow.

## Empty and Runtime States

- Available experiment definitions are always visible for the selected module.
- Live runtime status, when present, is secondary to the experiment definition.
- Inactive, failed, or unavailable runtime state must include useful explanatory text and preserve the educational content.

## Verification Rules

An implementation satisfies this contract when:

- All five modules show non-placeholder Experiments content.
- All five modules show non-placeholder Guide content.
- Every Overview feature is represented in the experiment catalog or guide.
- The content can be validated without requiring source-code inspection.
