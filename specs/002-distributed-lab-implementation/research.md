# Phase 0 Research: DistributedLab UI Prototype Alignment Patch

## Decision: Treat `references/ui-prototype.html` as the authoritative UI source

**Rationale**: The feature exists because `specs/001-distributed-lab-docs/` described the broader platform but did not produce a UI matching the designed prototype. The corrective plan needs a single visual source of truth for screen inventory, layout density, labels, status colors, component ordering, and responsive behavior.

**Alternatives considered**:

- Use `001` plan and contracts as the source of truth: rejected because that is the artifact called out as mismatched.
- Use current implementation as source of truth: rejected because it omits prototype surfaces such as Labs detail tabs, Chaos active faults and topology composition, and Registry topology.
- Redesign from scratch: rejected because the user asked to follow the existing prototype.

## Decision: Keep the patch inside the existing control-panel app

**Rationale**: The current repository already has `apps/control-panel` with Next.js App Router pages, Tailwind tokens, shared components, theme support, and hooks for service/event data. Correcting the UI can be done by recomposing and extending these existing surfaces rather than creating a new frontend app or changing backend services.

**Alternatives considered**:

- Create a separate prototype clone: rejected because it would diverge from the running product.
- Move UI state into backend services: rejected because this is visual composition and interaction state, not service ownership.
- Replace the current frontend stack: rejected because it would add risk without improving prototype fidelity.

## Decision: Reuse and harden shared visual primitives

**Rationale**: The prototype relies on repeated primitives: panels, status pills, service cards, metric cards, data tables, progress bars, topology diagrams, forms, tabs, and toasts. Reusing shared primitives keeps Dashboard, Labs, Chaos, and Registry visually consistent and supports the constitution's UI consistency requirement.

**Alternatives considered**:

- Inline all page-specific markup: rejected because it encourages drift across screens.
- Introduce a full component library: rejected because the prototype uses a compact custom Primer-like style already represented by local tokens.

## Decision: Preserve existing data contracts where possible and use structural fallbacks only for UI review

**Rationale**: The prototype includes representative data. The running app should use existing Lab API/WebSocket data when available, but layout fidelity should remain reviewable when the backend is loading, empty, or unavailable. Fallback data may be used only to preserve the prototype structure during local review and must not override real data.

**Alternatives considered**:

- Require backend data before rendering any panel: rejected because it hides layout regressions and creates poor empty states.
- Hard-code all prototype data permanently: rejected because the control panel must still reflect the running sandbox.

## Decision: Verify visual parity across fixed viewport checkpoints

**Rationale**: The prototype defines responsive changes at wide desktop, tablet, and phone widths. The feature spec requires checking 1440px, 1024px, 768px, and 375px so the sidebar collapse, grid stacking, tables, topology SVGs, and form layouts are verified where regressions are likely.

**Alternatives considered**:

- Desktop-only review: rejected because the prototype includes explicit narrow-screen behavior.
- Snapshot-only testing: rejected because snapshots do not reliably catch visual overlap, clipped text, or contrast issues.

## Decision: No new runtime UI dependency for the first implementation pass

**Rationale**: The prototype's shapes are achievable with existing Tailwind tokens and inline SVG where topology diagrams are already used. Avoiding new runtime dependencies keeps performance and maintenance risk low.

**Alternatives considered**:

- Add an icon package: deferred. The prototype uses inline SVG icons and the app already uses SVG paths. Future tasks may adopt an icon library only if it improves consistency without changing the visual contract.
- Add a charting library: rejected for this patch. Prototype sparklines and topology diagrams are lightweight SVG.

## Decision: Accessibility requirements are part of fidelity, not a separate enhancement

**Rationale**: Prototype fidelity includes usable navigation, forms, tabs, buttons, status semantics, light/dark mode, and responsive behavior. The UI must keep visible focus states, keyboard order, sufficient text contrast, and touch target reliability while matching the dense developer-tool layout.

**Alternatives considered**:

- Do accessibility after visual matching: rejected because retrofitting accessibility can force layout changes after parity review.
- Treat prototype colors as exempt from contrast checks: rejected because the constitution requires usable UI across screens and themes.
