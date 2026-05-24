# Research: Lab Detail Content Completion

## Decision: Use existing module metadata and prototype contract as source of truth

**Rationale**: The current Labs page already defines five modules, feature names, tags, and selected-module behavior. The prior UI fidelity contract requires Overview, Experiments, and Guide tabs but does not define the missing tab content. Building from the existing module list keeps wording consistent and avoids expanding scope beyond the approved module inventory.

**Alternatives considered**:

- Add new lab modules: rejected because the request is to fill missing detail content, not expand the curriculum.
- Pull content from backend experiment state: rejected because the empty-tab problem exists even when no runtime experiment is active.

## Decision: Model experiments as static educational definitions separate from live activity

**Rationale**: Learners need to know what can be done even before a run is active. A static experiment catalog can list objective, setup, expected observation, and success signal while live status remains optional supporting information.

**Alternatives considered**:

- Keep showing only active experiments: rejected because "no experiments running" is not helpful for discovery.
- Hard-code paragraphs directly in the tab panel: rejected because structured data is easier to test for concept coverage and reuse across modules.

## Decision: Use grouped compact sections inside the existing tab panel

**Rationale**: The prototype-aligned control panel favors dense, bordered, scannable content. Experiment cards or grouped rows with concise headings fit the current tab structure without adding a new screen or changing navigation.

**Alternatives considered**:

- Navigate users to separate module-specific pages: rejected because the request targets the `/labs` detail section.
- Use long prose guides: rejected because learners need action-oriented steps they can scan during a lab.

## Decision: Require guide content to follow a repeatable learner workflow

**Rationale**: Each guide should answer the same questions: what is the goal, what must be ready, what steps to perform, what to observe, how to validate success, and how to clean up or continue. A consistent guide shape reduces cognitive load across modules.

**Alternatives considered**:

- Free-form guide text per module: rejected because it is harder to verify and easier for modules to drift.
- External documentation links only: rejected because the tab itself must be useful without requiring source or external docs.

## Decision: Extend existing Labs tests first

**Rationale**: `apps/control-panel/src/app/labs/__tests__/labs.prototype.test.tsx` already checks module inventory and tab switching. Updating those tests to expect real Experiments and Guide content creates a focused red test for this feature.

**Alternatives considered**:

- Add only manual visual checks: rejected because this is structured text behavior that can be asserted reliably.
- Create end-to-end coverage first: rejected for this narrow content patch; component/page tests cover the primary risk.

## Decision: Add no new runtime dependencies

**Rationale**: The feature is educational metadata and UI composition. Existing React, Tailwind, and test tooling are sufficient.

**Alternatives considered**:

- Markdown renderer for guide content: rejected because the content shape is predictable and can be represented with structured fields.
- Remote content loading: rejected because the local lab should work from `docker compose up` without extra content services.
